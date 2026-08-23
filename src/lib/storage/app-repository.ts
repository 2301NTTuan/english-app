import type { AppState, MistakeRecord } from "@/types/domain";
import { vocabulary } from "@/data/vocabulary";
import { grammarTopics } from "@/data/grammar";

const KEY = "english-mastery:state";
const LEGACY_KEY = "english-mastery:v1";
const STORAGE_VERSION = 4;
const isoOffset = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString();
const defaultReview = (nextReview = new Date().toISOString()): AppState["vocabularyProgress"][number]["review"] => ({ difficulty: 5, stability: 1, state: "new", nextReview, scheduledDays: 0, elapsedDays: 0, reviewCount: 0, correctCount: 0, incorrectCount: 0, lapses: 0 });

export function createEmptyAccountState(): AppState {
  return { settings: { currentLevel: "B1", dailyTarget: 25, maxNewWordsPerDay: 10, maxNewGrammarTopicsPerDay: 1, desiredRetention: 0.9, interfaceLanguage: "en", showVietnamese: true }, vocabularyProgress: [], grammarProgress: [], mistakes: [], streak: 0, activities: [] };
}

export function createInitialState(): AppState {
  return {
    settings: { currentLevel: "B1", dailyTarget: 25, maxNewWordsPerDay: 10, maxNewGrammarTopicsPerDay: 1, desiredRetention: 0.9, interfaceLanguage: "en", showVietnamese: true }, streak: 7,
    vocabularyProgress: vocabulary.slice(0, 18).map((item, index) => ({
      itemId: item.id,
      mastery: { recognition: 50 + (index * 7) % 48, recall: 35 + (index * 5) % 55, context: 30 + (index * 9) % 60, spelling: 40 + (index * 3) % 52, overall: 55 + (index * 4) % 35 },
      review: { difficulty: 4 + (index % 4), stability: 2 + index / 2, state: "review", lastReview: isoOffset(-2 - index % 4), nextReview: isoOffset(index % 7 - 3), scheduledDays: 2 + index % 5, elapsedDays: 2 + index % 4, reviewCount: 2 + index, correctCount: 2 + index, incorrectCount: index % 4, lapses: index % 3 },
    })),
    grammarProgress: grammarTopics.slice(0, 9).map((item, index) => ({ topicId: item.id, mastery: 42 + index * 5, subtopicMastery: Object.fromEntries(item.subtopics.map((subtopic, subIndex) => [subtopic.id, 38 + index * 5 + subIndex * 6])), review: { ...defaultReview(isoOffset(index % 5 - 2)), state: "review", stability: 2 + index / 2, reviewCount: 2 + index } })),
    mistakes: [
      { id: "m1", itemId: "perfect-vs-past", label: "Present Perfect vs Past Simple", knowledgeType: "grammar", exerciseType: "choose-tense", wrongAnswer: "have seen yesterday", correctAnswer: "saw yesterday", timestamp: isoOffset(-1), repeatedCount: 8, resolved: false },
      { id: "m2", itemId: "present-perfect", label: "Since vs For", knowledgeType: "grammar", exerciseType: "fill-blank", wrongAnswer: "since three years", correctAnswer: "for three years", timestamp: isoOffset(-2), repeatedCount: 5, resolved: false },
      { id: "m3", itemId: "articles", label: "Articles", knowledgeType: "grammar", exerciseType: "multiple-choice", wrongAnswer: "a information", correctAnswer: "information", timestamp: isoOffset(-3), repeatedCount: 4, resolved: false },
      { id: "m4", itemId: "affect-effect", label: "affect vs effect", knowledgeType: "vocabulary", exerciseType: "fill-blank", wrongAnswer: "effect (verb)", correctAnswer: "affect", timestamp: isoOffset(-4), repeatedCount: 3, resolved: false },
    ],
    activities: Array.from({ length: 7 }, (_, index) => ({ id: `a${index + 1}`, date: isoOffset(-index - 1), label: index % 2 ? "Grammar practice" : "Daily review", correct: 14 + index, total: 18 + index, minutes: 14 + index, vocabularyReviewed: 10, newVocabulary: 4, grammarExercises: 4, mistakesCorrected: 1 })),
  };
}

