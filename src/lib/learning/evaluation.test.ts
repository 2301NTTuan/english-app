import { describe, expect, it } from "vitest";
import { evaluateAnswer, ratingForAnswer } from "./evaluation";

describe("evaluateAnswer", () => {
  it("ignores harmless casing, spacing, and terminal punctuation", () => expect(evaluateAnswer("  I SAW her yesterday. ", "I saw her yesterday")).toBe(true));
  it("does not accept a genuinely different answer", () => expect(evaluateAnswer("have seen", "saw")).toBe(false));
});

describe("ratingForAnswer", () => {
  it("forces incorrect answers back into relearning", () => expect(ratingForAnswer(false, "easy")).toBe("again"));
  it("preserves the learner rating after a correct answer", () => expect(ratingForAnswer(true, "hard")).toBe("hard"));
});
