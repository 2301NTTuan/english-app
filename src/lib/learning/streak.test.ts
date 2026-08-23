import { describe, expect, it } from "vitest";
import { calculateStreak } from "./streak";
import type { Activity } from "@/types/domain";

const activity = (date: string): Activity => ({ id: date, date, label: "Study", correct: 1, total: 1 });
describe("calculateStreak", () => {
  it("counts consecutive unique study days including today", () => expect(calculateStreak([activity("2026-08-23T08:00:00"), activity("2026-08-22T08:00:00"), activity("2026-08-22T12:00:00"), activity("2026-08-21T08:00:00")], new Date("2026-08-23T16:00:00"))).toBe(3));
  it("allows the current day to be unfinished", () => expect(calculateStreak([activity("2026-08-22T08:00:00"), activity("2026-08-21T08:00:00")], new Date("2026-08-23T10:00:00"))).toBe(2));
  it("returns zero when the streak is broken", () => expect(calculateStreak([activity("2026-08-20T08:00:00")], new Date("2026-08-23T10:00:00"))).toBe(0));
});
