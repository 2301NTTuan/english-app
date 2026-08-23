import { describe, expect, it } from "vitest";
import { createInitialState } from "@/lib/storage/app-repository";
import { buildLearningPath } from "./path";

describe("buildLearningPath", () => {
  it("prioritizes weak foundations and changes after mastery improves", () => {
    const state = createInitialState();
    const topic = state.grammarProgress[0]; topic.mastery = 20; topic.review.nextReview = "2099-01-01T00:00:00.000Z";
    const first = buildLearningPath(state, new Date("2026-08-23T00:00:00.000Z"));
    expect(first.some((item) => item.itemId === topic.topicId && item.state === "needs-foundation")).toBe(true);
    topic.mastery = 90;
    const updated = buildLearningPath(state, new Date("2026-08-23T00:00:00.000Z"));
    expect(updated.find((item) => item.itemId === topic.topicId)?.state).not.toBe("needs-foundation");
  });

  it("uses unresolved mistake frequency as a recommendation signal", () => {
    const state = createInitialState();
    state.grammarProgress.forEach((progress) => { progress.review.nextReview = "2099-01-01T00:00:00.000Z"; });
    const review = state.grammarProgress[0].review;
    state.grammarProgress.push({ topicId: "past-simple", mastery: 80, subtopicMastery: {}, review }, { topicId: "present-perfect", mastery: 80, subtopicMastery: {}, review });
    const result = buildLearningPath(state, new Date("2026-08-23T00:00:00.000Z"));
    expect(result[0].itemId).toBe("perfect-vs-past");
  });
});
