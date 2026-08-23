import type { AppState, CEFRLevel, VocabularyItem } from "@/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const bandScore = { "very-common": 0, common: 1, "less-common": 2, advanced: 3 } as const;

export function rankNewVocabulary(state: AppState, candidates: VocabularyItem[]): VocabularyItem[] {
  const target = levels.indexOf(state.placement?.estimatedLevel ?? state.settings.currentLevel);
  const weakAreas = new Set(state.placement?.weakAreas ?? []);
  return [...candidates].sort((a, b) => {
    const score = (item: VocabularyItem) => {
      const levelDistance = Math.abs(target - levels.indexOf(item.cefrLevel));
      const topicBoost = (item.topics ?? []).some((topic) => weakAreas.has(topic)) ? -250 : 0;
      return levelDistance * 10_000 + (bandScore[item.frequencyBand ?? "less-common"] * 1_000) + (item.frequencyRank ?? 99_999) + topicBoost;
    };
    return score(a) - score(b) || a.id.localeCompare(b.id);
  });
}
