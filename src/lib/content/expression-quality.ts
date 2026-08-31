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
