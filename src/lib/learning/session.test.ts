import { describe, expect, it } from "vitest";
import { buildStudySession } from "./session";
import { createInitialState } from "@/lib/storage/app-repository";

describe("buildStudySession", () => {
  it("turns the adaptive plan into ordered exercises", () => {
    const state = createInitialState();
    state.settings = { ...state.settings, dailyTarget: 5, maxNewWordsPerDay: 5 };
    state.vocabularyProgress = [{ ...state.vocabularyProgress[0], mastery: { recognition: 80, recall: 80, context: 80, spelling: 80, overall: 80 }, review: { ...state.vocabularyProgress[0].review, nextReview: "2026-08-20T00:00:00.000Z" } }];
    state.grammarProgress = []; state.mistakes = [];
    const session = buildStudySession(state, new Date("2026-08-23T12:00:00.000Z"));
    expect(session).toHaveLength(5);
    expect(session[0].source).toBe("overdueVocabulary");
    expect(session.slice(1).every((item) => item.source === "newVocabulary")).toBe(true);
    expect(session.every((item) => item.options?.includes(item.answer))).toBe(true);
  });

  it("places recurring mistakes before new material", () => {
    const state = createInitialState();
    state.settings = { ...state.settings, dailyTarget: 3 };
    state.vocabularyProgress = []; state.grammarProgress = [];
    state.mistakes = [state.mistakes[0]];
    const session = buildStudySession(state, new Date("2026-08-23T12:00:00.000Z"));
    expect(session[0].source).toBe("mistakes");
  });
});
