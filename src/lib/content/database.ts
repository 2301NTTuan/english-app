import "server-only";

import { and, asc, count, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { vocabularyContent, vocabularyExamples, vocabularyMeanings } from "@/db/schema";
import type { CEFRLevel } from "@/types/domain";

export interface VocabularyPageQuery { page?: number; pageSize?: number; level?: CEFRLevel; search?: string; topic?: string; partOfSpeech?: string; frequencyBand?: "very-common" | "common" | "less-common" | "advanced" }

export async function queryVocabularyPage(input: VocabularyPageQuery) {
  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const pageSize = Math.max(1, Math.min(24, Math.trunc(input.pageSize ?? 24)));
  const search = input.search?.trim();
  const preview = process.env.NODE_ENV !== "production" || process.env.CONTENT_RELEASE_CHANNEL === "validated-preview";
  const conditions = [eq(vocabularyContent.active, true), preview ? inArray(vocabularyContent.status, ["validated", "reviewed", "published"]) : eq(vocabularyContent.status, "published")];
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
