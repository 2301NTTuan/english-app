import type { LexicalRelation, VocabularyItem } from "@/types/domain";

const clean = (value: string) => value.trim().replace(/\s+/g, " ");
const uniqueRelations = (relations: LexicalRelation[]) => [...new Map(relations.map((relation) => [clean(relation.word).toLocaleLowerCase(), { ...relation, word: clean(relation.word) }])).values()];

/** Normalizes authored/imported records without changing stable content IDs. */
export function normalizeVocabularyItem(item: VocabularyItem): VocabularyItem {
  return {
    ...item, id: clean(item.id), word: clean(item.word), lemma: clean(item.lemma ?? item.word), partOfSpeech: clean(item.partOfSpeech),
    meanings: item.meanings.map((meaning) => ({ ...meaning, definition: clean(meaning.definition), vietnamese: meaning.vietnamese ? clean(meaning.vietnamese) : undefined })),
    examples: [...new Set(item.examples.map(clean).filter(Boolean))], synonyms: uniqueRelations(item.synonyms), antonyms: uniqueRelations(item.antonyms),
    wordFamily: [...new Map(item.wordFamily.map((relation) => [`${clean(relation.word).toLocaleLowerCase()}:${clean(relation.partOfSpeech).toLocaleLowerCase()}`, { word: clean(relation.word), partOfSpeech: clean(relation.partOfSpeech) }])).values()],
    collocations: [...new Set(item.collocations.map(clean).filter(Boolean))], topics: [...new Set((item.topics ?? []).map(clean).filter(Boolean))], tags: [...new Set(item.tags.map(clean).filter(Boolean))],
  };
}
