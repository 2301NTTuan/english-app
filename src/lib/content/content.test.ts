import { describe, expect, it } from "vitest";
import { exercises } from "@/data/exercises";
import { expressions } from "@/data/expressions";
import { grammarTopics } from "@/data/grammar";
import { placementQuestions } from "@/data/placement";
import { readingPassages } from "@/data/placement-reading";
import { contentProvenanceBatches } from "@/data/content-provenance";
import { vocabulary } from "@/data/vocabulary";
import { normalizeVocabularyItem } from "./vocabulary";
import { validateLearningContent } from "./validate";
import { auditGrammarLessons, grammarLessonIssues } from "./grammar-quality";
import { auditPlacementBank } from "./placement-quality";
import { auditExpressions, deterministicExpressionSample, expressionSemanticRubricIssues } from "./expression-quality";

describe("learning content pipeline", () => {
  it("normalizes whitespace and duplicate relations while preserving IDs", () => {
    const normalized = normalizeVocabularyItem({ ...vocabulary[0], word: `  ${vocabulary[0].word}  `, synonyms: [...vocabulary[0].synonyms, vocabulary[0].synonyms[0]] });
    expect(normalized.id).toBe(vocabulary[0].id); expect(normalized.word).toBe(vocabulary[0].word); expect(normalized.synonyms).toHaveLength(vocabulary[0].synonyms.length);
  });

  it("validates the complete application dataset", () => {
    expect(validateLearningContent({ vocabulary, grammar: grammarTopics, expressions, exercises, placement: placementQuestions, readingPassages, provenance: contentProvenanceBatches })).toEqual([]);
  });

  it("recognizes completed grammar enrichment batches and audits the whole catalogue", () => {
    expect(grammarTopics).toHaveLength(138);
    expect(grammarTopics.filter((topic) => topic.level === "A1").flatMap(grammarLessonIssues)).toEqual([]);
    expect(grammarTopics.filter((topic) => topic.level === "A2").flatMap(grammarLessonIssues)).toEqual([]);
    expect(grammarTopics.filter((topic) => topic.level === "B1").flatMap(grammarLessonIssues)).toEqual([]);
    expect(grammarTopics.filter((topic) => topic.level === "B2").flatMap(grammarLessonIssues)).toEqual([]);
    expect(grammarTopics.filter((topic) => topic.level === "C1").flatMap(grammarLessonIssues)).toEqual([]);
    expect(grammarTopics.filter((topic) => topic.level === "C2").flatMap(grammarLessonIssues)).toEqual([]);
    expect(auditGrammarLessons(grammarTopics).productionReady).toBe(138);
  });

  it("reports duplicate IDs, self-relations, broken prerequisites, and ambiguous choices", () => {
    const brokenVocabulary = { ...vocabulary[0], synonyms: [{ word: vocabulary[0].word, strength: 100 }] };
    const brokenGrammar = { ...grammarTopics[0], prerequisites: ["missing-topic"] };
    const brokenExercise = { ...exercises[0], options: [exercises[0].answer, exercises[0].answer, "x"] };
    const errors = validateLearningContent({ vocabulary: [brokenVocabulary, brokenVocabulary], grammar: [brokenGrammar], expressions: [], exercises: [brokenExercise] });
    expect(errors.some((error) => error.includes("duplicate"))).toBe(true);
    expect(errors.some((error) => error.includes("self-referencing"))).toBe(true);
    expect(errors.some((error) => error.includes("broken prerequisite"))).toBe(true);
    expect(errors.some((error) => error.includes("answer must appear exactly once"))).toBe(true);
  });

  it("rejects generic placement explanations that merely restate correctness", () => {
    const item = { ...placementQuestions[0], explanation: `“${placementQuestions[0].answer}” is the only option that correctly completes the task.` };
    const errors = validateLearningContent({ vocabulary: [], grammar: [], expressions: [], exercises: [], placement: [item], provenance: contentProvenanceBatches });
    expect(errors.some((error) => error.includes("explanation is generic rather than instructional"))).toBe(true);
  });

  it("meets the production engineering baseline for the placement bank", () => {
    const report = auditPlacementBank(placementQuestions, readingPassages);
    expect(report.total).toBeGreaterThanOrEqual(600);
    expect(report.byDomain).toMatchObject({ vocabulary: 210, grammar: 200, context: 120, reading: 82 });
    expect(report.passages).toBe(22);
    expect(Math.min(...Object.values(report.byLevel))).toBeGreaterThanOrEqual(60);
    expect(report.answerPositions).toEqual([153, 153, 153, 153]);
    expect(report.criticalIssues).toEqual([]);
  });

  it("rejects structural and duplicate defects in the Expressions corpus", () => {
    const report = auditExpressions(expressions);
    expect(report.criticalIssues).toEqual([]);
    expect(report.suspiciousNearDuplicates).toEqual([]);
  });

  it("meets the Expressions count gate and deterministic 220-record semantic sample", () => {
    const report = auditExpressions(expressions);
    expect(report.byKind).toMatchObject({ idiom: 303, "phrasal-verb": 310, collocation: 1001, "common-expression": 7 });
    const idioms = deterministicExpressionSample(expressions, "idiom", 60);
    const phrasalVerbs = deterministicExpressionSample(expressions, "phrasal-verb", 60);
    const collocations = deterministicExpressionSample(expressions, "collocation", 100);
    const sample = [...idioms, ...phrasalVerbs, ...collocations];
    expect({ idioms: idioms.length, phrasalVerbs: phrasalVerbs.length, collocations: collocations.length, total: sample.length }).toEqual({ idioms: 60, phrasalVerbs: 60, collocations: 100, total: 220 });
    expect(new Set(sample.map((item) => item.id)).size).toBe(220);
    expect(new Set(idioms.map((item) => item.cefrLevel)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(phrasalVerbs.map((item) => item.cefrLevel)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(collocations.map((item) => item.cefrLevel)).size).toBeGreaterThanOrEqual(5);
    expect(sample.flatMap(expressionSemanticRubricIssues)).toEqual([]);
  });
});
