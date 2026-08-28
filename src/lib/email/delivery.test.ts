import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const originalEnvironment = { ...process.env };

afterEach(() => { process.env = { ...originalEnvironment }; vi.restoreAllMocks(); });

describe("outbound email delivery", () => {
  it("returns local-only links through the explicit development provider", async () => {
    process.env.NODE_ENV = "test"; process.env.EMAIL_DELIVERY_PROVIDER = "development"; delete process.env.APP_BASE_URL;
    const { sendPasswordResetEmail, sendVerificationEmail } = await import("./delivery");
    const reset = await sendPasswordResetEmail("learner@example.test", "reset-token-value", "http://localhost:3000/api/auth/password-reset/request");
    const verification = await sendVerificationEmail("learner@example.test", "verification-token-value", "http://localhost:3000/api/auth/register");
    expect(reset).toEqual({ status: "development", developmentUrl: "http://localhost:3000/reset-password?token=reset-token-value" });
    expect(verification).toEqual({ status: "development", developmentUrl: "http://localhost:3000/verify-email?token=verification-token-value" });
  });

  it("does not expose a link when delivery is disabled", async () => {
    process.env.NODE_ENV = "production"; process.env.EMAIL_DELIVERY_PROVIDER = "disabled"; delete process.env.APP_BASE_URL;
    const { sendPasswordResetEmail } = await import("./delivery");
    await expect(sendPasswordResetEmail("learner@example.test", "secret-token", "http://localhost:3000/request")).resolves.toEqual({ status: "disabled" });
  });

  it("forbids development delivery in production", async () => {
    process.env.NODE_ENV = "production"; process.env.EMAIL_DELIVERY_PROVIDER = "development"; process.env.APP_BASE_URL = "https://learn.example.test";
    const { sendVerificationEmail } = await import("./delivery");
    await expect(sendVerificationEmail("learner@example.test", "secret-token", "https://untrusted.test/request")).rejects.toThrow("forbidden in production");
  });
});
