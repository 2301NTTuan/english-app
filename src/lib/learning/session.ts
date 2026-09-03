import { exercises as seedExercises } from "@/data/exercises";
import { grammarTopics } from "@/data/grammar";
import { vocabulary } from "@/data/vocabulary";
import { expressions } from "@/data/expressions";
import { selectDailyPlan } from "@/lib/learning/selectors";
import { weakestDimension } from "@/lib/learning/mastery";
import { recommendableTopics } from "@/lib/learning/prerequisites";
import { prioritizeMistakes } from "@/lib/learning/mistakes";
import { rankNewVocabulary } from "@/lib/learning/vocabulary-selection";
import { generateExpressionExercise, generateGrammarExercise, generateVocabularyExercise } from "@/lib/learning/exercises";
import { buildLearningPath } from "@/lib/learning/path";
import type { AppState, Exercise, PlanCategory, SessionExercise, VocabularyItem } from "@/types/domain";

const unique = <T,>(items: T[]) => [...new Set(items)];
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const atOrBelow = (level: VocabularyItem["cefrLevel"], target: VocabularyItem["cefrLevel"]) => levels.indexOf(level) <= levels.indexOf(target);
export interface StudySessionOverview {
  total: number;
  review: number;
  newItems: number;
  newVocabulary: number;
  newGrammar: number;
  newExpressions: number;
  mistakeRepair: number;
  vocabulary: number;
  grammar: number;
  expressions: number;
  estimatedMinutes: number;
}

export function summarizeStudySession(session: SessionExercise[]): StudySessionOverview {
  const newVocabulary = session.filter((item) => item.source === "newVocabulary").length;
  const newGrammar = session.filter((item) => item.source === "newGrammar").length;
  const newExpressions = session.filter((item) => item.source === "newExpressions").length;
  const newItems = newVocabulary + newGrammar + newExpressions;
  const mistakeRepair = session.filter((item) => item.source === "mistakes").length;
  const grammar = session.filter((item) => item.knowledgeType === "grammar").length;
  const vocabulary = session.filter((item) => item.knowledgeType === "vocabulary").length;
  const expressions = session.filter((item) => item.knowledgeType === "expression").length;
  return {
    total: session.length,
    review: session.length - newItems - mistakeRepair,
    newItems,
    newVocabulary,
    newGrammar,
    newExpressions,
    mistakeRepair,
    vocabulary,
    grammar,
    expressions,
    estimatedMinutes: Math.max(3, Math.ceil(vocabulary * 0.75 + expressions * 0.75 + grammar * 1.5)),
  };
}

export function selectExpressionCandidates(target: VocabularyItem["cefrLevel"], offset = 0) {
  const candidates = expressions.filter((item) => item.status !== "retired" && atOrBelow(item.cefrLevel, target));
  if (!candidates.length) return candidates;
  const start = ((Math.trunc(offset) % candidates.length) + candidates.length) % candidates.length;
  return candidates.map((_, index) => candidates[(start + index) % candidates.length]);
}

function mistakeExercise(state: AppState, index: number): SessionExercise | undefined {
  const active = prioritizeMistakes(state.mistakes);
  const mistake = active[index % active.length];
  if (!mistake) return undefined;
  const seeded = seedExercises.find((exercise) => exercise.itemId === mistake.itemId);
  if (seeded) return { ...seeded, id: `mistake-${seeded.id}-${index}`, source: "mistakes" };
  return { id: `mistake-${mistake.id}-${index}`, itemId: mistake.itemId, knowledgeType: mistake.knowledgeType, type: mistake.exerciseType as Exercise["type"], source: "mistakes", prompt: mistake.label, options: unique([mistake.correctAnswer, mistake.wrongAnswer, "Not enough context", "None of these"]), answer: mistake.correctAnswer, explanation: `You previously answered “${mistake.wrongAnswer}”.` };
}

