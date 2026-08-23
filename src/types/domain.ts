export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type FrequencyBand = "very-common" | "common" | "less-common" | "advanced";
export type ExerciseType = "recognition" | "recall" | "fill-blank" | "context" | "definition-match" | "synonym" | "antonym" | "word-family" | "collocation";
export type GrammarExerciseType = "multiple-choice" | "fill-blank" | "error-correction" | "sentence-building" | "sentence-transformation" | "translation" | "choose-tense" | "grammar-contrast" | "rewrite";
export type Rating = "again" | "hard" | "good" | "easy";
export type KnowledgeType = "vocabulary" | "grammar" | "expression";
export type ContentStatus = "draft" | "validated" | "reviewed" | "published" | "retired";

export interface LexicalRelation { word: string; strength: number; register?: string; usage?: string; notes?: string }
export interface VocabularyItem {
  id: string; word: string; lemma?: string; cefrLevel: CEFRLevel; partOfSpeech: string; ipa?: string;
  frequencyRank?: number; frequencyBand?: FrequencyBand;
  meanings: { definition: string; vietnamese?: string; usageNotes?: string }[]; examples: string[];
  synonyms: LexicalRelation[]; antonyms: LexicalRelation[];
  wordFamily: { word: string; partOfSpeech: string }[]; collocations: string[]; topics?: string[]; tags: string[];
}
export interface MasteryDimensions { recognition: number; recall: number; context: number; spelling: number; overall: number }
export interface ReviewState {
  difficulty: number; stability: number; state: "new" | "learning" | "review" | "relearning";
  lastReview?: string; nextReview: string; scheduledDays: number; elapsedDays: number;
  reviewCount: number; correctCount: number; incorrectCount: number; lapses: number;
}
export interface VocabularyProgress { itemId: string; mastery: MasteryDimensions; review: ReviewState }

export interface GrammarTopic {
  id: string; title: string; level: CEFRLevel; category: string; description: string;
  prerequisites: string[]; explanation: string; structures: string[];
  examples: { sentence: string; explanation?: string }[];
  commonMistakes: { incorrect: string; correct: string; explanation: string }[];
  subtopics: { id: string; title: string }[];
}
export interface GrammarProgress { topicId: string; mastery: number; subtopicMastery: Record<string, number>; review: ReviewState }
export interface ExpressionItem {
  id: string; expression: string; kind: "idiom" | "phrasal-verb" | "collocation" | "common-expression";
  meaning: string; vietnameseMeaning: string; cefrLevel: CEFRLevel; examples: string[]; usageNotes: string; tags: string[];
  relatedVerb?: string; separability?: "separable" | "inseparable" | "both";
}
export interface Exercise { id: string; knowledgeType: KnowledgeType; itemId: string; type: ExerciseType | GrammarExerciseType; prompt: string; options?: string[]; answer: string; explanation?: string; difficulty?: number }
export interface SessionExercise extends Exercise { source: PlanCategory; targetDimension?: keyof Omit<MasteryDimensions, "overall"> }
export interface MistakeRecord { id: string; itemId: string; subtopicId?: string; label: string; knowledgeType: KnowledgeType; exerciseType: string; wrongAnswer: string; correctAnswer: string; timestamp: string; repeatedCount: number; resolved: boolean }
export interface UserSettings { currentLevel: CEFRLevel; dailyTarget: number; maxNewWordsPerDay: number; maxNewGrammarTopicsPerDay: number; desiredRetention: number; interfaceLanguage: "en" | "vi"; showVietnamese: boolean }
export interface LearningInventory { overdueVocabulary: number; dueVocabulary: number; overdueGrammar: number; dueGrammar: number; weakVocabulary: number; weakGrammar: number; mistakes: number; newVocabulary: number; newGrammar: number }
export type PlanCategory = "overdueVocabulary" | "overdueGrammar" | "dueVocabulary" | "dueGrammar" | "mistakes" | "weakVocabulary" | "weakGrammar" | "newVocabulary" | "newGrammar" | "mixedPractice";
export interface PlanAllocation { category: PlanCategory; count: number; minutesPerItem: number }
export interface DailyPlan { allocations: PlanAllocation[]; totalItems: number; estimatedMinutes: number; reviewBacklog: number; newWords: number }
export interface Activity { id: string; date: string; label: string; correct: number; total: number; minutes?: number; masteryDelta?: number }
export interface SessionSummary extends Activity { vocabularyReviewed: number; newVocabulary: number; grammarExercises: number; mistakesCorrected: number }
export type PlacementDimension = "vocabulary" | "grammar" | "context" | "reading";
export interface ReadingPassage { id: string; title: string; text: string; level: CEFRLevel; status: ContentStatus; provenanceId: string }
export interface PlacementQuestion extends Exercise {
  level: CEFRLevel; dimension: PlacementDimension; topic: string; subtopic: string;
  difficulty: number; discrimination: number; status: ContentStatus; provenanceId: string; passageId?: string;
}
export interface PlacementAnswer {
  questionId: string; answer: string; correct: boolean; level: CEFRLevel; dimension: PlacementDimension; topic: string;
  subtopic?: string; difficulty?: number; discrimination?: number; responseTimeMs?: number;
}
export interface PlacementDomainEstimate { ability: number; standardError: number; estimatedLevel: CEFRLevel; score: number; questions: number }
export interface PlacementConfidence { score: number; label: "low" | "developing" | "moderate" | "high"; standardError: number; abilityRange: [number, number] }
export interface PlacementResult {
  completedAt: string; estimatedLevel: CEFRLevel; overallAbility: number;
  confidence: PlacementConfidence; dimensionScores: Record<PlacementDimension, number>;
  domainEstimates: Record<PlacementDimension, PlacementDomainEstimate>; topicScores: Record<string, number>;
  strongAreas: string[]; weakAreas: string[]; answers: PlacementAnswer[];
}
export type LearningPathState = "needs-foundation" | "recommended" | "in-progress" | "reviewing" | "strong" | "mastered" | "locked";
export interface LearningPathItem { id: string; itemId: string; knowledgeType: "vocabulary" | "grammar"; title: string; level: CEFRLevel; state: LearningPathState; priority: number; reason: string }
export interface AppState { settings: UserSettings; vocabularyProgress: VocabularyProgress[]; grammarProgress: GrammarProgress[]; mistakes: MistakeRecord[]; streak: number; activities: SessionSummary[]; placement?: PlacementResult }
