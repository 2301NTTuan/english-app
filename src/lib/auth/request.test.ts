import { describe, expect, it } from "vitest";
import { assertSameOrigin, bodyErrorResponse, readJson } from "./request";

describe("API request boundary", () => {
  it("accepts same-origin requests and rejects cross-origin requests", () => {
    expect(assertSameOrigin(new Request("https://app.test/api", { headers: { origin: "https://app.test" } }))).toBe(true);
    expect(assertSameOrigin(new Request("https://app.test/api", { headers: { origin: "https://evil.test" } }))).toBe(false);
  });
  it("uses the incoming Host when the runtime reconstructs an internal request URL", () => {
    const request = new Request("http://localhost:3100/api/auth/register", {
      headers: { host: "127.0.0.1:3100", origin: "http://127.0.0.1:3100" },
    });
    expect(assertSameOrigin(request)).toBe(true);
  });
  it("parses bounded JSON and rejects malformed or oversized input", async () => { await expect(readJson(new Request("https://app.test/api", { method: "POST", headers: { "content-type": "application/json" }, body: "{\"ok\":true}" }))).resolves.toEqual({ ok: true }); const malformed = readJson(new Request("https://app.test/api", { method: "POST", headers: { "content-type": "application/json" }, body: "{" })); await expect(malformed).rejects.toThrow("INVALID_JSON"); const oversized = readJson(new Request("https://app.test/api", { method: "POST", headers: { "content-type": "application/json" }, body: "{\"value\":\"large\"}" }), 8); await expect(oversized).rejects.toThrow("TOO_LARGE"); });
  it("maps body failures to safe HTTP statuses", () => { expect(bodyErrorResponse(new Error("INVALID_JSON"))?.status).toBe(400); expect(bodyErrorResponse(new Error("TOO_LARGE"))?.status).toBe(413); expect(bodyErrorResponse(new Error("CONTENT_TYPE"))?.status).toBe(415); });
});
