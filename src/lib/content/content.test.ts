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

describe("learning content pipeline", () => {
  it("normalizes whitespace and duplicate relations while preserving IDs", () => {
    const normalized = normalizeVocabularyItem({ ...vocabulary[0], word: `  ${vocabulary[0].word}  `, synonyms: [...vocabulary[0].synonyms, vocabulary[0].synonyms[0]] });
    expect(normalized.id).toBe(vocabulary[0].id); expect(normalized.word).toBe(vocabulary[0].word); expect(normalized.synonyms).toHaveLength(vocabulary[0].synonyms.length);
  });

  it("validates the complete application dataset", () => {
    expect(validateLearningContent({ vocabulary, grammar: grammarTopics, expressions, exercises, placement: placementQuestions, readingPassages, provenance: contentProvenanceBatches })).toEqual([]);
  });

  it("recognizes the completed opening A1 grammar batch and audits the whole catalogue", () => {
    expect(grammarTopics).toHaveLength(138);
    expect(grammarTopics.slice(0, 12).flatMap(grammarLessonIssues)).toEqual([]);
    expect(auditGrammarLessons(grammarTopics).productionReady).toBe(12);
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
});
