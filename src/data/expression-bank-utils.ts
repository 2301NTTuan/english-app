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

export type PhrasalVerbSeed = [
  expression: string,
  meaning: string,
  vietnameseMeaning: string,
  cefrLevel: ExpressionItem["cefrLevel"],
  example: string,
  usageNotes: string,
  tag: string,
  separability: NonNullable<ExpressionItem["separability"]>,
];

export type CollocationSeed = [
  expression: string,
  meaning: string,
  vietnameseMeaning: string,
  cefrLevel: ExpressionItem["cefrLevel"],
  example: string,
  pattern: string,
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

export function buildPhrasalVerbBank(seeds: PhrasalVerbSeed[]): ExpressionItem[] {
  return seeds.map(([expression, meaning, vietnameseMeaning, cefrLevel, example, usageNotes, tag, separability]) => ({
    id: `phrasal-${slug(expression)}`,
    expression,
    kind: "phrasal-verb",
    meaning,
    vietnameseMeaning,
    cefrLevel,
    examples: [example],
    usageNotes,
    tags: [tag],
    relatedVerb: expression.split(" ")[0],
    separability,
    status: "validated",
  }));
}

export function buildCollocationBank(seeds: CollocationSeed[]): ExpressionItem[] {
  return seeds.map(([expression, meaning, vietnameseMeaning, cefrLevel, example, pattern, tag]) => ({
    id: `collocation-${slug(expression)}`,
    expression,
    kind: "collocation",
    meaning,
    vietnameseMeaning,
    cefrLevel,
    examples: [example],
    usageNotes: `${pattern} collocation. Learn and use “${expression}” as a natural lexical unit.`,
    tags: [tag, pattern.toLowerCase().replaceAll(" ", "-")],
    status: "validated",
  }));
}
