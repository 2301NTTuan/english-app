import { describe, expect, it } from "vitest";
import { prioritizeMistakes } from "./mistakes";
import type { MistakeRecord } from "@/types/domain";

const mistake = (id: string, repeatedCount: number, resolved = false): MistakeRecord => ({ id, itemId: id, label: id, knowledgeType: "grammar", exerciseType: "fill-blank", wrongAnswer: "x", correctAnswer: "y", timestamp: "2026-08-23T00:00:00.000Z", repeatedCount, resolved });
describe("prioritizeMistakes", () => {
  it("places recurring active errors first and excludes resolved errors", () => expect(prioritizeMistakes([mistake("low", 2), mistake("done", 10, true), mistake("high", 5)]).map((item) => item.id)).toEqual(["high", "low"]));
});
