import { describe, expect, it } from "vitest";
import { calculateOverallMastery, updateMastery, weakestDimension } from "./mastery";

describe("mastery", () => {
  it("weights active recall and context more heavily", () => expect(calculateOverallMastery({ recognition: 100, recall: 50, context: 50, spelling: 100 })).toBe(70));
  it("lowers a failed dimension and recalculates overall", () => { const result = updateMastery({ recognition: 80, recall: 80, context: 80, spelling: 80, overall: 80 }, "recall", false); expect(result.recall).toBeLessThan(80); expect(result.overall).toBeLessThan(80); });
  it("finds the weakest dimension", () => expect(weakestDimension({ recognition: 90, recall: 52, context: 70, spelling: 65, overall: 69 })).toBe("recall"));
});
