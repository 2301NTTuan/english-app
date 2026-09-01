import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/rate-limit", () => ({
  consumeRateLimit: vi.fn(async () => ({ allowed: true, retryAfter: 0 })),
  rateLimitKey: vi.fn(() => "test-rate-key"),
  rateLimitSubjectKey: vi.fn(() => "test-subject-key"),
}));
vi.mock("@/lib/auth/account", () => ({ registerAccount: vi.fn(), verifyCredentials: vi.fn(), prepareVerificationResend: vi.fn() }));
vi.mock("@/lib/auth/server", () => ({ createDatabaseSession: vi.fn() }));
vi.mock("@/lib/email/delivery", () => ({
  sendVerificationEmail: vi.fn(),
  emailDeliveryLogMetadata: vi.fn(() => ({ failureReason: "provider_rejected", provider: "resend", providerStatus: 403 })),
}));
vi.mock("@/db/client", () => ({ getDb: vi.fn(() => ({ insert: vi.fn(() => ({ values: vi.fn(async () => undefined) })) })) }));
vi.mock("@/lib/observability/logger", () => ({ logEvent: vi.fn() }));

import { prepareVerificationResend, registerAccount, verifyCredentials } from "@/lib/auth/account";
import { createDatabaseSession } from "@/lib/auth/server";
import { sendVerificationEmail } from "@/lib/email/delivery";
import { consumeRateLimit } from "@/lib/auth/rate-limit";
import { logEvent } from "@/lib/observability/logger";
import { POST as register } from "./register/route";
import { POST as login } from "./login/route";
import { POST as resendVerification } from "./email-verification/request/route";

const registerAccountMock = vi.mocked(registerAccount);
const prepareVerificationResendMock = vi.mocked(prepareVerificationResend);
const verifyCredentialsMock = vi.mocked(verifyCredentials);
const createDatabaseSessionMock = vi.mocked(createDatabaseSession);
const sendVerificationEmailMock = vi.mocked(sendVerificationEmail);
const consumeRateLimitMock = vi.mocked(consumeRateLimit);

function request(path: string, body: unknown) {
  return new Request(`https://app.test${path}`, { method: "POST", headers: { origin: "https://app.test", "content-type": "application/json" }, body: JSON.stringify(body) });
}

beforeEach(() => {
  vi.clearAllMocks();
  consumeRateLimitMock.mockResolvedValue({ allowed: true, retryAfter: 0 });
  registerAccountMock.mockResolvedValue({ userId: "user-1", email: "learner@example.test", verificationToken: "secret-verification-token" });
  prepareVerificationResendMock.mockResolvedValue({ email: "learner@example.test", token: "secret-resend-token" });
  sendVerificationEmailMock.mockResolvedValue({ status: "delivered" });
});

describe("registration route", () => {
  const body = { name: "Learner", email: "Learner@Example.test", password: "ValidPassword1234" };

  it("creates a verification-required account without a session cookie", async () => {
    const response = await register(request("/api/auth/register", body));
    expect(response.status).toBe(201);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(await response.json()).toEqual({
      ok: true,
      verificationRequired: true,
      verificationEmailSent: true,
      email: "learner@example.test",
      deliveryStatus: "sent",
    });
  });

  it("reports a known delivery failure without rolling back the account", async () => {
    sendVerificationEmailMock.mockResolvedValue({ status: "disabled" });
    const response = await register(request("/api/auth/register", body));
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ ok: true, code: "VERIFICATION_DELIVERY_FAILED", verificationRequired: true, verificationEmailSent: false, deliveryStatus: "failed" });
    expect(registerAccountMock).toHaveBeenCalledOnce();
  });

  it("reports provider rejection safely after account creation", async () => {
    sendVerificationEmailMock.mockRejectedValue(new Error("re_secret_key secret-verification-token provider detail"));
    const response = await register(request("/api/auth/register", body));
    expect(response.status).toBe(201);
    const payload = await response.json();
    expect(payload).toMatchObject({ code: "VERIFICATION_DELIVERY_FAILED", verificationEmailSent: false, deliveryStatus: "failed" });
    expect(JSON.stringify(payload)).not.toMatch(/re_secret_key|secret-verification-token|provider detail/);
    expect(JSON.stringify(vi.mocked(logEvent).mock.calls)).not.toMatch(/re_secret_key|secret-verification-token|provider detail/);
  });

  it("reports development verification without claiming an email was sent", async () => {
    sendVerificationEmailMock.mockResolvedValue({ status: "development", developmentUrl: "https://app.test/verify-email?token=local-token" });
    const response = await register(request("/api/auth/register", body));
    expect(await response.json()).toMatchObject({
      code: "VERIFICATION_DELIVERY_FAILED",
      verificationEmailSent: false,
      deliveryStatus: "development",
      developmentVerificationUrl: "https://app.test/verify-email?token=local-token",
    });
  });

  it("retains server-side password enforcement when client validation is bypassed", async () => {
    const response = await register(request("/api/auth/register", { ...body, password: "short", confirmation: "short" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "VALIDATION_ERROR", fieldErrors: { password: expect.any(Array) } });
    expect(registerAccountMock).not.toHaveBeenCalled();
  });

  it("handles a duplicate normalized email safely", async () => {
    registerAccountMock.mockRejectedValue({ cause: { code: "23505", constraint: "users_email_unique", detail: "sensitive database detail" } });
    const response = await register(request("/api/auth/register", body));
    expect(response.status).toBe(409);
    const payload = await response.json();
    expect(payload).toEqual({ error: "This email is already registered.", code: "EMAIL_ALREADY_REGISTERED" });
    expect(JSON.stringify(payload)).not.toContain("sensitive database detail");
  });

  it.each([
    [{ ...body, name: "" }, "name"],
    [{ ...body, email: "" }, "email"],
    [{ ...body, email: "not-an-email" }, "email"],
  ])("returns structured field validation for invalid registration input", async (invalidBody, field) => {
    const response = await register(request("/api/auth/register", invalidBody));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "VALIDATION_ERROR", fieldErrors: { [field]: expect.any(Array) } });
    expect(registerAccountMock).not.toHaveBeenCalled();
  });

  it("handles malformed and oversized JSON without exposing internals", async () => {
    const malformed = await register(new Request("https://app.test/api/auth/register", {
      method: "POST", headers: { origin: "https://app.test", "content-type": "application/json" }, body: "{not-json",
    }));
    expect(malformed.status).toBe(400);
    expect(await malformed.json()).toEqual({ error: "Request body is not valid JSON.", code: "VALIDATION_ERROR" });

    const oversized = await register(new Request("https://app.test/api/auth/register", {
      method: "POST", headers: { origin: "https://app.test", "content-type": "application/json", "content-length": "20000" }, body: JSON.stringify(body),
    }));
    expect(oversized.status).toBe(413);
    expect(await oversized.json()).toEqual({ error: "Request body is too large.", code: "VALIDATION_ERROR" });
  });

  it("returns a coded 429 and Retry-After only for an exhausted limit", async () => {
    consumeRateLimitMock.mockResolvedValue({ allowed: false, retryAfter: 37 });
    const response = await register(request("/api/auth/register", body));
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("37");
    expect(await response.json()).toEqual({ error: "Too many sign-up attempts. Please wait a moment and try again.", code: "RATE_LIMITED" });
  });

  it("returns service unavailable for rate-limit storage and unexpected database failures", async () => {
    consumeRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfter: 900, unavailable: true });
    const limiterFailure = await register(request("/api/auth/register", body));
    expect(limiterFailure.status).toBe(503);
    expect(await limiterFailure.json()).toEqual({ error: "Sign up is temporarily unavailable. Please try again later.", code: "SERVICE_UNAVAILABLE" });

    consumeRateLimitMock.mockResolvedValueOnce({ allowed: true, retryAfter: 0 });
    registerAccountMock.mockRejectedValueOnce({ code: "23505", constraint: "some_other_unique_constraint", detail: "raw database error" });
    const databaseFailure = await register(request("/api/auth/register", body));
    expect(databaseFailure.status).toBe(503);
    const payload = await databaseFailure.json();
    expect(payload).toEqual({ error: "Sign up is temporarily unavailable. Please try again later.", code: "SERVICE_UNAVAILABLE" });
    expect(JSON.stringify(payload)).not.toContain("raw database error");
  });
});

