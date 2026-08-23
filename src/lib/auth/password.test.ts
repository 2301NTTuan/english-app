import { describe, expect, it } from "vitest";
import { hashPassword, normalizeEmail, passwordSchema, verifyPassword } from "./password";

describe("credential primitives", () => {
  it("normalizes email without altering an internal address", () => expect(normalizeEmail("  Learner@Example.COM ")).toBe("learner@example.com"));
  it("rejects short or low-complexity passwords", () => { expect(passwordSchema.safeParse("short").success).toBe(false); expect(passwordSchema.safeParse("alllowercase1234").success).toBe(false); });
  it("hashes and verifies a strong password", async () => { const value = "Correct-horse-42"; const digest = await hashPassword(value); expect(digest).not.toContain(value); expect(await verifyPassword(value, digest)).toBe(true); expect(await verifyPassword("Wrong-password-42", digest)).toBe(false); });
});
