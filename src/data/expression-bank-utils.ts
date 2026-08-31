import type { ExpressionItem } from "@/types/domain";

export type ExpressionSeed = [
  expression: string,
  meaning: string,
  vietnameseMeaning: string,
  cefrLevel: ExpressionItem["cefrLevel"],
  example: string,
  usageNotes: string,
  tag: string,
];

const slug = (value: string) => value.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function buildExpressionBank(kind: Exclude<ExpressionItem["kind"], "phrasal-verb">, prefix: string, seeds: ExpressionSeed[]): ExpressionItem[] {
  return seeds.map(([expression, meaning, vietnameseMeaning, cefrLevel, example, usageNotes, tag]) => ({
    id: `${prefix}-${slug(expression)}`,
    expression,
    kind,
    meaning,
    vietnameseMeaning,
    cefrLevel,
    examples: [example],
    usageNotes,
    tags: [tag],
    status: "validated",
  }));
}
