import { describe, expect, it } from "vitest";
import { createInitialState, normalizeState, upsertMistake } from "./app-repository";

describe("app repository", () => {
  it("falls back safely for invalid imported data", () => expect(normalizeState({ broken: true }).settings.currentLevel).toBe("B1"));
  it("preserves valid state while filling missing optional data", () => { const state = createInitialState(); const normalized = normalizeState({ ...state, activities: undefined }); expect(normalized.activities.length).toBeGreaterThan(0); expect(normalized.settings).toEqual(state.settings); });
  it("groups repeated mistakes", () => { const existing = createInitialState().mistakes[0]; const result = upsertMistake([existing], { itemId: existing.itemId, label: existing.label, knowledgeType: existing.knowledgeType, exerciseType: existing.exerciseType, wrongAnswer: "another error", correctAnswer: existing.correctAnswer }); expect(result).toHaveLength(1); expect(result[0].repeatedCount).toBe(existing.repeatedCount + 1); });
});
