import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { clearRateLimitsForTests, consumeRateLimit, rateLimitKey, rateLimitSubjectKey } from "./rate-limit";

describe("rate limiting", () => {
  beforeEach(() => { process.env.RATE_LIMIT_BACKEND = "memory"; delete process.env.TRUST_PROXY; clearRateLimitsForTests(); });
  afterEach(() => { vi.unstubAllEnvs(); delete process.env.RATE_LIMIT_BACKEND; delete process.env.TRUST_PROXY; });

  it("blocks after the configured limit and resets after the window", async () => {
    expect((await consumeRateLimit("login:one", 2, 1000, 0)).allowed).toBe(true);
    expect((await consumeRateLimit("login:one", 2, 1000, 1)).allowed).toBe(true);
    expect((await consumeRateLimit("login:one", 2, 1000, 2)).allowed).toBe(false);
    expect((await consumeRateLimit("login:one", 2, 1000, 1000)).allowed).toBe(true);
  });

  it("ignores spoofable forwarding headers until the proxy is trusted", () => {
    const request = new Request("http://localhost/login", { headers: { "x-forwarded-for": "203.0.113.8", "x-real-ip": "203.0.113.9" } });
    expect(rateLimitKey(request, "login")).toBe("login:untrusted-client");
    process.env.TRUST_PROXY = "true";
    expect(rateLimitKey(request, "login")).toBe("login:203.0.113.8");
  });

  it("creates stable per-account buckets without retaining the email address", () => {
    const key = rateLimitSubjectKey("resend", " Learner@Example.COM ");
    expect(key).toBe(rateLimitSubjectKey("resend", "learner@example.com"));
    expect(key).not.toContain("learner@example.com");
  });

  it("refuses the process-local backend in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await expect(consumeRateLimit("login:production", 8, 60_000)).resolves.toEqual({ allowed: false, retryAfter: 60, unavailable: true });
  });
});
