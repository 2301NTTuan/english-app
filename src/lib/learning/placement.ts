import { evaluateAnswer } from "@/lib/learning/evaluation";
import type { CEFRLevel, PlacementAnswer, PlacementDimension, PlacementQuestion, PlacementResult } from "@/types/domain";

export const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const PLACEMENT_LENGTH = 30;

export function placementAbilityIndex(answers: PlacementAnswer[]): number {
  const evidence = answers.reduce((score, answer) => score + (answer.correct ? 0.18 : -0.22), 2);
  return Math.max(0, Math.min(CEFR_LEVELS.length - 1, evidence));
}

export function selectPlacementQuestion(pool: PlacementQuestion[], answers: PlacementAnswer[]): PlacementQuestion | undefined {
  if (answers.length >= PLACEMENT_LENGTH) return undefined;
  const used = new Set(answers.map((answer) => answer.questionId));
  const dimensionCounts: Record<PlacementDimension, number> = { vocabulary: 0, grammar: 0, context: 0 };
  const topicCounts = new Map<string, number>();
  for (const answer of answers) {
    dimensionCounts[answer.dimension] += 1;
    topicCounts.set(answer.topic, (topicCounts.get(answer.topic) ?? 0) + 1);
  }
  const target = placementAbilityIndex(answers);
  return pool.filter((question) => !used.has(question.id)).sort((a, b) => {
    const aScore = Math.abs(CEFR_LEVELS.indexOf(a.level) - target) * 10 + dimensionCounts[a.dimension] * 2 + (topicCounts.get(a.topic) ?? 0);
    const bScore = Math.abs(CEFR_LEVELS.indexOf(b.level) - target) * 10 + dimensionCounts[b.dimension] * 2 + (topicCounts.get(b.topic) ?? 0);
    return aScore - bScore || a.id.localeCompare(b.id);
  })[0];
}

export function answerPlacementQuestion(question: PlacementQuestion, answer: string): PlacementAnswer {
  return { questionId: question.id, answer, correct: evaluateAnswer(answer, question.answer), level: question.level, dimension: question.dimension, topic: question.topic };
}

export function scorePlacement(answers: PlacementAnswer[], completedAt = new Date()): PlacementResult {
  const dimensions: PlacementDimension[] = ["vocabulary", "grammar", "context"];
  const dimensionScores = Object.fromEntries(dimensions.map((dimension) => {
    const matching = answers.filter((answer) => answer.dimension === dimension);
    return [dimension, matching.length ? Math.round(matching.filter((answer) => answer.correct).length / matching.length * 100) : 0];
  })) as Record<PlacementDimension, number>;
  const topics = [...new Set(answers.map((answer) => answer.topic))];
  const topicScores = Object.fromEntries(topics.map((topic) => {
    const matching = answers.filter((answer) => answer.topic === topic);
    return [topic, Math.round(matching.filter((answer) => answer.correct).length / matching.length * 100)];
  }));
  const rankedTopics = Object.entries(topicScores).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const estimatedLevel = CEFR_LEVELS[Math.round(placementAbilityIndex(answers))];
  return {
    completedAt: completedAt.toISOString(), estimatedLevel, dimensionScores, topicScores,
    strongAreas: rankedTopics.filter(([, score]) => score >= 70).slice(0, 5).map(([topic]) => topic),
    weakAreas: rankedTopics.filter(([, score]) => score <= 50).reverse().slice(0, 5).map(([topic]) => topic),
    answers,
  };
}
