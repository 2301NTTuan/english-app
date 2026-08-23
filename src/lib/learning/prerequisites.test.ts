import { describe, expect, it } from "vitest";
import { prerequisitesMet, recommendableTopics } from "./prerequisites";
import type { GrammarProgress, GrammarTopic } from "@/types/domain";

const base: GrammarTopic = { id: "present-perfect", title: "Present Perfect", level: "A2", category: "Core", description: "", prerequisites: ["past-simple"], explanation: "", structures: [], examples: [], commonMistakes: [], subtopics: [] };
const progress = (mastery: number): GrammarProgress[] => [{ topicId: "past-simple", mastery, subtopicMastery: {}, review: { difficulty: 5, stability: 1, state: "review", nextReview: "2026-08-23T00:00:00.000Z", scheduledDays: 1, elapsedDays: 1, reviewCount: 1, correctCount: 1, incorrectCount: 0, lapses: 0 } }];
describe("grammar prerequisites", () => {
  it("requires prerequisite mastery at the threshold", () => { expect(prerequisitesMet(base, progress(69))).toBe(false); expect(prerequisitesMet(base, progress(70))).toBe(true); });
  it("recommends unlocked unmastered topics", () => expect(recommendableTopics([base], progress(80))).toEqual([base]));
});
