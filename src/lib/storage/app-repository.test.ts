import { describe, expect, it } from "vitest";
import { createInitialState, normalizeState, upsertMistake } from "./app-repository";
import { scorePlacement } from "@/lib/learning/placement";

describe("app repository", () => {
  it("falls back safely for invalid imported data", () => expect(normalizeState({ broken: true }).settings.currentLevel).toBe("B1"));
  it("preserves valid state while filling missing optional data", () => { const state = createInitialState(); const normalized = normalizeState({ ...state, activities: undefined }); expect(normalized.activities.length).toBeGreaterThan(0); expect(normalized.settings).toEqual(state.settings); });
  it("groups repeated mistakes", () => { const existing = createInitialState().mistakes[0]; const result = upsertMistake([existing], { itemId: existing.itemId, label: existing.label, knowledgeType: existing.knowledgeType, exerciseType: existing.exerciseType, wrongAnswer: "another error", correctAnswer: existing.correctAnswer }); expect(result).toHaveLength(1); expect(result[0].repeatedCount).toBe(existing.repeatedCount + 1); });
  it("migrates legacy scheduling and mistake fields", () => { const state = createInitialState(); const legacyMistakes = state.mistakes.map((item) => { const legacy: Partial<typeof item> = { ...item }; delete legacy.resolved; return legacy; }); const legacy = { ...state, grammarProgress: state.grammarProgress.map(({ review, ...item }) => ({ ...item, nextReview: review.nextReview })), mistakes: legacyMistakes }; const migrated = normalizeState(legacy); expect(migrated.grammarProgress[0].review.nextReview).toBe(state.grammarProgress[0].review.nextReview); expect(migrated.mistakes[0].resolved).toBe(false); });
  it("preserves valid placement diagnostics and drops malformed legacy placement", () => { const state = createInitialState(); const placement = scorePlacement([]); expect(normalizeState({ ...state, placement }).placement).toEqual(placement); expect(normalizeState({ ...state, placement: { broken: true } }).placement).toBeUndefined(); });
});
