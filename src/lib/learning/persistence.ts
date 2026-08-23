import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  auditLogs,
  grammarProgress,
  grammarTopics,
  learningPathItems,
  learningPaths,
  learningPreferences,
  mistakes,
  placementAnswers,
  placementAttempts,
  reviewStates,
  studySessionItems,
  studySessions,
  userStateSnapshots,
  vocabularyContent,
  vocabularyProgress,
} from "@/db/schema";
import { buildLearningPath } from "@/lib/learning/path";
import type { PlacementWrite, StudySessionWrite } from "@/lib/validation/learning-write";
import type { AppState, ReviewState } from "@/types/domain";

type Database = ReturnType<typeof getDb>;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

function reviewValues(userId: string, knowledgeType: "vocabulary" | "grammar", knowledgeContentId: string, review: ReviewState) {
  return {
    userId, knowledgeType, knowledgeContentId, status: review.state, difficulty: review.difficulty,
    stability: review.stability, dueAt: new Date(review.nextReview), lastReviewedAt: review.lastReview ? new Date(review.lastReview) : null,
    scheduledDays: Math.round(review.scheduledDays), elapsedDays: review.elapsedDays, reviewCount: review.reviewCount,
    correctCount: review.correctCount, incorrectCount: review.incorrectCount, lapses: review.lapses, updatedAt: new Date(),
  } as const;
}

async function persistPreferences(tx: Transaction, userId: string, state: AppState) {
  const values = {
    userId, currentLevel: state.settings.currentLevel, dailyTarget: state.settings.dailyTarget,
    maxNewWordsPerDay: state.settings.maxNewWordsPerDay, maxNewGrammarPerDay: state.settings.maxNewGrammarTopicsPerDay,
    desiredRetention: state.settings.desiredRetention, interfaceLanguage: state.settings.interfaceLanguage,
    showVietnamese: state.settings.showVietnamese, updatedAt: new Date(),
  } as const;
  await tx.insert(learningPreferences).values(values).onConflictDoUpdate({
    target: learningPreferences.userId,
    set: { currentLevel: values.currentLevel, dailyTarget: values.dailyTarget, maxNewWordsPerDay: values.maxNewWordsPerDay, maxNewGrammarPerDay: values.maxNewGrammarPerDay, desiredRetention: values.desiredRetention, interfaceLanguage: values.interfaceLanguage, showVietnamese: values.showVietnamese, updatedAt: values.updatedAt },
  });
}

async function persistSnapshot(tx: Transaction, userId: string, state: AppState, importedLegacyAt?: Date) {
  const now = new Date();
  await tx.insert(userStateSnapshots).values({ userId, schemaVersion: 1, state, importedLegacyAt, updatedAt: now })
    .onConflictDoUpdate({ target: userStateSnapshots.userId, set: { state, schemaVersion: 1, ...(importedLegacyAt ? { importedLegacyAt } : {}), updatedAt: now } });
}

