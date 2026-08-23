import { grammarTopics } from "@/data/grammar";
import { vocabulary } from "@/data/vocabulary";
import { prerequisitesMet } from "@/lib/learning/prerequisites";
import { rankNewVocabulary } from "@/lib/learning/vocabulary-selection";
import type { AppState, CEFRLevel, LearningPathItem } from "@/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const atOrBelow = (level: CEFRLevel, target: CEFRLevel) => levels.indexOf(level) <= levels.indexOf(target);
const due = (value: string, now: Date) => new Date(value) <= now;

export function buildLearningPath(state: AppState, now = new Date()): LearningPathItem[] {
  const target = state.placement?.estimatedLevel ?? state.settings.currentLevel;
  const weakPlacementAreas = new Set(state.placement?.weakAreas ?? []);
  const mistakeWeight = (itemId: string) => state.mistakes.filter((item) => !item.resolved && item.itemId === itemId).reduce((sum, item) => sum + item.repeatedCount, 0);

  const grammar: LearningPathItem[] = grammarTopics.map((topic) => {
    const progress = state.grammarProgress.find((item) => item.topicId === topic.id);
    const unlocked = prerequisitesMet(topic, state.grammarProgress);
    const placementWeak = weakPlacementAreas.has(topic.id) || weakPlacementAreas.has(topic.title.toLowerCase().replaceAll(" ", "-"));
    const isDue = Boolean(progress && due(progress.review.nextReview, now));
    const stateLabel: LearningPathItem["state"] = !unlocked ? "locked" : !progress ? "recommended" : isDue ? "reviewing" : progress.mastery >= 85 ? "mastered" : progress.mastery >= 70 ? "strong" : progress.mastery < 50 ? "needs-foundation" : "in-progress";
    const foundation = progress ? Math.max(0, 70 - progress.mastery) : levels.indexOf(topic.level) < levels.indexOf(target) ? 18 : 0;
    const priority = (isDue ? 70 : 0) + foundation + mistakeWeight(topic.id) * 8 + (placementWeak ? 35 : 0) + (unlocked ? 20 : -100) - Math.abs(levels.indexOf(topic.level) - levels.indexOf(target)) * 4;
    return { id: `path-grammar-${topic.id}`, itemId: topic.id, knowledgeType: "grammar", title: topic.title, level: topic.level, state: stateLabel, priority, reason: !unlocked ? "Build prerequisite mastery first" : isDue ? "Scheduled review is due" : placementWeak ? "Placement diagnostic identified this area" : progress ? `Current mastery: ${progress.mastery}%` : `Recommended ${topic.level} grammar` };
  });

  const learnedIds = new Set(state.vocabularyProgress.map((item) => item.itemId));
  const vocabularyCandidates = rankNewVocabulary(state, vocabulary.filter((item) => atOrBelow(item.cefrLevel, target) && !learnedIds.has(item.id))).slice(0, 10);
  const vocabularyPath: LearningPathItem[] = vocabularyCandidates.map((item, index) => ({
    id: `path-vocabulary-${item.id}`, itemId: item.id, knowledgeType: "vocabulary", title: item.word, level: item.cefrLevel,
    state: "recommended", priority: 45 - index + ((item.topics ?? []).some((topic) => weakPlacementAreas.has(topic)) ? 20 : 0),
    reason: `${item.frequencyBand?.replaceAll("-", " ") ?? "useful"} ${item.cefrLevel} vocabulary${item.topics?.[0] ? ` · ${item.topics[0].replaceAll("-", " ")}` : ""}`,
  }));

  const activeGrammar = grammar.filter((item) => item.state !== "mastered" && item.state !== "strong").sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title)).slice(0, 10);
  const mastered = grammar.filter((item) => item.state === "mastered" || item.state === "strong").sort((a, b) => b.priority - a.priority).slice(0, 2);
  return [...activeGrammar, ...vocabularyPath, ...mastered].sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title)).slice(0, 16);
}
