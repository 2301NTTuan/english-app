import { describe, expect, it } from "vitest";
import { vocabulary } from "@/data/vocabulary";
import { grammarTopics } from "@/data/grammar";
import { buildStudySession, selectExpressionCandidates, summarizeStudySession } from "./session";
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
    expect(summarizeStudySession(session)).toMatchObject({
      total: 5,
      review: 1,
      newItems: 4,
      newVocabulary: 4,
      newGrammar: 0,
      newExpressions: 0,
      vocabulary: 5,
      grammar: 0,
      expressions: 0,
    });
  });

  it("summarizes the mix and duration shown before a session", () => {
    const session = buildStudySession(createInitialState(), new Date("2026-08-23T12:00:00.000Z"));
    const overview = summarizeStudySession(session);
    expect(overview.total).toBe(session.length);
    expect(overview.review + overview.mistakeRepair + overview.newItems).toBe(overview.total);
    expect(overview.vocabulary + overview.grammar + overview.expressions).toBe(overview.total);
    expect(overview.newVocabulary + overview.newGrammar + overview.newExpressions).toBe(overview.newItems);
    expect(overview.estimatedMinutes).toBeGreaterThan(0);
  });

  it("places recurring mistakes before new material", () => {
    const state = createInitialState();
    state.settings = { ...state.settings, dailyTarget: 3 };
    state.vocabularyProgress = []; state.grammarProgress = [];
    state.mistakes = [state.mistakes[0]];
    const session = buildStudySession(state, new Date("2026-08-23T12:00:00.000Z"));
    expect(session[0].source).toBe("mistakes");
  });

  it("can select new material from the end of the full 6,000-entry corpus", () => {
    const state = createInitialState();
    const progress = state.vocabularyProgress[0];
    state.settings = { ...state.settings, currentLevel: "C2", dailyTarget: 1, maxNewWordsPerDay: 1 };
    state.vocabularyProgress = vocabulary.slice(0, -1).map((item) => ({
      ...progress,
      itemId: item.id,
      mastery: { recognition: 100, recall: 100, context: 100, spelling: 100, overall: 100 },
      review: { ...progress.review, nextReview: "2099-01-01T00:00:00.000Z" },
    }));
    state.grammarProgress = [];
    state.mistakes = [];

    const session = buildStudySession(state, new Date("2026-08-30T12:00:00.000Z"));

    expect(vocabulary).toHaveLength(6_000);
    expect(session).toHaveLength(1);
    expect(session[0]).toMatchObject({ itemId: "master-zoology-noun", source: "newVocabulary" });
  });

  it("can select grammar from beyond the former detailed subset", () => {
    const state = createInitialState();
    const review = state.grammarProgress[0].review;
    state.settings = { ...state.settings, currentLevel: "C2", dailyTarget: 1, maxNewWordsPerDay: 0, maxNewGrammarTopicsPerDay: 1 };
    state.vocabularyProgress = [];
    state.grammarProgress = grammarTopics.filter((topic) => topic.id !== "advanced-cohesive-devices").map((topic) => ({
      topicId: topic.id, mastery: 100, subtopicMastery: Object.fromEntries(topic.subtopics.map((subtopic) => [subtopic.id, 100])),
      review: { ...review, nextReview: "2099-01-01T00:00:00.000Z" },
    }));
    state.mistakes = [];

    const session = buildStudySession(state, new Date("2026-08-30T12:00:00.000Z"));

    expect(grammarTopics).toHaveLength(138);
    expect(session).toHaveLength(1);
    expect(session[0]).toMatchObject({ itemId: "advanced-cohesive-devices", knowledgeType: "grammar", source: "newGrammar" });
  });

  it("uses the complete Expressions corpus as study-session candidates", () => {
    const candidates = selectExpressionCandidates("C2", 0);
    expect(candidates).toHaveLength(1_621);
    expect(selectExpressionCandidates("C2", candidates.length - 1)[0]).toMatchObject({ id: "collocation-legally-binding", expression: "legally binding" });

    const state = createInitialState();
    state.settings = { ...state.settings, currentLevel: "C2", dailyTarget: 1, maxNewWordsPerDay: 0, maxNewGrammarTopicsPerDay: 0 };
    state.vocabularyProgress = []; state.grammarProgress = []; state.mistakes = [];
    const session = buildStudySession(state, new Date("2026-08-30T12:00:00.000Z"));
    expect(session).toHaveLength(1);
    expect(session[0]).toMatchObject({ knowledgeType: "expression", source: "newExpressions" });
    expect(session[0].options).toContain(session[0].answer);
  });
});