async function persistProgress(tx: Transaction, userId: string, state: AppState) {
  const vocabularyIds = [...new Set(state.vocabularyProgress.map((item) => item.itemId))];
  const grammarIds = [...new Set(state.grammarProgress.map((item) => item.topicId))];
  const vocabularyRows = vocabularyIds.length
    ? await tx.select({ id: vocabularyContent.id, contentId: vocabularyContent.contentId }).from(vocabularyContent).where(inArray(vocabularyContent.contentId, vocabularyIds))
    : [];
  const grammarRows = grammarIds.length
    ? await tx.select({ id: grammarTopics.id, contentId: grammarTopics.contentId }).from(grammarTopics).where(inArray(grammarTopics.contentId, grammarIds))
    : [];
  const vocabularyMap = new Map(vocabularyRows.map((row) => [row.contentId, row.id]));
  const grammarMap = new Map(grammarRows.map((row) => [row.contentId, row.id]));
  const missingVocabulary = vocabularyIds.filter((id) => !vocabularyMap.has(id));
  const missingGrammar = grammarIds.filter((id) => !grammarMap.has(id));
  if (missingVocabulary.length || missingGrammar.length) throw new Error(`Unknown content references: ${[...missingVocabulary, ...missingGrammar].join(", ")}`);

  for (const item of state.vocabularyProgress) {
    const values = { userId, vocabularyId: vocabularyMap.get(item.itemId)!, ...item.mastery, updatedAt: new Date() };
    await tx.insert(vocabularyProgress).values(values).onConflictDoUpdate({
      target: [vocabularyProgress.userId, vocabularyProgress.vocabularyId],
      set: { recognition: values.recognition, recall: values.recall, context: values.context, spelling: values.spelling, overall: values.overall, updatedAt: values.updatedAt },
    });
    const review = reviewValues(userId, "vocabulary", item.itemId, item.review);
    await tx.insert(reviewStates).values(review).onConflictDoUpdate({
      target: [reviewStates.userId, reviewStates.knowledgeType, reviewStates.knowledgeContentId],
      set: { status: review.status, difficulty: review.difficulty, stability: review.stability, dueAt: review.dueAt, lastReviewedAt: review.lastReviewedAt, scheduledDays: review.scheduledDays, elapsedDays: review.elapsedDays, reviewCount: review.reviewCount, correctCount: review.correctCount, incorrectCount: review.incorrectCount, lapses: review.lapses, version: sql`${reviewStates.version} + 1`, updatedAt: review.updatedAt },
    });
  }

  for (const item of state.grammarProgress) {
    const values = { userId, grammarTopicId: grammarMap.get(item.topicId)!, mastery: Math.round(item.mastery), subtopicMastery: item.subtopicMastery, updatedAt: new Date() };
    await tx.insert(grammarProgress).values(values).onConflictDoUpdate({
      target: [grammarProgress.userId, grammarProgress.grammarTopicId],
      set: { mastery: values.mastery, subtopicMastery: values.subtopicMastery, updatedAt: values.updatedAt },
    });
    const review = reviewValues(userId, "grammar", item.topicId, item.review);
    await tx.insert(reviewStates).values(review).onConflictDoUpdate({
      target: [reviewStates.userId, reviewStates.knowledgeType, reviewStates.knowledgeContentId],
      set: { status: review.status, difficulty: review.difficulty, stability: review.stability, dueAt: review.dueAt, lastReviewedAt: review.lastReviewedAt, scheduledDays: review.scheduledDays, elapsedDays: review.elapsedDays, reviewCount: review.reviewCount, correctCount: review.correctCount, incorrectCount: review.incorrectCount, lapses: review.lapses, version: sql`${reviewStates.version} + 1`, updatedAt: review.updatedAt },
    });
  }

  for (const item of state.mistakes) {
    const values = {
      userId, knowledgeType: item.knowledgeType, knowledgeContentId: item.itemId, subtopicContentId: item.subtopicId,
      exerciseType: item.exerciseType, question: item.label, userAnswer: item.wrongAnswer, correctAnswer: item.correctAnswer,
      repeatCount: item.repeatedCount, resolved: item.resolved, lastOccurredAt: new Date(item.timestamp), updatedAt: new Date(),
    } as const;
    await tx.insert(mistakes).values(values).onConflictDoUpdate({
      target: [mistakes.userId, mistakes.knowledgeType, mistakes.knowledgeContentId, mistakes.exerciseType],
      set: { subtopicContentId: values.subtopicContentId, question: values.question, userAnswer: values.userAnswer, correctAnswer: values.correctAnswer, repeatCount: values.repeatCount, resolved: values.resolved, lastOccurredAt: values.lastOccurredAt, updatedAt: values.updatedAt },
    });
  }
}

