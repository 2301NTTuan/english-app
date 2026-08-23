import { describe, expect, it } from "vitest";
import { prerequisitesMet, recommendableTopics } from "./prerequisites";
import type { GrammarProgress, GrammarTopic } from "@/types/domain";

const base: GrammarTopic = { id: "present-perfect", title: "Present Perfect", level: "A2", category: "Core", description: "", prerequisites: ["past-simple"], explanation: "", structures: [], examples: [], commonMistakes: [], subtopics: [] };
const progress = (mastery: number): GrammarProgress[] => [{ topicId: "past-simple", mastery, subtopicMastery: {} }];
describe("grammar prerequisites", () => {
  it("requires prerequisite mastery at the threshold", () => { expect(prerequisitesMet(base, progress(69))).toBe(false); expect(prerequisitesMet(base, progress(70))).toBe(true); });
  it("recommends unlocked unmastered topics", () => expect(recommendableTopics([base], progress(80))).toEqual([base]));
});
