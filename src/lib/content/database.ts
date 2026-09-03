import "server-only";

import { and, asc, count, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { expressions, grammarLessons, grammarPrerequisites, grammarSubtopics, grammarTopics as grammarTopicsTable, placementItems, placementPassages, vocabularyContent, vocabularyExamples, vocabularyMeanings } from "@/db/schema";
import { grammarTopics as curriculumGrammarTopics } from "@/data/grammar";
import { visibleContentStatuses } from "@/lib/content/release";
import type { CEFRLevel, ExpressionItem, GrammarTopic, PlacementDimension, PlacementQuestion, ReadingPassage } from "@/types/domain";

export interface VocabularyPageQuery { page?: number; pageSize?: number; level?: CEFRLevel; search?: string; topic?: string; partOfSpeech?: string; frequencyBand?: "very-common" | "common" | "less-common" | "advanced" }
export interface ExpressionPageQuery { page?: number; pageSize?: number; level?: CEFRLevel; search?: string; topic?: string; kind?: ExpressionItem["kind"] }

export async function queryVocabularyPage(input: VocabularyPageQuery) {
  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const pageSize = Math.max(1, Math.min(24, Math.trunc(input.pageSize ?? 24)));
  const search = input.search?.trim();
  const conditions = [eq(vocabularyContent.active, true), inArray(vocabularyContent.status, visibleContentStatuses())];
  if (input.level) conditions.push(eq(vocabularyContent.level, input.level));
  if (input.partOfSpeech) conditions.push(eq(vocabularyContent.partOfSpeech, input.partOfSpeech));
  if (input.frequencyBand) conditions.push(eq(vocabularyContent.frequencyBand, input.frequencyBand));
  if (input.topic) conditions.push(sql`${input.topic} = any(${vocabularyContent.topics})`);
  if (search) conditions.push(or(ilike(vocabularyContent.word, `%${search}%`), ilike(vocabularyMeanings.englishDefinition, `%${search}%`), ilike(vocabularyMeanings.vietnameseMeaning, `%${search}%`))!);
  const where = and(...conditions);
  const db = getDb();
  const [{ total }] = await db.select({ total: count() }).from(vocabularyContent)
    .leftJoin(vocabularyMeanings, and(eq(vocabularyMeanings.vocabularyId, vocabularyContent.id), eq(vocabularyMeanings.position, 0))).where(where);
  const items = await db.select({
    id: vocabularyContent.contentId, word: vocabularyContent.word, lemma: vocabularyContent.lemma,
    partOfSpeech: vocabularyContent.partOfSpeech, level: vocabularyContent.level, frequencyRank: vocabularyContent.frequencyRank,
    frequencyBand: vocabularyContent.frequencyBand, status: vocabularyContent.status, cefrBasis: vocabularyContent.cefrBasis, frequencyBasis: vocabularyContent.frequencyBasis, provenanceId: vocabularyContent.provenanceId, topics: vocabularyContent.topics, tags: vocabularyContent.tags,
    definition: vocabularyMeanings.englishDefinition, vietnamese: vocabularyMeanings.vietnameseMeaning, example: vocabularyExamples.sentence,
  }).from(vocabularyContent)
    .leftJoin(vocabularyMeanings, and(eq(vocabularyMeanings.vocabularyId, vocabularyContent.id), eq(vocabularyMeanings.position, 0)))
    .leftJoin(vocabularyExamples, and(eq(vocabularyExamples.vocabularyId, vocabularyContent.id), eq(vocabularyExamples.position, 0)))
    .where(where).orderBy(asc(vocabularyContent.frequencyRank), asc(vocabularyContent.word)).limit(pageSize).offset((page - 1) * pageSize);
  return { items, page, pageSize, total, pageCount: Math.max(1, Math.ceil(total / pageSize)), filters: { level: input.level ?? null, search: search ?? null, topic: input.topic ?? null, partOfSpeech: input.partOfSpeech ?? null, frequencyBand: input.frequencyBand ?? null } };
}

export async function queryGrammarCatalogue() {
  const db = getDb();
  const rows = await db.select({
    databaseId: grammarTopicsTable.id, id: grammarTopicsTable.contentId, title: grammarTopicsTable.title,
    level: grammarTopicsTable.level, category: grammarTopicsTable.category, description: grammarTopicsTable.description,
    explanation: grammarLessons.englishExplanation, structures: grammarLessons.structures,
    examples: grammarLessons.examples, commonMistakes: grammarLessons.commonMistakes,
  }).from(grammarTopicsTable).innerJoin(grammarLessons, eq(grammarLessons.grammarTopicId, grammarTopicsTable.id)).where(eq(grammarTopicsTable.active, true));
  const databaseIds = rows.map((row) => row.databaseId);
  const subtopicRows = databaseIds.length ? await db.select({
    grammarTopicId: grammarSubtopics.grammarTopicId, id: grammarSubtopics.contentId, title: grammarSubtopics.title, position: grammarSubtopics.position,
  }).from(grammarSubtopics).where(inArray(grammarSubtopics.grammarTopicId, databaseIds)).orderBy(asc(grammarSubtopics.position)) : [];
  const prerequisiteRows = databaseIds.length ? await db.select({
    grammarTopicId: grammarPrerequisites.grammarTopicId, prerequisiteTopicId: grammarPrerequisites.prerequisiteTopicId,
  }).from(grammarPrerequisites).where(inArray(grammarPrerequisites.grammarTopicId, databaseIds)) : [];
  const contentIdByDatabaseId = new Map(rows.map((row) => [row.databaseId, row.id]));
  const order = new Map(curriculumGrammarTopics.map((topic, index) => [topic.id, index]));
  const items: GrammarTopic[] = rows.map((row) => ({
    id: row.id, title: row.title, level: row.level, category: row.category, description: row.description,
    explanation: row.explanation, structures: row.structures,
    examples: row.examples as GrammarTopic["examples"], commonMistakes: row.commonMistakes as GrammarTopic["commonMistakes"],
    prerequisites: prerequisiteRows.filter((item) => item.grammarTopicId === row.databaseId).map((item) => contentIdByDatabaseId.get(item.prerequisiteTopicId)).filter((id): id is string => Boolean(id)),
    subtopics: subtopicRows.filter((item) => item.grammarTopicId === row.databaseId).map(({ id, title }) => ({ id, title })),
  })).sort((a, b) => (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.id) ?? Number.MAX_SAFE_INTEGER));
  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return { items, total: items.length, byLevel: Object.fromEntries(levels.map((level) => [level, items.filter((item) => item.level === level).length])) as Record<CEFRLevel, number> };
}

