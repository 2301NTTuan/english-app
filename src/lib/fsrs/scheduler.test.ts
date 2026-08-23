import { describe, expect, it } from "vitest";
import { scheduleReview } from "./scheduler";
import type { ReviewState } from "@/types/domain";

const state: ReviewState = { difficulty: 5, stability: 4, state: "review", lastReview: "2026-08-20T00:00:00.000Z", nextReview: "2026-08-23T00:00:00.000Z", scheduledDays: 3, elapsedDays: 3, reviewCount: 4, correctCount: 3, incorrectCount: 1, lapses: 1 };
describe("scheduleReview", () => {
  it("schedules easy later than good and hard", () => { const at = new Date("2026-08-23T00:00:00.000Z"); const hard = scheduleReview(state, "hard", at); const good = scheduleReview(state, "good", at); const easy = scheduleReview(state, "easy", at); expect(hard.nextReview < good.nextReview).toBe(true); expect(good.nextReview < easy.nextReview).toBe(true); });
  it("records a lapse and short interval for again", () => { const result = scheduleReview(state, "again", new Date("2026-08-23T00:00:00.000Z")); expect(result.lapses).toBe(2); expect(result.state).toBe("relearning"); expect(new Date(result.nextReview).getTime() - new Date(result.lastReview!).getTime()).toBeLessThan(60 * 60 * 1000); });
  it("uses desired retention to shorten intervals", () => { const at = new Date("2026-08-23T00:00:00.000Z"); const high = scheduleReview(state, "good", at, 0.95); const normal = scheduleReview(state, "good", at, 0.85); expect(high.nextReview < normal.nextReview).toBe(true); });
  it("records elapsed and scheduled interval metadata", () => { const result = scheduleReview(state, "good", new Date("2026-08-24T00:00:00.000Z")); expect(result.elapsedDays).toBe(4); expect(result.scheduledDays).toBeGreaterThanOrEqual(2); });
  it("preserves persisted memory across repeat reviews", () => { const first = scheduleReview(state, "good", new Date("2026-08-24T00:00:00.000Z")); const second = scheduleReview(first, "hard", new Date(first.nextReview)); expect(second.reviewCount).toBe(state.reviewCount + 2); expect(second.lastReview).toBe(first.nextReview); expect(second.stability).toBeGreaterThan(0); });
});
