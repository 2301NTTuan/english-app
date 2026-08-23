import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { vocabulary } from "../src/data/vocabulary";
import { detailedGrammarTopics, grammarTopics } from "../src/data/grammar";
import { expressions as expressionData } from "../src/data/expressions";
import { getDb, getPool } from "../src/db/client";
import { collocations, contentVersions, expressions, grammarLessons, grammarPrerequisites, grammarSubtopics, grammarTopics as grammarTopicsTable, vocabularyContent, vocabularyExamples, vocabularyMeanings, vocabularyRelations, wordFamilies } from "../src/db/schema";

const version = process.env.CONTENT_VERSION ?? "bundled-v1";
const checksum = createHash("sha256").update(JSON.stringify({ vocabulary, grammarTopics, expressionData })).digest("hex");
const db = getDb();

try {
  await db.transaction(async (tx) => {
    const [contentVersion] = await tx.insert(contentVersions).values({ version, checksum, publishedAt: new Date() })
      .onConflictDoUpdate({ target: contentVersions.version, set: { checksum, publishedAt: new Date() } }).returning({ id: contentVersions.id });
    const vocabularyIds = new Map<string, string>();
    for (const item of vocabulary) {
      const [row] = await tx.insert(vocabularyContent).values({ contentId: item.id, word: item.word, lemma: item.lemma, partOfSpeech: item.partOfSpeech, level: item.cefrLevel, frequencyRank: item.frequencyRank, frequencyBand: item.frequencyBand, topics: item.topics ?? [], tags: item.tags, contentVersionId: contentVersion.id })
        .onConflictDoUpdate({ target: vocabularyContent.contentId, set: { word: item.word, lemma: item.lemma, partOfSpeech: item.partOfSpeech, level: item.cefrLevel, frequencyRank: item.frequencyRank, frequencyBand: item.frequencyBand, topics: item.topics ?? [], tags: item.tags, contentVersionId: contentVersion.id, updatedAt: new Date() } }).returning({ id: vocabularyContent.id });
      vocabularyIds.set(item.id, row.id);
      await tx.delete(vocabularyMeanings).where(eq(vocabularyMeanings.vocabularyId, row.id)); await tx.delete(vocabularyExamples).where(eq(vocabularyExamples.vocabularyId, row.id)); await tx.delete(vocabularyRelations).where(eq(vocabularyRelations.sourceVocabularyId, row.id)); await tx.delete(wordFamilies).where(eq(wordFamilies.vocabularyId, row.id));
      if (item.meanings.length) await tx.insert(vocabularyMeanings).values(item.meanings.map((meaning, position) => ({ vocabularyId: row.id, position, englishDefinition: meaning.definition, vietnameseMeaning: meaning.vietnamese, usageNotes: meaning.usageNotes })));
      if (item.examples.length) await tx.insert(vocabularyExamples).values(item.examples.map((sentence, position) => ({ vocabularyId: row.id, position, sentence })));
      if (item.wordFamily.length) await tx.insert(wordFamilies).values(item.wordFamily.map((family) => ({ vocabularyId: row.id, word: family.word, partOfSpeech: family.partOfSpeech })));
    }
    for (const item of vocabulary) {
      const sourceVocabularyId = vocabularyIds.get(item.id)!;
      const relations = [...item.synonyms.map((relation) => ({ ...relation, relationType: "synonym" })), ...item.antonyms.map((relation) => ({ ...relation, relationType: "antonym" }))];
      if (relations.length) await tx.insert(vocabularyRelations).values(relations.map((relation) => ({ sourceVocabularyId, targetWord: relation.word, targetVocabularyId: vocabulary.find((candidate) => candidate.word.toLowerCase() === relation.word.toLowerCase()) ? vocabularyIds.get(vocabulary.find((candidate) => candidate.word.toLowerCase() === relation.word.toLowerCase())!.id) : undefined, relationType: relation.relationType, strength: Math.round(relation.strength), register: relation.register, usageNote: relation.usage ?? relation.notes })));
    }

    const grammarIds = new Map<string, string>();
    for (const topic of grammarTopics) {
      const [row] = await tx.insert(grammarTopicsTable).values({ contentId: topic.id, title: topic.title, level: topic.level, category: topic.category, description: topic.description })
        .onConflictDoUpdate({ target: grammarTopicsTable.contentId, set: { title: topic.title, level: topic.level, category: topic.category, description: topic.description, updatedAt: new Date() } }).returning({ id: grammarTopicsTable.id });
      grammarIds.set(topic.id, row.id);
      await tx.delete(grammarSubtopics).where(eq(grammarSubtopics.grammarTopicId, row.id));
      if (topic.subtopics.length) await tx.insert(grammarSubtopics).values(topic.subtopics.map((subtopic, position) => ({ grammarTopicId: row.id, contentId: subtopic.id, title: subtopic.title, position })));
      if (detailedGrammarTopics.some((candidate) => candidate.id === topic.id)) await tx.insert(grammarLessons).values({ grammarTopicId: row.id, englishExplanation: topic.explanation, structures: topic.structures, examples: topic.examples, commonMistakes: topic.commonMistakes, contentVersionId: contentVersion.id })
        .onConflictDoUpdate({ target: grammarLessons.grammarTopicId, set: { englishExplanation: topic.explanation, structures: topic.structures, examples: topic.examples, commonMistakes: topic.commonMistakes, contentVersionId: contentVersion.id, updatedAt: new Date() } });
    }
    for (const id of grammarIds.values()) await tx.delete(grammarPrerequisites).where(eq(grammarPrerequisites.grammarTopicId, id));
    for (const topic of grammarTopics) {
      const sourceId = grammarIds.get(topic.id)!; const prerequisites = topic.prerequisites.map((id) => grammarIds.get(id)).filter((id): id is string => Boolean(id));
      if (prerequisites.length) await tx.insert(grammarPrerequisites).values(prerequisites.map((prerequisiteTopicId) => ({ grammarTopicId: sourceId, prerequisiteTopicId })));
    }

    for (const item of expressionData) await tx.insert(expressions).values({ contentId: item.id, kind: item.kind, expression: item.expression, baseVerb: item.relatedVerb, meaning: item.meaning, vietnameseMeaning: item.vietnameseMeaning, level: item.cefrLevel, examples: item.examples, usageNotes: item.usageNotes, separability: item.separability, topics: item.tags })
      .onConflictDoUpdate({ target: expressions.contentId, set: { kind: item.kind, expression: item.expression, baseVerb: item.relatedVerb, meaning: item.meaning, vietnameseMeaning: item.vietnameseMeaning, level: item.cefrLevel, examples: item.examples, usageNotes: item.usageNotes, separability: item.separability, topics: item.tags, updatedAt: new Date() } });
    for (const item of expressionData.filter((item) => item.kind === "collocation")) await tx.insert(collocations).values({ contentId: item.id, phrase: item.expression, level: item.cefrLevel, meaning: item.meaning, vietnameseMeaning: item.vietnameseMeaning, example: item.examples[0], topics: item.tags })
      .onConflictDoUpdate({ target: collocations.contentId, set: { phrase: item.expression, level: item.cefrLevel, meaning: item.meaning, vietnameseMeaning: item.vietnameseMeaning, example: item.examples[0], topics: item.tags, updatedAt: new Date() } });
  });
  console.log(`Seeded ${vocabulary.length} vocabulary items, ${grammarTopics.length} grammar topics, and ${expressionData.length} expressions (${checksum.slice(0, 12)}).`);
} finally { await getPool().end(); }
