import { currentUser } from "@/lib/auth/server";
import { issueEmailVerification } from "@/lib/auth/recovery";
import { assertSameOrigin, jsonError } from "@/lib/auth/request";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { sendVerificationEmail } from "@/lib/email/delivery";
import { logEvent } from "@/lib/observability/logger";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = consumeRateLimit(rateLimitKey(request, "email-verification-request"), 4);
  if (!limit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(limit.retryAfter) });
  try {
    const user = await currentUser(); if (!user) return jsonError("Authentication required.", 401);
    const token = await issueEmailVerification(user.id);
    const result = await sendVerificationEmail(user.email, token, request.url);
    return Response.json({ ok: true, message: result.status === "disabled" ? "Email delivery is not configured." : "Verification instructions were sent.", ...(result.developmentUrl ? { developmentVerificationUrl: result.developmentUrl } : {}) });
  } catch {
    logEvent("error", "email.verification_delivery_failed", { requestId: request.headers.get("x-request-id") });
    return jsonError("Verification email is temporarily unavailable.", 503);
  }
}