export function buildStudySession(state: AppState, now = new Date()): SessionExercise[] {
  const plan = selectDailyPlan(state, now);
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const overdue = (value?: string) => Boolean(value && new Date(value) < startOfDay);
  const dueToday = (value?: string) => Boolean(value && new Date(value) >= startOfDay && new Date(value) <= now);
  const learnedIds = new Set(state.vocabularyProgress.map((item) => item.itemId));
  const learnedGrammarIds = new Set(state.grammarProgress.map((item) => item.topicId));
  const pathGrammarOrder = buildLearningPath(state, now).filter((item) => item.knowledgeType === "grammar").map((item) => item.itemId);
  const vocabularyBySource: Partial<Record<PlanCategory, VocabularyItem[]>> = {
    overdueVocabulary: state.vocabularyProgress.filter((item) => overdue(item.review.nextReview)).sort((a, b) => a.review.nextReview.localeCompare(b.review.nextReview)).map((item) => vocabulary.find((word) => word.id === item.itemId)).filter((item): item is VocabularyItem => Boolean(item)),
    dueVocabulary: state.vocabularyProgress.filter((item) => dueToday(item.review.nextReview)).map((item) => vocabulary.find((word) => word.id === item.itemId)).filter((item): item is VocabularyItem => Boolean(item)),
    weakVocabulary: state.vocabularyProgress.filter((item) => item.mastery.overall < 60).sort((a, b) => a.mastery.overall - b.mastery.overall).map((item) => vocabulary.find((word) => word.id === item.itemId)).filter((item): item is VocabularyItem => Boolean(item)),
    newVocabulary: rankNewVocabulary(state, vocabulary.filter((item) => !learnedIds.has(item.id) && atOrBelow(item.cefrLevel, state.settings.currentLevel))),
  };
  const grammarBySource: Partial<Record<PlanCategory, string[]>> = {
    overdueGrammar: state.grammarProgress.filter((item) => overdue(item.review.nextReview)).map((item) => item.topicId),
    dueGrammar: state.grammarProgress.filter((item) => dueToday(item.review.nextReview)).map((item) => item.topicId),
    weakGrammar: state.grammarProgress.filter((item) => item.mastery < 60).sort((a, b) => a.mastery - b.mastery).map((item) => item.topicId),
    newGrammar: recommendableTopics(grammarTopics, state.grammarProgress).filter((item) => !learnedGrammarIds.has(item.id) && atOrBelow(item.level, state.settings.currentLevel)).sort((a, b) => {
      const aPriority = pathGrammarOrder.indexOf(a.id); const bPriority = pathGrammarOrder.indexOf(b.id);
      return (aPriority < 0 ? Number.MAX_SAFE_INTEGER : aPriority) - (bPriority < 0 ? Number.MAX_SAFE_INTEGER : bPriority);
    }).map((item) => item.id),
  };
  const expressionCandidates = selectExpressionCandidates(state.settings.currentLevel, Math.floor(now.getTime() / 86_400_000));

  const result: SessionExercise[] = [];
  for (const allocation of plan.allocations) {
    for (let index = 0; index < allocation.count; index += 1) {
      if (allocation.category === "mistakes") {
        const exercise = mistakeExercise(state, index); if (exercise) result.push(exercise); continue;
      }
      const words = vocabularyBySource[allocation.category];
      if (words?.length) {
        const word = words[index % words.length];
        const progress = state.vocabularyProgress.find((item) => item.itemId === word.id);
        result.push(generateVocabularyExercise(word, allocation.category, progress ? weakestDimension(progress.mastery) : index % 2 ? "recall" : "recognition", state.settings.showVietnamese));
        continue;
      }
      const topics = grammarBySource[allocation.category];
      if (topics?.length) { const exercise = generateGrammarExercise(topics[index % topics.length], allocation.category); if (exercise) result.push(exercise); continue; }
      if (allocation.category === "newExpressions" && expressionCandidates.length) result.push(generateExpressionExercise(expressionCandidates[index % expressionCandidates.length], expressions, state.settings.showVietnamese));
    }
  }
  return result.length ? result : seedExercises.slice(0, 5).map((exercise) => ({ ...exercise, source: "mistakes" }));
}