describe("verification resend route", () => {
  const generic = { ok: true, message: "If an unverified account exists for that email, we'll send a new verification link." };

  it("uses the same delivery adapter for an unverified account", async () => {
    const response = await resendVerification(request("/api/auth/email-verification/request", { email: " Learner@Example.test " }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(generic);
    expect(prepareVerificationResendMock).toHaveBeenCalledWith("learner@example.test");
    expect(sendVerificationEmailMock).toHaveBeenCalledWith("learner@example.test", "secret-resend-token", "https://app.test/api/auth/email-verification/request");
  });

  it("logs safe provider failure while preserving the enumeration-safe response", async () => {
    sendVerificationEmailMock.mockRejectedValue(new Error("re_secret_key secret-resend-token provider detail"));
    const response = await resendVerification(request("/api/auth/email-verification/request", { email: "learner@example.test" }));
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload).toEqual(generic);
    expect(JSON.stringify(payload)).not.toMatch(/re_secret_key|secret-resend-token|provider detail/);
    expect(JSON.stringify(vi.mocked(logEvent).mock.calls)).not.toMatch(/re_secret_key|secret-resend-token|provider detail/);
    expect(vi.mocked(logEvent)).toHaveBeenCalledWith("error", "email.verification_resend_failed", expect.objectContaining({ failureReason: "provider_rejected", providerStatus: 403 }));
  });

  it("does not reveal whether the requested account exists", async () => {
    prepareVerificationResendMock.mockResolvedValue(null);
    const response = await resendVerification(request("/api/auth/email-verification/request", { email: "unknown@example.test" }));
    expect(await response.json()).toEqual(generic);
    expect(sendVerificationEmailMock).not.toHaveBeenCalled();
  });
});

describe("login route", () => {
  const credentials = { email: "learner@example.test", password: "ValidPassword1234" };

  it("returns the same generic failure for invalid credentials without a session", async () => {
    verifyCredentialsMock.mockResolvedValue({ status: "invalid" });
    const response = await login(request("/api/auth/login", credentials));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Invalid email or password." });
    expect(createDatabaseSessionMock).not.toHaveBeenCalled();
  });

  it("returns EMAIL_NOT_VERIFIED only after valid credentials and creates no session", async () => {
    verifyCredentialsMock.mockResolvedValue({ status: "unverified", userId: "user-1" });
    const response = await login(request("/api/auth/login", credentials));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Your email address hasn't been verified yet.", code: "EMAIL_NOT_VERIFIED" });
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(createDatabaseSessionMock).not.toHaveBeenCalled();
  });

  it("creates a secure session only for a verified account", async () => {
    verifyCredentialsMock.mockResolvedValue({ status: "verified", userId: "user-1" });
    createDatabaseSessionMock.mockResolvedValue("raw-session-token");
    const response = await login(request("/api/auth/login", credentials));
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("english_mastery_session=raw-session-token");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=lax");
    expect(createDatabaseSessionMock).toHaveBeenCalledWith("user-1");
    expect(vi.mocked(logEvent).mock.calls.flat().join(" ")).not.toContain(credentials.password);
  });
});
