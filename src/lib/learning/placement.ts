import { evaluateAnswer } from "@/lib/learning/evaluation";
import type {
  CEFRLevel, PlacementAnswer, PlacementDimension, PlacementDomainEstimate, PlacementQuestion, PlacementResult,
} from "@/types/domain";

export const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const PLACEMENT_DOMAINS: PlacementDimension[] = ["vocabulary", "grammar", "context", "reading"];
export const PLACEMENT_MIN_LENGTH = 25;
export const PLACEMENT_MAX_LENGTH = 50;
/** Backwards-compatible name for callers that need the hard upper bound. */
export const PLACEMENT_LENGTH = PLACEMENT_MAX_LENGTH;
export const MIN_DOMAIN_QUESTIONS = 5;

const PRIOR_MEAN = -0.5;
const PRIOR_PRECISION = 0.55;
const CHANCE_FLOOR = 0.2;
const ABILITY_MIN = -3.2;
const ABILITY_MAX = 3.2;
const LEVEL_ANCHORS = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5] as const;

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
const logistic = (value: number) => 1 / (1 + Math.exp(-value));
const round = (value: number, places = 3) => Number(value.toFixed(places));
const difficultyToAbility = (difficulty: number) => clamp(difficulty, 0, 1) * 6 - 3;
const abilityToDifficulty = (ability: number) => clamp((ability + 3) / 6, 0, 1);

function closestLevel(ability: number): CEFRLevel {
  let closest = 0;
  for (let index = 1; index < LEVEL_ANCHORS.length; index += 1) {
    if (Math.abs(LEVEL_ANCHORS[index] - ability) < Math.abs(LEVEL_ANCHORS[closest] - ability)) closest = index;
  }
  return CEFR_LEVELS[closest];
}

function probability(ability: number, difficulty: number, discrimination = 1): number {
  const signal = logistic(clamp(discrimination, 0.45, 2.2) * (ability - difficultyToAbility(difficulty)));
  return CHANCE_FLOOR + (1 - CHANCE_FLOOR) * signal;
}

function levelDifficulty(level: CEFRLevel): number {
  return (CEFR_LEVELS.indexOf(level) + 0.5) / CEFR_LEVELS.length;
}

function estimateAbility(answers: PlacementAnswer[], priorMean = PRIOR_MEAN): { ability: number; standardError: number; fit: number } {
  if (!answers.length) return { ability: priorMean, standardError: 1 / Math.sqrt(PRIOR_PRECISION), fit: 0 };
  let ability = priorMean;
  let information = PRIOR_PRECISION;

  // Deterministic bounded maximum-a-posteriori updates. Item parameters are
  // editorial calibration inputs, not validated psychometric parameters.
  for (let iteration = 0; iteration < 6; iteration += 1) {
    let gradient = -(ability - priorMean) * PRIOR_PRECISION;
    information = PRIOR_PRECISION;
    for (const answer of answers) {
      const discrimination = clamp(answer.discrimination ?? 1, 0.45, 2.2);
      const q = logistic(discrimination * (ability - difficultyToAbility(answer.difficulty ?? levelDifficulty(answer.level))));
      const predicted = clamp(CHANCE_FLOOR + (1 - CHANCE_FLOOR) * q, 0.001, 0.999);
      const derivative = (1 - CHANCE_FLOOR) * discrimination * q * (1 - q);
      const variance = predicted * (1 - predicted);
      gradient += derivative * ((answer.correct ? 1 : 0) - predicted) / variance;
      information += derivative * derivative / variance;
    }
    ability = clamp(ability + gradient / information, ABILITY_MIN, ABILITY_MAX);
  }

  const residual = answers.reduce((sum, answer) => {
    const predicted = probability(ability, answer.difficulty ?? levelDifficulty(answer.level), answer.discrimination);
    return sum + Math.abs((answer.correct ? 1 : 0) - predicted);
  }, 0) / answers.length;
  return { ability: round(ability), standardError: round(1 / Math.sqrt(information)), fit: round(1 - residual) };
}

function domainEstimate(answers: PlacementAnswer[]): PlacementDomainEstimate {
  const estimate = estimateAbility(answers);
  const correct = answers.filter((answer) => answer.correct).length;
  return {
    ability: estimate.ability,
    standardError: estimate.standardError,
    estimatedLevel: closestLevel(estimate.ability),
    score: answers.length ? Math.round(correct / answers.length * 100) : 0,
    questions: answers.length,
  };
}

export function placementAbilityIndex(answers: PlacementAnswer[]): number {
  return clamp(estimateAbility(answers).ability + 2.5, 0, CEFR_LEVELS.length - 1);
}

export interface PlacementSelectionOptions { previouslySeenQuestionIds?: Iterable<string> }

export function selectPlacementQuestion(
  pool: PlacementQuestion[], answers: PlacementAnswer[], options: PlacementSelectionOptions = {},
): PlacementQuestion | undefined {
  if (answers.length >= PLACEMENT_MAX_LENGTH) return undefined;
  const used = new Set(answers.map((answer) => answer.questionId));
  const previouslySeen = new Set(options.previouslySeenQuestionIds ?? []);
  const domainCounts = Object.fromEntries(PLACEMENT_DOMAINS.map((domain) => [domain, 0])) as Record<PlacementDimension, number>;
  const topicCounts = new Map<string, number>();
  const subtopicCounts = new Map<string, number>();
  for (const answer of answers) {
    domainCounts[answer.dimension] += 1;
    topicCounts.set(answer.topic, (topicCounts.get(answer.topic) ?? 0) + 1);
    const subtopic = answer.subtopic ?? answer.topic;
    subtopicCounts.set(subtopic, (subtopicCounts.get(subtopic) ?? 0) + 1);
  }

  const targetDifficulty = abilityToDifficulty(estimateAbility(answers).ability);
  const available = pool.filter((question) => question.status !== "retired" && !used.has(question.id));
  if (!available.length) return undefined;
  const uncovered = PLACEMENT_DOMAINS.filter((domain) => domainCounts[domain] < MIN_DOMAIN_QUESTIONS && available.some((item) => item.dimension === domain));
  const eligible = uncovered.length ? available.filter((item) => uncovered.includes(item.dimension)) : available;

  return eligible.sort((a, b) => {
    const score = (question: PlacementQuestion) =>
      Math.abs(question.difficulty - targetDifficulty) * 24
      + domainCounts[question.dimension] * 2.5
      + (topicCounts.get(question.topic) ?? 0) * 1.5
      + (subtopicCounts.get(question.subtopic) ?? 0) * 2
      + (previouslySeen.has(question.id) ? 18 : 0)
      - question.discrimination * 1.5;
    return score(a) - score(b) || a.id.localeCompare(b.id);
  })[0];
}