interface StoredState { version: number; state: AppState }
const looksLikeState = (value: unknown): value is AppState => Boolean(value && typeof value === "object" && "settings" in value && "vocabularyProgress" in value && "grammarProgress" in value);

export function normalizeState(candidate: unknown): AppState {
  const defaults = createInitialState();
  if (!looksLikeState(candidate)) return defaults;
  return {
    ...defaults,
    ...candidate,
    settings: { ...defaults.settings, ...candidate.settings },
    vocabularyProgress: Array.isArray(candidate.vocabularyProgress) ? candidate.vocabularyProgress.map((item) => ({ ...item, review: { ...defaultReview(item.review?.nextReview), ...item.review } })) : defaults.vocabularyProgress,
    grammarProgress: Array.isArray(candidate.grammarProgress) ? candidate.grammarProgress.map((item) => { const legacy = item as typeof item & { nextReview?: string }; return { ...item, review: { ...defaultReview(legacy.nextReview), ...item.review } }; }) : defaults.grammarProgress,
    mistakes: Array.isArray(candidate.mistakes) ? candidate.mistakes.map((item) => ({ ...item, resolved: item.resolved ?? false })) : defaults.mistakes,
    activities: Array.isArray(candidate.activities) ? candidate.activities.slice(0, 30).map((item) => ({ ...item, vocabularyReviewed: item.vocabularyReviewed ?? 0, newVocabulary: item.newVocabulary ?? 0, grammarExercises: item.grammarExercises ?? 0, mistakesCorrected: item.mistakesCorrected ?? 0 })) : defaults.activities,
    placement: candidate.placement && Array.isArray(candidate.placement.answers) ? candidate.placement : undefined,
  };
}

export interface AppRepository { load(): AppState; save(state: AppState): boolean; clear(): void }
export function hasLocalLearningState() { return typeof window !== "undefined" && Boolean(window.localStorage.getItem(KEY) || window.localStorage.getItem(LEGACY_KEY)); }
export const localAppRepository: AppRepository = {
  load: () => {
    if (typeof window === "undefined") return createInitialState();
    try {
      const current = window.localStorage.getItem(KEY);
      if (current) { const parsed = JSON.parse(current) as StoredState; return normalizeState(parsed.state); }
      const legacy = window.localStorage.getItem(LEGACY_KEY);
      if (legacy) return normalizeState(JSON.parse(legacy));
      return createInitialState();
    } catch { return createInitialState(); }
  },
  save: (state) => {
    if (typeof window === "undefined") return false;
    try { window.localStorage.setItem(KEY, JSON.stringify({ version: STORAGE_VERSION, state } satisfies StoredState)); window.localStorage.removeItem(LEGACY_KEY); return true; } catch { return false; }
  },
  clear: () => { if (typeof window !== "undefined") { window.localStorage.removeItem(KEY); window.localStorage.removeItem(LEGACY_KEY); } },
};

export function upsertMistake(mistakes: MistakeRecord[], mistake: Omit<MistakeRecord, "id" | "timestamp" | "repeatedCount" | "resolved">): MistakeRecord[] {
  const existing = mistakes.find((item) => item.itemId === mistake.itemId && item.exerciseType === mistake.exerciseType);
  if (existing) return mistakes.map((item) => item.id === existing.id ? { ...item, ...mistake, timestamp: new Date().toISOString(), repeatedCount: item.repeatedCount + 1, resolved: false } : item);
  return [{ ...mistake, id: `m-${Date.now()}`, timestamp: new Date().toISOString(), repeatedCount: 1, resolved: false }, ...mistakes];
}
