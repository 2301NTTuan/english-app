import type { DailyPlan, LearningInventory, PlanAllocation, PlanCategory, UserSettings } from "@/types/domain";

const minutes: Record<PlanCategory, number> = { overdueVocabulary: 0.7, overdueGrammar: 1.5, dueVocabulary: 0.7, dueGrammar: 1.5, weakVocabulary: 1, weakGrammar: 2, mistakes: 1.2, newVocabulary: 1.2, newGrammar: 4 };

export function buildDailyPlan(inventory: LearningInventory, settings: UserSettings): DailyPlan {
  const allocations: PlanAllocation[] = [];
  const dailyTarget = Math.max(1, settings.dailyTarget);
  let capacity = dailyTarget;
  const add = (category: PlanCategory, available: number, limit = Infinity, required = false) => {
    const count = Math.max(0, Math.min(available, required ? Infinity : capacity, limit));
    if (count) { allocations.push({ category, count, minutesPerItem: minutes[category] }); capacity = Math.max(0, capacity - count); }
  };

  add("overdueVocabulary", inventory.overdueVocabulary, Infinity, true);
  add("overdueGrammar", inventory.overdueGrammar, Infinity, true);
  add("dueVocabulary", inventory.dueVocabulary, Infinity, true);
  add("dueGrammar", inventory.dueGrammar, Infinity, true);
  add("weakVocabulary", inventory.weakVocabulary);
  add("weakGrammar", inventory.weakGrammar);
  add("mistakes", inventory.mistakes);

  const reviewBacklog = inventory.overdueVocabulary + inventory.overdueGrammar + inventory.dueVocabulary + inventory.dueGrammar;
  const adaptiveNewLimit = reviewBacklog >= dailyTarget ? 0 : Math.min(settings.maxNewWordsPerDay, capacity);
  add("newVocabulary", inventory.newVocabulary, adaptiveNewLimit);
  add("newGrammar", inventory.newGrammar, 1);

  const totalItems = allocations.reduce((sum, item) => sum + item.count, 0);
  return { allocations, totalItems, reviewBacklog, newWords: allocations.find((item) => item.category === "newVocabulary")?.count ?? 0, estimatedMinutes: Math.ceil(allocations.reduce((sum, item) => sum + item.count * item.minutesPerItem, 0)) };
}
