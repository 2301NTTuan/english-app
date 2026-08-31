import { describe, expect, it } from "vitest";
import { buildDailyPlan } from "./plan";
import type { LearningInventory, UserSettings } from "@/types/domain";

const settings: UserSettings = { currentLevel: "B1", dailyTarget: 25, maxNewWordsPerDay: 10, maxNewGrammarTopicsPerDay: 1, desiredRetention: 0.9, interfaceLanguage: "en", showVietnamese: true };
const empty: LearningInventory = { overdueVocabulary: 0, overdueGrammar: 0, dueVocabulary: 0, dueGrammar: 0, weakVocabulary: 0, weakGrammar: 0, mistakes: 0, newVocabulary: 30, newGrammar: 0, newExpressions: 0 };
const count = (inventory: LearningInventory, category: string) => buildDailyPlan(inventory, settings).allocations.find((item) => item.category === category)?.count ?? 0;

describe("buildDailyPlan", () => {
  it("allows up to the configured maximum with a small review load", () => expect(count({ ...empty, dueVocabulary: 8 }, "newVocabulary")).toBe(10));
  it("uses only remaining target capacity when reviews consume most of it", () => expect(count({ ...empty, dueVocabulary: 20 }, "newVocabulary")).toBe(5));
  it("does not force new words when backlog meets the target", () => expect(count({ ...empty, overdueVocabulary: 30 }, "newVocabulary")).toBe(0));
  it("never drops overdue reviews merely because they exceed the target", () => expect(buildDailyPlan({ ...empty, overdueVocabulary: 30 }, settings).totalItems).toBe(30));
  it("puts overdue items before all other categories", () => expect(buildDailyPlan({ ...empty, overdueGrammar: 4, dueVocabulary: 5, weakVocabulary: 5 }, settings).allocations.map((item) => item.category).slice(0, 3)).toEqual(["overdueGrammar", "dueVocabulary", "weakVocabulary"]));
  it("prioritizes repeated mistakes before weak knowledge", () => expect(buildDailyPlan({ ...empty, mistakes: 2, weakVocabulary: 2 }, settings).allocations.map((item) => item.category).slice(0, 2)).toEqual(["mistakes", "weakVocabulary"]));
  it("respects the configured grammar topic limit", () => expect(buildDailyPlan({ ...empty, newGrammar: 8 }, { ...settings, maxNewGrammarTopicsPerDay: 2 }).allocations.find((item) => item.category === "newGrammar")?.count).toBe(2));
});