export function answerPlacementQuestion(question: PlacementQuestion, answer: string, responseTimeMs?: number): PlacementAnswer {
  return {
    questionId: question.id,
    answer,
    correct: evaluateAnswer(answer, question.answer),
    level: question.level,
    dimension: question.dimension,
    topic: question.topic,
    subtopic: question.subtopic,
    difficulty: question.difficulty,
    discrimination: question.discrimination,
    responseTimeMs: responseTimeMs === undefined ? undefined : Math.max(0, Math.round(responseTimeMs)),
  };
}

export function placementShouldStop(answers: PlacementAnswer[], poolRemaining = true): boolean {
  if (answers.length >= PLACEMENT_MAX_LENGTH || !poolRemaining) return true;
  if (answers.length < PLACEMENT_MIN_LENGTH) return false;
  const covered = PLACEMENT_DOMAINS.every((domain) => answers.filter((answer) => answer.dimension === domain).length >= MIN_DOMAIN_QUESTIONS);
  if (!covered) return false;
  const estimate = estimateAbility(answers);
  const fitFactor = clamp((estimate.fit - 0.35) / 0.4, 0, 1);
  const confidence = (1 - clamp(estimate.standardError / 1.35, 0, 1)) * (0.72 + fitFactor * 0.28);
  return estimate.standardError <= 0.52 && confidence >= 0.62;
}

export function scorePlacement(answers: PlacementAnswer[], completedAt = new Date()): PlacementResult {
  const dimensionScores = Object.fromEntries(PLACEMENT_DOMAINS.map((dimension) => {
    const matching = answers.filter((answer) => answer.dimension === dimension);
    return [dimension, matching.length ? Math.round(matching.filter((answer) => answer.correct).length / matching.length * 100) : 0];
  })) as Record<PlacementDimension, number>;
  const domainEstimates = Object.fromEntries(PLACEMENT_DOMAINS.map((dimension) => [
    dimension, domainEstimate(answers.filter((answer) => answer.dimension === dimension)),
  ])) as Record<PlacementDimension, PlacementDomainEstimate>;
  const rawEstimate = estimateAbility(answers);
  const coveredDomainAbilities = PLACEMENT_DOMAINS.map((domain) => domainEstimates[domain]).filter((estimate) => estimate.questions >= MIN_DOMAIN_QUESTIONS).map((estimate) => estimate.ability);
  const weakestDomain = coveredDomainAbilities.length ? Math.min(...coveredDomainAbilities) : rawEstimate.ability;
  const overallAbility = round(rawEstimate.ability * 0.75 + weakestDomain * 0.25);
  const topics = [...new Set(answers.map((answer) => answer.topic))];
  const topicScores = Object.fromEntries(topics.map((topic) => {
    const matching = answers.filter((answer) => answer.topic === topic);
    return [topic, Math.round(matching.filter((answer) => answer.correct).length / matching.length * 100)];
  }));
  const rankedTopics = Object.entries(topicScores).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const domainCoverage = PLACEMENT_DOMAINS.filter((domain) => domainEstimates[domain].questions >= MIN_DOMAIN_QUESTIONS).length / PLACEMENT_DOMAINS.length;
  const fitFactor = clamp((rawEstimate.fit - 0.3) / 0.5, 0, 1);
  const observedCorrectRate = answers.length ? answers.filter((answer) => answer.correct).length / answers.length : 0;
  const aboveChanceEvidence = clamp((observedCorrectRate - 0.25) / 0.35, 0, 1);
  const confidenceScore = Math.round(100 * (1 - clamp(rawEstimate.standardError / 1.35, 0, 1)) * domainCoverage * (0.7 + fitFactor * 0.3) * (0.6 + aboveChanceEvidence * 0.4));
  const confidenceLabel = confidenceScore >= 80 ? "high" : confidenceScore >= 60 ? "moderate" : confidenceScore >= 35 ? "developing" : "low";
  return {
    completedAt: completedAt.toISOString(),
    estimatedLevel: closestLevel(overallAbility),
    overallAbility,
    confidence: {
      score: confidenceScore,
      label: confidenceLabel,
      standardError: rawEstimate.standardError,
      abilityRange: [round(clamp(overallAbility - 1.64 * rawEstimate.standardError, ABILITY_MIN, ABILITY_MAX)), round(clamp(overallAbility + 1.64 * rawEstimate.standardError, ABILITY_MIN, ABILITY_MAX))],
    },
    dimensionScores,
    domainEstimates,
    topicScores,
    strongAreas: rankedTopics.filter(([, score]) => score >= 70).slice(0, 5).map(([topic]) => topic),
    weakAreas: rankedTopics.filter(([, score]) => score <= 50).reverse().slice(0, 5).map(([topic]) => topic),
    answers,
  };
}
