import { z } from "zod";
import { scorePlacement } from "@/lib/learning/placement";

const level = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);
const finiteScore = z.number().finite().min(0).max(100);
const isoDate = z.string().datetime({ offset: true });
const review = z.object({
  difficulty: z.number().finite().min(1).max(10), stability: z.number().finite().nonnegative(),
  state: z.enum(["new", "learning", "review", "relearning"]), lastReview: isoDate.optional(), nextReview: isoDate,
  scheduledDays: z.number().finite().nonnegative(), elapsedDays: z.number().finite().nonnegative(),
  reviewCount: z.number().int().nonnegative(), correctCount: z.number().int().nonnegative(),
  incorrectCount: z.number().int().nonnegative(), lapses: z.number().int().nonnegative(),
});
const mastery = z.object({ recognition: finiteScore, recall: finiteScore, context: finiteScore, spelling: finiteScore, overall: finiteScore });
const placementDimension = z.enum(["vocabulary", "grammar", "context", "reading"]);
const placementAnswer = z.object({
  questionId: z.string().min(1).max(120), answer: z.string().max(1000), correct: z.boolean(), level,
  dimension: placementDimension, topic: z.string().max(160), subtopic: z.string().max(160).optional(),
  difficulty: z.number().finite().min(0).max(1).optional(), discrimination: z.number().finite().min(0.45).max(2.2).optional(),
  responseTimeMs: z.number().int().nonnegative().max(3_600_000).optional(),
});
const placementDomainEstimate = z.object({ ability: z.number().finite().min(-3.2).max(3.2), standardError: z.number().finite().min(0).max(2), estimatedLevel: level, score: finiteScore, questions: z.number().int().nonnegative().max(500) });
const placementResult = z.object({
  completedAt: isoDate, estimatedLevel: level,
  overallAbility: z.number().finite().min(-3.2).max(3.2),
  confidence: z.object({ score: finiteScore, label: z.enum(["low", "developing", "moderate", "high"]), standardError: z.number().finite().min(0).max(2), abilityRange: z.tuple([z.number().finite().min(-3.2).max(3.2), z.number().finite().min(-3.2).max(3.2)]) }),
  dimensionScores: z.object({ vocabulary: finiteScore, grammar: finiteScore, context: finiteScore, reading: finiteScore }),
  domainEstimates: z.object({ vocabulary: placementDomainEstimate, grammar: placementDomainEstimate, context: placementDomainEstimate, reading: placementDomainEstimate }),
  topicScores: z.record(z.string(), finiteScore), strongAreas: z.array(z.string().max(160)).max(100), weakAreas: z.array(z.string().max(160)).max(100),
  answers: z.array(placementAnswer).max(500),
});
const legacyPlacementResult = z.object({
  completedAt: isoDate, estimatedLevel: level,
  dimensionScores: z.object({ vocabulary: finiteScore, grammar: finiteScore, context: finiteScore }),
  topicScores: z.record(z.string(), finiteScore), strongAreas: z.array(z.string().max(160)).max(100), weakAreas: z.array(z.string().max(160)).max(100),
  answers: z.array(placementAnswer).max(500),
}).transform((placement) => scorePlacement(placement.answers, new Date(placement.completedAt)));

export const appStateSchema = z.object({
  settings: z.object({
    currentLevel: level, dailyTarget: z.number().int().min(10).max(60), maxNewWordsPerDay: z.number().int().min(0).max(20),
    maxNewGrammarTopicsPerDay: z.number().int().min(0).max(3), desiredRetention: z.number().finite().min(0.8).max(0.97),
    interfaceLanguage: z.enum(["en", "vi"]), showVietnamese: z.boolean(),
  }),
  vocabularyProgress: z.array(z.object({ itemId: z.string().min(1).max(160), mastery, review })).max(20_000),
  grammarProgress: z.array(z.object({ topicId: z.string().min(1).max(160), mastery: finiteScore, subtopicMastery: z.record(z.string(), finiteScore), review })).max(2_000),
  mistakes: z.array(z.object({
    id: z.string().min(1).max(160), itemId: z.string().min(1).max(160), subtopicId: z.string().max(160).optional(), label: z.string().min(1).max(300),
    knowledgeType: z.enum(["vocabulary", "grammar", "expression"]), exerciseType: z.string().min(1).max(100), wrongAnswer: z.string().max(2000),
    correctAnswer: z.string().max(2000), timestamp: isoDate, repeatedCount: z.number().int().positive(), resolved: z.boolean(),
  })).max(10_000),
  streak: z.number().int().nonnegative().max(100_000),
  activities: z.array(z.object({
    id: z.string().min(1).max(160), date: isoDate, label: z.string().min(1).max(200), correct: z.number().int().nonnegative(), total: z.number().int().nonnegative(),
    minutes: z.number().int().nonnegative().optional(), masteryDelta: z.number().finite().optional(), vocabularyReviewed: z.number().int().nonnegative(),
    newVocabulary: z.number().int().nonnegative(), grammarExercises: z.number().int().nonnegative(), mistakesCorrected: z.number().int().nonnegative(),
  })).max(366),
  placement: z.union([placementResult, legacyPlacementResult]).optional(),
});

export const stateEnvelopeSchema = z.object({ state: appStateSchema, confirmLegacyImport: z.literal(true).optional() });
export const backupFileSchema = z.object({ version: z.literal(1), exportedAt: isoDate, state: appStateSchema });
export const MAX_STATE_BYTES = 1_000_000;
