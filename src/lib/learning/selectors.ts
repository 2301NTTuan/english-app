import { grammarTopics } from "@/data/grammar";
import { vocabulary } from "@/data/vocabulary";
import { buildDailyPlan } from "@/lib/learning/plan";
import { recommendableTopics } from "@/lib/learning/prerequisites";
import type { AppState, CEFRLevel, LearningInventory } from "@/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const atOrBelow = (level: CEFRLevel, target: CEFRLevel) => levels.indexOf(level) <= levels.indexOf(target);

export function selectInventory(state: AppState, now = new Date()): LearningInventory {
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const due = (date?: string) => date ? new Date(date) <= now : false;
  const overdue = (date?: string) => date ? new Date(date) < start : false;
  return {
    overdueVocabulary: state.vocabularyProgress.filter((item) => overdue(item.review.nextReview)).length,
    dueVocabulary: state.vocabularyProgress.filter((item) => due(item.review.nextReview) && !overdue(item.review.nextReview)).length,
    overdueGrammar: state.grammarProgress.filter((item) => overdue(item.nextReview)).length,
    dueGrammar: state.grammarProgress.filter((item) => due(item.nextReview) && !overdue(item.nextReview)).length,
    weakVocabulary: state.vocabularyProgress.filter((item) => item.mastery.overall < 60).length,
    weakGrammar: state.grammarProgress.filter((item) => item.mastery < 60).length,
    mistakes: state.mistakes.length,
    newVocabulary: vocabulary.filter((item) => atOrBelow(item.cefrLevel, state.settings.currentLevel) && !state.vocabularyProgress.some((progress) => progress.itemId === item.id)).length,
    newGrammar: recommendableTopics(grammarTopics, state.grammarProgress).filter((item) => atOrBelow(item.level, state.settings.currentLevel) && !state.grammarProgress.some((progress) => progress.topicId === item.id)).length,
  };
}

export const selectDailyPlan = (state: AppState, now = new Date()) => buildDailyPlan(selectInventory(state, now), state.settings);
