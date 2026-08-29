import { describe, expect, it } from "vitest";
import { vocabulary } from "@/data/vocabulary";
import { generateRelationExercise, generateVocabularyExercise, selectVocabularyDistractors, validGeneratedExercise } from "./exercises";

describe("exercise generation", () => {
  it("selects plausible distractors close in level and part of speech", () => {
    const item = vocabulary.find((entry) => entry.word === "temporary" && entry.partOfSpeech === "adjective")!;
    const distractors = selectVocabularyDistractors(item, vocabulary);
    expect(distractors).toHaveLength(3); expect(distractors.filter((entry) => entry.partOfSpeech === item.partOfSpeech).length).toBeGreaterThan(1);
  });

  it("generates four unique choices with one correct answer for every mastery dimension", () => {
    const item = vocabulary.find((entry) => entry.word === "decide")!;
    for (const dimension of ["recognition", "recall", "context", "spelling"] as const) expect(validGeneratedExercise(generateVocabularyExercise(item, "newVocabulary", dimension))).toBe(true);
    expect(generateVocabularyExercise(item, "newVocabulary", "context").prompt).not.toContain("decided");
  });

  it("keeps equivalent vocabulary clues out of the same answer set", () => {
    const job = vocabulary.find((item) => item.id === "a1-job")!;
    const happen = vocabulary.find((item) => item.id === "foundation-a2-happen")!;
    const temporary = vocabulary.find((item) => item.id === "v25")!;
    expect(generateVocabularyExercise(job, "newVocabulary", "recall").options).not.toContain("work");
    expect(generateVocabularyExercise(happen, "newVocabulary", "recall").options).not.toContain("occur");
    expect(generateVocabularyExercise(temporary, "newVocabulary", "recognition").options).not.toContain("lasting only a short time");
  });

  it("excludes related words from synonym distractors", () => {
    const item = vocabulary.find((entry) => entry.synonyms.length && entry.antonyms.length)!; const exercise = generateRelationExercise(item, "synonym", "weakVocabulary")!;
    expect(validGeneratedExercise(exercise)).toBe(true); expect(exercise.options).not.toContain(item.antonyms[0].word);
  });
});
