import { describe, expect, it } from "vitest";
import { placementQuestions } from "@/data/placement";
import type { PlacementAnswer } from "@/types/domain";
import { answerPlacementQuestion, PLACEMENT_MAX_LENGTH, placementAbilityIndex, placementShouldStop, scorePlacement, selectPlacementQuestion } from "./placement";

describe("adaptive placement", () => {
  it("moves upward after correct evidence and downward after incorrect evidence", () => {
    const first = placementQuestions.find((item) => item.level === "B1")!;
    const correct = [answerPlacementQuestion(first, first.answer), answerPlacementQuestion({ ...first, id: "second" }, first.answer)];
    const incorrect = [answerPlacementQuestion(first, "wrong"), answerPlacementQuestion({ ...first, id: "second" }, "wrong")];
    expect(placementAbilityIndex(correct)).toBeGreaterThan(2);
    expect(placementAbilityIndex(incorrect)).toBeLessThan(2);
  });

  it("does not repeat questions and balances dimensions", () => {
    const answers = [answerPlacementQuestion(placementQuestions[12], placementQuestions[12].answer)];
    expect(selectPlacementQuestion(placementQuestions, answers)?.id).not.toBe(placementQuestions[12].id);
    expect(selectPlacementQuestion(placementQuestions, answers)?.dimension).not.toBe("vocabulary");
  });

  it("returns diagnostic dimension and topic scores", () => {
    const questions = placementQuestions.slice(0, 3);
    const result = scorePlacement(questions.map((question, index) => answerPlacementQuestion(question, index === 0 ? question.answer : "wrong")), new Date("2026-08-23T00:00:00.000Z"));
    expect(result.dimensionScores.vocabulary).toBe(50);
    expect(result.dimensionScores.reading).toBe(0);
    expect(result.confidence.label).toBe("low");
    expect(result.weakAreas.length).toBeGreaterThan(0);
    expect(result.completedAt).toBe("2026-08-23T00:00:00.000Z");
  });

  it.each([
    ["advanced", (level: string) => level !== "C2", ["C1", "C2"]],
    ["foundation", (level: string) => level === "A1", ["A1", "A2"]],
  ])("simulates a stable %s learner without an implausible estimate", (_name, succeeds, expectedLevels) => {
    const answers: PlacementAnswer[] = [];
    while (answers.length < PLACEMENT_MAX_LENGTH) {
      const question = selectPlacementQuestion(placementQuestions, answers)!;
      answers.push(answerPlacementQuestion(question, succeeds(question.level) ? question.answer : "__incorrect__", 2_000));
      if (placementShouldStop(answers, Boolean(selectPlacementQuestion(placementQuestions, answers)))) break;
    }
    const result = scorePlacement(answers);
    expect(expectedLevels).toContain(result.estimatedLevel);
    expect(answers.length).toBeGreaterThanOrEqual(25);
  });

  it("keeps a random-answer profile at low confidence and runs to the upper bound", () => {
    const answers: PlacementAnswer[] = [];
    while (answers.length < PLACEMENT_MAX_LENGTH) {
      const question = selectPlacementQuestion(placementQuestions, answers)!;
      answers.push(answerPlacementQuestion(question, answers.length % 4 === 0 ? question.answer : "__incorrect__", 250));
      if (placementShouldStop(answers, Boolean(selectPlacementQuestion(placementQuestions, answers)))) break;
    }
    const result = scorePlacement(answers);
    expect(answers).toHaveLength(PLACEMENT_MAX_LENGTH);
    expect(result.confidence.label).toBe("low");
    expect(["A1", "A2", "B1"]).toContain(result.estimatedLevel);
  });

  it("reports a constrained overall level when grammar is much weaker", () => {
    const answers: PlacementAnswer[] = [];
    while (answers.length < PLACEMENT_MAX_LENGTH) {
      const question = selectPlacementQuestion(placementQuestions, answers)!;
      const succeeds = question.dimension !== "grammar" && ["A1", "A2", "B1", "B2"].includes(question.level);
      answers.push(answerPlacementQuestion(question, succeeds ? question.answer : "__incorrect__"));
      if (placementShouldStop(answers, Boolean(selectPlacementQuestion(placementQuestions, answers)))) break;
    }
    const result = scorePlacement(answers);
    expect(["A1", "A2"]).toContain(result.domainEstimates.grammar.estimatedLevel);
    expect(["A1", "A2", "B1"]).toContain(result.estimatedLevel);
  });

  it("penalizes previously seen items when an equivalent unseen item exists", () => {
    const candidates = placementQuestions.filter((question) => question.level === "B1" && question.dimension === "vocabulary").slice(0, 2);
    const chosen = selectPlacementQuestion(candidates, [], { previouslySeenQuestionIds: [candidates[0].id] });
    expect(chosen?.id).toBe(candidates[1].id);
  });
});
