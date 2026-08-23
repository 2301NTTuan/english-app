import { describe, expect, it } from "vitest";
import { createEmptyAccountState, createInitialState } from "@/lib/storage/app-repository";
import { appStateSchema } from "./app-state";

describe("cloud state validation", () => {
  it("accepts canonical demo and empty account states", () => {
    expect(appStateSchema.safeParse(createInitialState()).success).toBe(true);
    expect(appStateSchema.safeParse(createEmptyAccountState()).success).toBe(true);
    expect(createEmptyAccountState().activities).toHaveLength(0);
  });

  it("upgrades a valid three-domain placement snapshot", () => {
    const state = createEmptyAccountState() as unknown as Record<string, unknown>;
    state.placement = {
      completedAt: "2026-08-23T00:00:00.000Z", estimatedLevel: "A2",
      dimensionScores: { vocabulary: 50, grammar: 50, context: 50 }, topicScores: {}, strongAreas: [], weakAreas: [], answers: [],
    };
    const parsed = appStateSchema.safeParse(state);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.placement?.dimensionScores.reading).toBe(0);
  });

  it("rejects structurally invalid or out-of-range imports", () => {
    expect(appStateSchema.safeParse({ settings: {} }).success).toBe(false);
    const state = createInitialState(); state.settings.desiredRetention = 10;
    expect(appStateSchema.safeParse(state).success).toBe(false);
  });
});
