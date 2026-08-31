import type { CEFRLevel, ExpressionItem } from "@/types/domain";

const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const kinds: ExpressionItem["kind"][] = ["idiom", "phrasal-verb", "collocation", "common-expression"];
const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ");
const countBy = <T>(values: T[], keys: readonly string[], key: (value: T) => string) => Object.fromEntries(keys.map((candidate) => [candidate, values.filter((value) => key(value) === candidate).length]));
const duplicateValues = (values: string[]) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

export interface ExpressionQualityReport {
  total: number;
  byKind: Record<ExpressionItem["kind"], number>;
  byLevel: Record<CEFRLevel, number>;
  duplicateIds: string[];
  duplicateExpressions: string[];
  duplicateSemanticRecords: string[];
  duplicateExamples: string[];
  repeatedMeanings: string[];
  malformedRecords: string[];
  placeholderRecords: string[];
  suspiciousNearDuplicates: string[][];
  criticalIssues: string[];
}

const stableScore = (value: string) => [...value].reduce((score, character, index) => (score + character.charCodeAt(0) * (index + 17)) % 2_147_483_647, 0);

export function deterministicExpressionSample(items: ExpressionItem[], kind: ExpressionItem["kind"], size: number): ExpressionItem[] {
  const buckets = levels.map((level) => items.filter((item) => item.kind === kind && item.cefrLevel === level).sort((a, b) => stableScore(a.id) - stableScore(b.id) || a.id.localeCompare(b.id))).filter((bucket) => bucket.length);
  if (buckets.reduce((sum, bucket) => sum + bucket.length, 0) < size) throw new Error(`Cannot sample ${size} ${kind} records.`);
  const result: ExpressionItem[] = [];
  let round = 0;
  while (result.length < size) {
    let added = false;
    for (const bucket of buckets) {
      if (bucket[round] && result.length < size) { result.push(bucket[round]); added = true; }
    }
    if (!added) break;
    round += 1;
  }
  return result;
}

export function expressionSemanticRubricIssues(item: ExpressionItem): string[] {
  const issues: string[] = [];
  if (item.meaning.trim().length < 3) issues.push("meaning is not learner-explanatory");
  if (item.vietnameseMeaning.trim().length < 2) issues.push("Vietnamese meaning is empty or unnatural-looking");
  if (!item.examples.length || item.examples.some((example) => example.trim().length < 12 || !/[.!?]$/.test(example.trim()))) issues.push("example is incomplete");
  if (!levels.includes(item.cefrLevel)) issues.push("CEFR is invalid");
  if (!item.tags.length || !item.usageNotes.trim()) issues.push("usage metadata is missing");
  if (item.status !== "validated" && item.status !== "reviewed" && item.status !== "published") issues.push("lifecycle is not production-eligible");
  if (item.kind === "phrasal-verb" && (!item.relatedVerb || !item.separability)) issues.push("phrasal metadata is incomplete");
  return issues.map((issue) => `${item.id}: ${issue}`);
}

export function auditExpressions(items: ExpressionItem[]): ExpressionQualityReport {
  const duplicateIds = duplicateValues(items.map((item) => item.id));
  const duplicateExpressions = duplicateValues(items.map((item) => normalize(item.expression)));
  const duplicateSemanticRecords = duplicateValues(items.map((item) => `${item.kind}:${normalize(item.expression)}:${normalize(item.meaning)}`));
  const duplicateExamples = duplicateValues(items.flatMap((item) => item.examples.map(normalize)));
  const repeatedMeanings = duplicateValues(items.map((item) => normalize(item.meaning)));
  const malformedRecords = items.filter((item) => !item.id.trim() || !item.expression.trim() || !item.meaning.trim() || !item.vietnameseMeaning.trim() || !item.examples.length || item.examples.some((example) => example.trim().length < 8) || !item.usageNotes.trim() || !item.tags.length || (item.kind === "phrasal-verb" && (!item.relatedVerb || !item.separability))).map((item) => item.id);
  const placeholderRecords = items.filter((item) => /\b(todo|tbd|placeholder|lorem ipsum|example sentence|meaning here|translation here)\b/i.test([item.expression, item.meaning, item.vietnameseMeaning, ...item.examples, item.usageNotes].join(" "))).map((item) => item.id);
  const nearKey = (value: string) => normalize(value).replace(/\b(a|an|the|your|someone|someones|something)\b/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const nearGroups = new Map<string, string[]>();
  for (const item of items) {
    const key = `${item.kind}:${nearKey(item.expression)}`;
    nearGroups.set(key, [...(nearGroups.get(key) ?? []), item.id]);
  }
  const suspiciousNearDuplicates = [...nearGroups.values()].filter((ids) => ids.length > 1);
  const criticalIssues = [
    ...duplicateIds.map((value) => `duplicate id: ${value}`),
    ...duplicateExpressions.map((value) => `duplicate expression text: ${value}`),
    ...duplicateSemanticRecords.map((value) => `duplicate semantic record: ${value}`),
    ...duplicateExamples.map((value) => `duplicate example: ${value}`),
    ...malformedRecords.map((value) => `malformed record: ${value}`),
    ...placeholderRecords.map((value) => `placeholder record: ${value}`),
  ];
  return {
    total: items.length,
    byKind: countBy(items, kinds, (item) => item.kind) as Record<ExpressionItem["kind"], number>,
    byLevel: countBy(items, levels, (item) => item.cefrLevel) as Record<CEFRLevel, number>,
    duplicateIds,
    duplicateExpressions,
    duplicateSemanticRecords,
    duplicateExamples,
    repeatedMeanings,
    malformedRecords,
    placeholderRecords,
    suspiciousNearDuplicates,
    criticalIssues,
  };
}
