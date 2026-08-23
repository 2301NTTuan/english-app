import { beforeEach, describe, expect, it } from "vitest";
import { clearRateLimitsForTests, consumeRateLimit } from "./rate-limit";
describe("rate limiting", () => { beforeEach(clearRateLimitsForTests); it("blocks after the configured limit and resets after the window", () => { expect(consumeRateLimit("login:one", 2, 1000, 0).allowed).toBe(true); expect(consumeRateLimit("login:one", 2, 1000, 1).allowed).toBe(true); expect(consumeRateLimit("login:one", 2, 1000, 2).allowed).toBe(false); expect(consumeRateLimit("login:one", 2, 1000, 1000).allowed).toBe(true); }); });
