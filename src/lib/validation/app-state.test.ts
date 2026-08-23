import { describe, expect, it } from "vitest";
import { createEmptyAccountState, createInitialState } from "@/lib/storage/app-repository";
import { appStateSchema } from "./app-state";
describe("cloud state validation", () => { it("accepts canonical demo and empty account states", () => { expect(appStateSchema.safeParse(createInitialState()).success).toBe(true); expect(appStateSchema.safeParse(createEmptyAccountState()).success).toBe(true); expect(createEmptyAccountState().activities).toHaveLength(0); }); it("rejects structurally invalid or out-of-range imports", () => { expect(appStateSchema.safeParse({ settings: {} }).success).toBe(false); const state = createInitialState(); state.settings.desiredRetention = 10; expect(appStateSchema.safeParse(state).success).toBe(false); }); });