async function persistLearningPath(tx: Transaction, userId: string, state: AppState) {
  const items = buildLearningPath(state);
  await tx.update(learningPaths).set({ active: false }).where(and(eq(learningPaths.userId, userId), eq(learningPaths.active, true)));
  const [{ version }] = await tx.select({ version: sql<number>`coalesce(max(${learningPaths.version}), 0) + 1` }).from(learningPaths).where(eq(learningPaths.userId, userId));
  const [path] = await tx.insert(learningPaths).values({ userId, version: Number(version), inputs: { currentLevel: state.settings.currentLevel, placementLevel: state.placement?.estimatedLevel ?? null }, active: true }).returning({ id: learningPaths.id });
  if (items.length) await tx.insert(learningPathItems).values(items.map((item, position) => ({ learningPathId: path.id, knowledgeType: item.knowledgeType, knowledgeContentId: item.itemId, status: item.state, priority: Math.round(item.priority), reason: item.reason, position })));
  return path.id;
}

async function persistState(tx: Transaction, userId: string, state: AppState, importedLegacyAt?: Date) {
  await persistPreferences(tx, userId, state);
  await persistProgress(tx, userId, state);
  await persistSnapshot(tx, userId, state, importedLegacyAt);
}

export async function saveLearningState(userId: string, state: AppState) {
  await getDb().transaction((tx) => persistState(tx, userId, state));
}

export async function importLegacyLearningState(userId: string, state: AppState) {
  return getDb().transaction(async (tx) => {
    await persistState(tx, userId, state, new Date());
    const pathId = await persistLearningPath(tx, userId, state);
    await tx.insert(auditLogs).values({ userId, action: "learning_state.legacy_imported", entityType: "learning_path", entityId: pathId });
  });
}

export async function completeStudySession(userId: string, input: StudySessionWrite) {
  return getDb().transaction(async (tx) => {
    const completedAt = new Date(input.completedAt);
    const startedAt = new Date(input.startedAt);
    const correct = input.items.filter((item) => item.correct).length;
    const [session] = await tx.insert(studySessions).values({
      userId, idempotencyKey: input.idempotencyKey, startedAt, completedAt, correct, total: input.items.length,
      minutes: Math.max(1, Math.round((completedAt.getTime() - startedAt.getTime()) / 60_000)),
      summary: input.state.activities[0] ?? {},
    }).onConflictDoNothing({ target: [studySessions.userId, studySessions.idempotencyKey] }).returning({ id: studySessions.id });
    if (!session) return { duplicate: true } as const;
    await tx.insert(studySessionItems).values(input.items.map((item) => ({ studySessionId: session.id, ...item })));
    await persistState(tx, userId, input.state);
    const pathId = await persistLearningPath(tx, userId, input.state);
    await tx.insert(auditLogs).values({ userId, action: "study_session.completed", entityType: "study_session", entityId: session.id, metadata: { pathId } });
    return { duplicate: false, sessionId: session.id } as const;
  });
}

export async function completePlacement(userId: string, input: PlacementWrite) {
  const result = input.state.placement;
  if (!result) throw new Error("Placement result is required.");
  return getDb().transaction(async (tx) => {
    const [attempt] = await tx.insert(placementAttempts).values({
      userId, idempotencyKey: input.idempotencyKey, estimatedLevel: result.estimatedLevel,
      dimensionScores: result.dimensionScores, topicScores: result.topicScores, strongAreas: result.strongAreas,
      weakAreas: result.weakAreas, startedAt: new Date(input.startedAt), completedAt: new Date(result.completedAt),
    }).onConflictDoNothing({ target: [placementAttempts.userId, placementAttempts.idempotencyKey] }).returning({ id: placementAttempts.id });
    if (!attempt) return { duplicate: true } as const;
    if (result.answers.length) await tx.insert(placementAnswers).values(result.answers.map((answer, position) => ({ placementAttemptId: attempt.id, ...answer, position })));
    await persistState(tx, userId, input.state);
    const pathId = await persistLearningPath(tx, userId, input.state);
    await tx.insert(auditLogs).values({ userId, action: "placement.completed", entityType: "placement_attempt", entityId: attempt.id, metadata: { pathId } });
    return { duplicate: false, attemptId: attempt.id } as const;
  });
}
