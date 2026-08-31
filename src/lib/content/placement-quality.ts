import type { CEFRLevel, PlacementDimension, PlacementQuestion, ReadingPassage } from "@/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const domains: PlacementDimension[] = ["vocabulary", "grammar", "context", "reading"];
const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
const duplicates = (values: string[]) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
const countBy = <T>(values: T[], keys: readonly string[], key: (value: T) => string) =>
  Object.fromEntries(keys.map((candidate) => [candidate, values.filter((value) => key(value) === candidate).length]));

export interface PlacementQualityReport {
  total: number;
  passages: number;
  byDomain: Record<PlacementDimension, number>;
  byLevel: Record<CEFRLevel, number>;
  answerPositions: [number, number, number, number];
  meanCorrectAnswerLength: number;
  meanDistractorLength: number;
  criticalIssues: string[];
  warnings: string[];
}

export function auditPlacementBank(questions: PlacementQuestion[], passages: ReadingPassage[]): PlacementQualityReport {
  const criticalIssues: string[] = [];
  const warnings: string[] = [];
  const passageIds = new Set(passages.map((passage) => passage.id));
  const referencedPassageIds = new Set(questions.flatMap((question) => question.passageId ? [question.passageId] : []));
  const answerPositions = [0, 1, 2, 3].map((position) => questions.filter((question) => question.options?.[position] === question.answer).length) as [number, number, number, number];

  for (const id of duplicates(questions.map((question) => question.id))) criticalIssues.push(`duplicate question id: ${id}`);
  for (const prompt of duplicates(questions.map((question) => normalize(question.prompt)))) criticalIssues.push(`duplicate normalized prompt: ${prompt}`);
  for (const optionSet of duplicates(questions.map((question) => question.options?.map(normalize).sort().join("|") ?? ""))) criticalIssues.push(`duplicate option set: ${optionSet}`);
  for (const passageId of duplicates(passages.map((passage) => passage.id))) criticalIssues.push(`duplicate passage id: ${passageId}`);

  for (const question of questions) {
    const choices = question.options ?? [];
    if (choices.length !== 4) criticalIssues.push(`${question.id}: expected exactly four choices`);
    if (new Set(choices.map(normalize)).size !== choices.length) criticalIssues.push(`${question.id}: duplicate choices`);
    if (choices.filter((choice) => normalize(choice) === normalize(question.answer)).length !== 1) criticalIssues.push(`${question.id}: answer must occur exactly once`);
    if (question.dimension === "reading" && (!question.passageId || !passageIds.has(question.passageId))) criticalIssues.push(`${question.id}: broken passage reference`);
    if (question.dimension !== "reading" && question.passageId) criticalIssues.push(`${question.id}: non-reading item has a passage reference`);

    const answerLength = question.answer.trim().length;
    const otherLengths = choices.filter((choice) => normalize(choice) !== normalize(question.answer)).map((choice) => choice.trim().length);
    const otherMean = otherLengths.reduce((sum, length) => sum + length, 0) / Math.max(1, otherLengths.length);
    if (answerLength >= Math.max(18, otherMean * 2.5)) warnings.push(`${question.id}: correct answer is much longer than its distractors`);
  }

  for (const passage of passages) if (!referencedPassageIds.has(passage.id)) criticalIssues.push(`${passage.id}: passage has no questions`);

  const correctLengths = questions.map((question) => question.answer.trim().length);
  const distractorLengths = questions.flatMap((question) => (question.options ?? []).filter((choice) => normalize(choice) !== normalize(question.answer)).map((choice) => choice.trim().length));
  const spread = Math.max(...answerPositions) - Math.min(...answerPositions);
  if (spread > 1) criticalIssues.push(`answer-position imbalance exceeds one item: ${answerPositions.join("/")}`);

  return {
    total: questions.length,
    passages: passages.length,
    byDomain: countBy(questions, domains, (question) => question.dimension) as Record<PlacementDimension, number>,
    byLevel: countBy(questions, levels, (question) => question.level) as Record<CEFRLevel, number>,
    answerPositions,
    meanCorrectAnswerLength: Number((correctLengths.reduce((sum, length) => sum + length, 0) / Math.max(1, correctLengths.length)).toFixed(2)),
    meanDistractorLength: Number((distractorLengths.reduce((sum, length) => sum + length, 0) / Math.max(1, distractorLengths.length)).toFixed(2)),
    criticalIssues,
    warnings,
  };
}
