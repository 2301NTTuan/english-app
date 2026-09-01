import { describe, expect, it } from "vitest";
import { createSessionToken, hashSessionToken, sessionCookieOptions, SESSION_TTL_SECONDS } from "./session";
describe("session primitives", () => {
  it("creates high-entropy opaque tokens and stores only deterministic hashes", () => { const first = createSessionToken(); const second = createSessionToken(); expect(first).not.toBe(second); expect(first.length).toBeGreaterThan(40); expect(hashSessionToken(first)).toHaveLength(64); expect(hashSessionToken(first)).toBe(hashSessionToken(first)); expect(hashSessionToken(first)).not.toContain(first); });
  it("uses bounded HttpOnly same-site cookies", () => expect(sessionCookieOptions).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS }));
});
