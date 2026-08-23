import { describe, expect, it } from "vitest";
import { placementQuestions } from "@/data/placement";
import { createInitialState, normalizeState } from "@/lib/storage/app-repository";
import { buildLearningPath } from "./path";
import { answerPlacementQuestion, PLACEMENT_LENGTH, scorePlacement, selectPlacementQuestion } from "./placement";
import { buildStudySession } from "./session";
import type { PlacementAnswer } from "@/types/domain";

describe("advanced learner flow", () => {
  it("turns adaptive placement evidence into a path and study session", () => {
    const answers: PlacementAnswer[] = [];
    while (answers.length < PLACEMENT_LENGTH) {
      const question = selectPlacementQuestion(placementQuestions, answers)!;
      const answer = ["A1", "A2", "B1"].includes(question.level) ? question.answer : "not the answer";
      answers.push(answerPlacementQuestion(question, answer));
    }
    const placement = scorePlacement(answers, new Date("2026-08-23T00:00:00.000Z"));
    const state = createInitialState(); state.placement = placement; state.settings.currentLevel = placement.estimatedLevel;
    expect(answers).toHaveLength(30); expect(buildLearningPath(state).length).toBeGreaterThan(0); expect(buildStudySession(state).length).toBeGreaterThan(0);
  });

  it("preserves placement diagnostics and due scheduling after reload normalization", () => {
    const state = createInitialState(); const question = placementQuestions[0]; state.placement = scorePlacement([answerPlacementQuestion(question, question.answer)]);
    const due = state.vocabularyProgress[0].review.nextReview; const reloaded = normalizeState(JSON.parse(JSON.stringify(state)));
    expect(reloaded.placement?.answers).toHaveLength(1); expect(reloaded.vocabularyProgress[0].review.nextReview).toBe(due);
  });
});
