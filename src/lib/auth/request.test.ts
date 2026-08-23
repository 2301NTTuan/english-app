import { describe, expect, it } from "vitest";
import { assertSameOrigin, bodyErrorResponse, readJson } from "./request";

describe("API request boundary", () => {
  it("accepts same-origin requests and rejects cross-origin requests", () => { expect(assertSameOrigin(new Request("https://app.test/api", { headers: { origin: "https://app.test" } }))).toBe(true); expect(assertSameOrigin(new Request("https://app.test/api", { headers: { origin: "https://evil.test" } }))).toBe(false); });
  it("parses bounded JSON and identifies malformed input", async () => { await expect(readJson(new Request("https://app.test/api", { method: "POST", headers: { "content-type": "application/json" }, body: "{\"ok\":true}" }))).resolves.toEqual({ ok: true }); const malformed = readJson(new Request("https://app.test/api", { method: "POST", headers: { "content-type": "application/json" }, body: "{" })); await expect(malformed).rejects.toThrow("INVALID_JSON"); });
  it("maps body failures to safe HTTP statuses", () => { expect(bodyErrorResponse(new Error("INVALID_JSON"))?.status).toBe(400); expect(bodyErrorResponse(new Error("TOO_LARGE"))?.status).toBe(413); expect(bodyErrorResponse(new Error("CONTENT_TYPE"))?.status).toBe(415); });
});
