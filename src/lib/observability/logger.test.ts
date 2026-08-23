import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("structured logger", () => {
  afterEach(() => vi.restoreAllMocks());

  it("keeps request correlation but removes sensitive fields", async () => {
    const output = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { logEvent } = await import("./logger");
    logEvent("error", "request.failed", { requestId: "request-123", password: "Password123", sessionToken: "session-secret", email: "learner@test.invalid" });
    expect(output).toHaveBeenCalledOnce();
    const record = JSON.parse(String(output.mock.calls[0][0])) as Record<string, unknown>;
    expect(record).toMatchObject({ level: "error", event: "request.failed", requestId: "request-123" });
    expect(JSON.stringify(record)).not.toContain("Password123");
    expect(JSON.stringify(record)).not.toContain("session-secret");
    expect(JSON.stringify(record)).not.toContain("learner@test.invalid");
  });
});
