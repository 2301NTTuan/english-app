import { describe, expect, it } from "vitest";
import { placementQuestions } from "@/data/placement";
import { answerPlacementQuestion, placementAbilityIndex, scorePlacement, selectPlacementQuestion } from "./placement";

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
    expect(result.weakAreas.length).toBeGreaterThan(0);
    expect(result.completedAt).toBe("2026-08-23T00:00:00.000Z");
  });
});
