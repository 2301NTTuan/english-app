import "server-only";

import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { grammarProgress, grammarTopics, learningPreferences, mistakes, placementAnswers, placementAttempts, reviewStates, studySessions, userStateSnapshots, vocabularyContent, vocabularyProgress } from "@/db/schema";
import { calculateStreak } from "@/lib/learning/streak";
import { createEmptyAccountState } from "@/lib/storage/app-repository";
import { appStateSchema } from "@/lib/validation/app-state";
import type { AppState, PlacementAnswer, PlacementResult, ReviewState, SessionSummary } from "@/types/domain";

function reviewState(row: typeof reviewStates.$inferSelect | undefined): ReviewState {
  if (!row) return { difficulty: 5, stability: 1, state: "new", nextReview: new Date().toISOString(), scheduledDays: 0, elapsedDays: 0, reviewCount: 0, correctCount: 0, incorrectCount: 0, lapses: 0 };
  return { difficulty: row.difficulty, stability: row.stability, state: row.status, lastReview: row.lastReviewedAt?.toISOString(), nextReview: row.dueAt.toISOString(), scheduledDays: row.scheduledDays, elapsedDays: row.elapsedDays, reviewCount: row.reviewCount, correctCount: row.correctCount, incorrectCount: row.incorrectCount, lapses: row.lapses };
}

/** Builds the hydration view from normalized authoritative rows; the snapshot is compatibility fallback only. */
export async function loadLearningState(userId: string): Promise<AppState> {
  const db = getDb();
  const [snapshotRows, preferenceRows, vocabularyRows, grammarRows, reviewRows, mistakeRows, sessionRows, attemptRows] = await Promise.all([
    db.select({ state: userStateSnapshots.state }).from(userStateSnapshots).where(eq(userStateSnapshots.userId, userId)).limit(1),
    db.select().from(learningPreferences).where(eq(learningPreferences.userId, userId)).limit(1),
    db.select({ contentId: vocabularyContent.contentId, progress: vocabularyProgress }).from(vocabularyProgress).innerJoin(vocabularyContent, eq(vocabularyProgress.vocabularyId, vocabularyContent.id)).where(eq(vocabularyProgress.userId, userId)),
    db.select({ contentId: grammarTopics.contentId, progress: grammarProgress }).from(grammarProgress).innerJoin(grammarTopics, eq(grammarProgress.grammarTopicId, grammarTopics.id)).where(eq(grammarProgress.userId, userId)),
    db.select().from(reviewStates).where(eq(reviewStates.userId, userId)),
    db.select().from(mistakes).where(eq(mistakes.userId, userId)).orderBy(desc(mistakes.lastOccurredAt)),
    db.select().from(studySessions).where(eq(studySessions.userId, userId)).orderBy(desc(studySessions.completedAt)).limit(366),
    db.select().from(placementAttempts).where(eq(placementAttempts.userId, userId)).orderBy(desc(placementAttempts.completedAt)).limit(1),
  ]);
  const parsedSnapshot = appStateSchema.safeParse(snapshotRows[0]?.state);
  const fallback = parsedSnapshot.success ? parsedSnapshot.data : createEmptyAccountState();
  const preference = preferenceRows[0];
  const reviewMap = new Map(reviewRows.map((row) => [`${row.knowledgeType}:${row.knowledgeContentId}`, row]));
  const activities: SessionSummary[] = sessionRows.filter((row) => row.completedAt).map((row) => {
    const summary = row.summary && typeof row.summary === "object" ? row.summary as Partial<SessionSummary> : {};
    return { id: row.id, date: row.completedAt!.toISOString(), label: typeof summary.label === "string" ? summary.label : "Adaptive daily session", correct: row.correct, total: row.total, minutes: row.minutes, masteryDelta: summary.masteryDelta, vocabularyReviewed: summary.vocabularyReviewed ?? 0, newVocabulary: summary.newVocabulary ?? 0, grammarExercises: summary.grammarExercises ?? 0, mistakesCorrected: summary.mistakesCorrected ?? 0 };
  });

  let placement: PlacementResult | undefined;
  const attempt = attemptRows[0];
  if (attempt?.completedAt && attempt.estimatedLevel && attempt.overallAbility != null && attempt.standardError != null && attempt.confidenceScore != null && attempt.confidenceLabel) {
    const answers = await db.select().from(placementAnswers).where(eq(placementAnswers.placementAttemptId, attempt.id)).orderBy(placementAnswers.position);
    const candidate = {
      completedAt: attempt.completedAt.toISOString(), estimatedLevel: attempt.estimatedLevel, overallAbility: attempt.overallAbility,
      confidence: { score: attempt.confidenceScore, label: attempt.confidenceLabel, standardError: attempt.standardError, abilityRange: [Math.max(-3.2, attempt.overallAbility - 1.96 * attempt.standardError), Math.min(3.2, attempt.overallAbility + 1.96 * attempt.standardError)] },
      dimensionScores: attempt.dimensionScores, domainEstimates: attempt.domainEstimates, topicScores: attempt.topicScores,
      strongAreas: attempt.strongAreas, weakAreas: attempt.weakAreas,
      answers: answers.map((answer): PlacementAnswer => ({ questionId: answer.questionId, answer: answer.answer, correct: answer.correct, level: answer.level, dimension: answer.dimension as PlacementAnswer["dimension"], topic: answer.topic, subtopic: answer.subtopic ?? undefined, difficulty: answer.difficulty ?? undefined, discrimination: answer.discrimination ?? undefined, responseTimeMs: answer.responseTimeMs ?? undefined })),
    };
    const parsed = appStateSchema.shape.placement.safeParse(candidate); if (parsed.success) placement = parsed.data;
  }

  const projected: AppState = {
    settings: preference ? { currentLevel: preference.currentLevel, dailyTarget: preference.dailyTarget, maxNewWordsPerDay: preference.maxNewWordsPerDay, maxNewGrammarTopicsPerDay: preference.maxNewGrammarPerDay, desiredRetention: preference.desiredRetention, interfaceLanguage: preference.interfaceLanguage as "en" | "vi", showVietnamese: preference.showVietnamese } : fallback.settings,
    vocabularyProgress: vocabularyRows.map(({ contentId, progress }) => ({ itemId: contentId, mastery: { recognition: progress.recognition, recall: progress.recall, context: progress.context, spelling: progress.spelling, overall: progress.overall }, review: reviewState(reviewMap.get(`vocabulary:${contentId}`)) })),
    grammarProgress: grammarRows.map(({ contentId, progress }) => ({ topicId: contentId, mastery: progress.mastery, subtopicMastery: progress.subtopicMastery as Record<string, number>, review: reviewState(reviewMap.get(`grammar:${contentId}`)) })),
    mistakes: mistakeRows.map((item) => ({ id: item.id, itemId: item.knowledgeContentId, subtopicId: item.subtopicContentId ?? undefined, label: item.question, knowledgeType: item.knowledgeType, exerciseType: item.exerciseType, wrongAnswer: item.userAnswer, correctAnswer: item.correctAnswer, timestamp: item.lastOccurredAt.toISOString(), repeatedCount: item.repeatCount, resolved: item.resolved })),
    activities, streak: calculateStreak(activities), placement: placement ?? fallback.placement,
  };
  return appStateSchema.parse(projected);
}
