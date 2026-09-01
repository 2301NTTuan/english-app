import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("outbound email delivery", () => {
  it("returns local-only links through the explicit development provider", async () => {
    vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("EMAIL_DELIVERY_PROVIDER", "development"); vi.stubEnv("APP_BASE_URL", "");
    const { sendPasswordResetEmail, sendVerificationEmail } = await import("./delivery");
    const reset = await sendPasswordResetEmail("learner@example.test", "reset-token-value", "http://localhost:3000/api/auth/password-reset/request");
    const verification = await sendVerificationEmail("learner@example.test", "verification-token-value", "http://localhost:3000/api/auth/register");
    expect(reset).toEqual({ status: "development", developmentUrl: "http://localhost:3000/reset-password?token=reset-token-value" });
    expect(verification).toEqual({ status: "development", developmentUrl: "http://localhost:3000/verify-email?token=verification-token-value" });
  });

  it("uses the trusted application base URL instead of request headers", async () => {
    vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("EMAIL_DELIVERY_PROVIDER", "development"); vi.stubEnv("APP_BASE_URL", "https://learn.example.test/base");
    const { sendVerificationEmail } = await import("./delivery");
    await expect(sendVerificationEmail("learner@example.test", "secret-token", "https://attacker.example/request")).resolves.toEqual({
      status: "development",
      developmentUrl: "https://learn.example.test/verify-email?token=secret-token",
    });
  });

  it("does not expose a link when delivery is disabled", async () => {
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("EMAIL_DELIVERY_PROVIDER", "disabled"); vi.stubEnv("APP_BASE_URL", "");
    const { sendPasswordResetEmail } = await import("./delivery");
    await expect(sendPasswordResetEmail("learner@example.test", "secret-token", "http://localhost:3000/request")).resolves.toEqual({ status: "disabled" });
  });

  it("forbids development delivery in production", async () => {
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("EMAIL_DELIVERY_PROVIDER", "development"); vi.stubEnv("APP_BASE_URL", "https://learn.example.test");
    const { sendVerificationEmail } = await import("./delivery");
    await expect(sendVerificationEmail("learner@example.test", "secret-token", "https://untrusted.test/request")).rejects.toThrow("forbidden in production");
  });

  it("requires trusted production URL and Resend credentials", async () => {
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("EMAIL_DELIVERY_PROVIDER", "resend"); vi.stubEnv("APP_BASE_URL", ""); vi.stubEnv("RESEND_API_KEY", ""); vi.stubEnv("EMAIL_FROM", "");
    const { sendVerificationEmail } = await import("./delivery");
    await expect(sendVerificationEmail("learner@example.test", "secret-token", "https://untrusted.test/request")).rejects.toThrow("APP_BASE_URL");
    vi.stubEnv("APP_BASE_URL", "https://learn.example.test");
    await expect(sendVerificationEmail("learner@example.test", "secret-token", "https://untrusted.test/request")).rejects.toThrow("RESEND_API_KEY and EMAIL_FROM");
  });
});
