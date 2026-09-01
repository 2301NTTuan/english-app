import { z } from "zod";
import { prepareVerificationResend } from "@/lib/auth/account";
import { normalizeEmail } from "@/lib/auth/password";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { consumeRateLimit, rateLimitKey, rateLimitSubjectKey } from "@/lib/auth/rate-limit";
import { emailDeliveryLogMetadata, sendVerificationEmail } from "@/lib/email/delivery";
import { logEvent } from "@/lib/observability/logger";

const schema = z.object({ email: z.string().trim().email().max(254) });
const genericMessage = "If an unverified account exists for that email, we'll send a new verification link.";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = await consumeRateLimit(rateLimitKey(request, "email-verification-request"), 4);
  if (limit.unavailable) return jsonError("Verification request is temporarily unavailable.", 503, undefined, { code: "SERVICE_UNAVAILABLE" });
  if (!limit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(limit.retryAfter) }, { code: "RATE_LIMITED" });
  try {
    const parsed = schema.safeParse(await readJson(request, 4_096));
    if (!parsed.success) return jsonError("Enter a valid email address.", 400, undefined, { code: "VALIDATION_ERROR" });
    const email = normalizeEmail(parsed.data.email);
    const subjectLimit = await consumeRateLimit(rateLimitSubjectKey("email-verification-request", email), 3, 15 * 60_000);
    if (subjectLimit.unavailable) return jsonError("Verification request is temporarily unavailable.", 503, undefined, { code: "SERVICE_UNAVAILABLE" });
    if (!subjectLimit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(subjectLimit.retryAfter) }, { code: "RATE_LIMITED" });
    const candidate = await prepareVerificationResend(email);
    let developmentVerificationUrl: string | undefined;
    if (candidate) {
      try {
        const delivery = await sendVerificationEmail(candidate.email, candidate.token, request.url);
        developmentVerificationUrl = delivery.developmentUrl;
        if (delivery.status === "disabled") logEvent("warn", "email.verification_resend_disabled", { requestId: request.headers.get("x-request-id"), provider: "disabled" });
      } catch (error) {
        logEvent("error", "email.verification_resend_failed", { requestId: request.headers.get("x-request-id"), ...emailDeliveryLogMetadata(error) });
      }
    }
    return Response.json({ ok: true, message: genericMessage, ...(developmentVerificationUrl ? { developmentVerificationUrl } : {}) });
  } catch (error) {
    const bodyError = bodyErrorResponse(error, "VALIDATION_ERROR"); if (bodyError) return bodyError;
    logEvent("error", "auth.email_verification_request_unavailable", { requestId: request.headers.get("x-request-id") });
    return jsonError("Verification request is temporarily unavailable.", 503, undefined, { code: "SERVICE_UNAVAILABLE" });
  }
}
