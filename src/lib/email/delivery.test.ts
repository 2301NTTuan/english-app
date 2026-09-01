import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

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
    await expect(sendVerificationEmail("learner@example.test", "secret-token", "https://untrusted.test/request")).rejects.toMatchObject({ reason: "development_forbidden", provider: "development" });
  });

  it("requires trusted production URL and Resend credentials", async () => {
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("EMAIL_DELIVERY_PROVIDER", "resend"); vi.stubEnv("APP_BASE_URL", ""); vi.stubEnv("RESEND_API_KEY", ""); vi.stubEnv("EMAIL_FROM", "");
    const { sendVerificationEmail } = await import("./delivery");
    await expect(sendVerificationEmail("learner@example.test", "secret-token", "https://untrusted.test/request")).rejects.toMatchObject({ reason: "invalid_app_base_url", provider: "resend" });
    vi.stubEnv("APP_BASE_URL", "https://learn.example.test");
    await expect(sendVerificationEmail("learner@example.test", "secret-token", "https://untrusted.test/request")).rejects.toMatchObject({ reason: "missing_config", provider: "resend" });
  });

  it("calls Resend with the configured sender, recipient, verification URL, and required headers", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("EMAIL_DELIVERY_PROVIDER", "resend");
    vi.stubEnv("APP_BASE_URL", "https://learn.example.test");
    vi.stubEnv("RESEND_API_KEY", "re_test_key_value");
    vi.stubEnv("EMAIL_FROM", "English Mastery <verify@updates.example.test>");
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      void input; void init;
      return new Response(JSON.stringify({ id: "provider-email-id" }), { status: 200, headers: { "Content-Type": "application/json" } });
    });
    vi.stubGlobal("fetch", fetchMock);
    const { sendVerificationEmail } = await import("./delivery");

    await expect(sendVerificationEmail("recipient@example.test", "verification-token-value", "https://untrusted.test/request"))
      .resolves.toEqual({ status: "delivered" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init?.headers).toMatchObject({
      Authorization: "Bearer re_test_key_value",
      "Content-Type": "application/json",
      "User-Agent": "english-mastery/0.1",
    });
    expect(JSON.parse(String(init?.body))).toMatchObject({
      from: "English Mastery <verify@updates.example.test>",
      to: ["recipient@example.test"],
      subject: "Verify your English Mastery email",
      text: expect.stringContaining("https://learn.example.test/verify-email?token=verification-token-value"),
    });
  });

  it("surfaces provider rejection as safe structured metadata without secret or token leakage", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("EMAIL_DELIVERY_PROVIDER", "resend");
    vi.stubEnv("APP_BASE_URL", "https://learn.example.test");
    vi.stubEnv("RESEND_API_KEY", "re_super_secret_value");
    vi.stubEnv("EMAIL_FROM", "English Mastery <verify@updates.example.test>");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      name: "validation_error",
      message: "The secret verification-token-value was rejected.",
    }), { status: 403, headers: { "Content-Type": "application/json" } })));
    const { emailDeliveryLogMetadata, sendVerificationEmail } = await import("./delivery");

    const error = await sendVerificationEmail("recipient@example.test", "verification-token-value", "https://untrusted.test/request").catch((caught) => caught);
    expect(error).toMatchObject({ reason: "provider_rejected", provider: "resend", providerStatus: 403, providerErrorType: "validation_error" });
    expect(error.message).toBe("Email delivery failed");
    const metadata = JSON.stringify(emailDeliveryLogMetadata(error));
    expect(metadata).not.toContain("re_super_secret_value");
    expect(metadata).not.toContain("verification-token-value");
    expect(metadata).not.toContain("recipient@example.test");
  });

  it("rejects malformed success responses instead of claiming delivery", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("EMAIL_DELIVERY_PROVIDER", "resend");
    vi.stubEnv("APP_BASE_URL", "https://learn.example.test");
    vi.stubEnv("RESEND_API_KEY", "re_test_key_value");
    vi.stubEnv("EMAIL_FROM", "verify@updates.example.test");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } })));
    const { sendVerificationEmail } = await import("./delivery");
    await expect(sendVerificationEmail("recipient@example.test", "verification-token-value", "https://untrusted.test/request"))
      .rejects.toMatchObject({ reason: "invalid_provider_response", providerStatus: 200 });
  });
});