export async function queryGrammarLesson(contentId: string) {
  const catalogue = await queryGrammarCatalogue();
  return catalogue.items.find((item) => item.id === contentId);
}

export async function queryExpressionsPage(input: ExpressionPageQuery) {
  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const pageSize = Math.max(1, Math.min(48, Math.trunc(input.pageSize ?? 24)));
  const search = input.search?.trim();
  const releaseConditions = [eq(expressions.active, true), inArray(expressions.status, visibleContentStatuses())];
  const conditions = [...releaseConditions];
  if (input.level) conditions.push(eq(expressions.level, input.level));
  if (input.kind) conditions.push(eq(expressions.kind, input.kind));
  if (input.topic) conditions.push(sql`${input.topic} = any(${expressions.topics})`);
  if (search) conditions.push(or(ilike(expressions.expression, `%${search}%`), ilike(expressions.meaning, `%${search}%`), ilike(expressions.vietnameseMeaning, `%${search}%`))!);
  const db = getDb();
  const where = and(...conditions);
  const [{ total }] = await db.select({ total: count() }).from(expressions).where(where);
  const items = await db.select({ id: expressions.contentId, expression: expressions.expression, kind: expressions.kind, meaning: expressions.meaning, vietnameseMeaning: expressions.vietnameseMeaning, cefrLevel: expressions.level, examples: expressions.examples, usageNotes: expressions.usageNotes, tags: expressions.topics, status: expressions.status, relatedVerb: expressions.baseVerb, separability: expressions.separability })
    .from(expressions).where(where).orderBy(asc(expressions.expression), asc(expressions.contentId)).limit(pageSize).offset((page - 1) * pageSize);
  const [corpusCount, kindCounts, levelCounts, topicRows] = await Promise.all([
    db.select({ total: count() }).from(expressions).where(and(...releaseConditions)),
    db.select({ value: expressions.kind, total: count() }).from(expressions).where(and(...releaseConditions)).groupBy(expressions.kind),
    db.select({ value: expressions.level, total: count() }).from(expressions).where(and(...releaseConditions)).groupBy(expressions.level),
    db.select({ topics: expressions.topics }).from(expressions).where(and(...releaseConditions)),
  ]);
  return { items: items.map((item) => ({ ...item, vietnameseMeaning: item.vietnameseMeaning ?? "", usageNotes: item.usageNotes ?? "", status: item.status as ExpressionItem["status"], relatedVerb: item.relatedVerb ?? undefined, separability: item.separability as ExpressionItem["separability"] })), page, pageSize, total, pageCount: Math.max(1, Math.ceil(total / pageSize)), filters: { level: input.level ?? null, search: search ?? null, topic: input.topic ?? null, kind: input.kind ?? null }, corpus: { total: corpusCount[0].total, byKind: Object.fromEntries(kindCounts.map((row) => [row.value, row.total])), byLevel: Object.fromEntries(levelCounts.map((row) => [row.value, row.total])), topics: [...new Set(topicRows.flatMap((row) => row.topics))].sort() } };
}

export async function queryPlacementBank() {
  const preview = process.env.NODE_ENV !== "production" || process.env.PLACEMENT_CONTENT_CHANNEL === "validated-preview";
  const statuses = preview ? ["validated", "reviewed", "published"] : ["published"];
  const db = getDb();
  const [itemRows, passageRows] = await Promise.all([
    db.select().from(placementItems).where(inArray(placementItems.status, statuses)).orderBy(asc(placementItems.contentId)),
    db.select().from(placementPassages).where(inArray(placementPassages.status, statuses)).orderBy(asc(placementPassages.contentId)),
  ]);
  const items: PlacementQuestion[] = itemRows.map((row) => ({
    id: row.contentId,
    itemId: row.contentId,
    knowledgeType: row.domain === "grammar" ? "grammar" : "vocabulary",
    type: row.domain === "context" || row.domain === "reading" ? "context" : "multiple-choice",
    prompt: row.prompt,
    options: row.options as string[],
    answer: row.answer,
    explanation: row.explanation,
    level: row.level,
    dimension: row.domain as PlacementDimension,
    topic: row.topic,
    subtopic: row.subtopic,
    difficulty: row.difficulty,
    discrimination: row.discrimination,
    status: row.status as PlacementQuestion["status"],
    provenanceId: row.provenanceId,
    passageId: row.passageContentId ?? undefined,
  }));
  const passages: ReadingPassage[] = passageRows.map((row) => ({
    id: row.contentId,
    title: row.title,
    text: row.passage,
    level: row.level,
    status: row.status as ReadingPassage["status"],
    provenanceId: row.provenanceId,
  }));
  return { items, passages };
}
