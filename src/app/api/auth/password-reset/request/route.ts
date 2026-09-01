import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { issuePasswordReset } from "@/lib/auth/recovery";
import { sendPasswordResetEmail } from "@/lib/email/delivery";
import { logEvent } from "@/lib/observability/logger";

const requestSchema = z.object({ email: z.string().trim().email().max(254) });
const genericMessage = "If an account exists for that email, we'll send reset instructions.";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = await consumeRateLimit(rateLimitKey(request, "password-reset-request"), 5);
  if (!limit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(limit.retryAfter) });
  try {
    const parsed = requestSchema.safeParse(await readJson(request, 4_096));
    if (!parsed.success) return jsonError("Enter a valid email address.", 400);
    const token = await issuePasswordReset(parsed.data.email);
    let developmentResetUrl: string | undefined;
    if (token) {
      try { developmentResetUrl = (await sendPasswordResetEmail(parsed.data.email, token, request.url)).developmentUrl; }
      catch { logEvent("error", "email.password_reset_delivery_failed", { requestId: request.headers.get("x-request-id") }); }
    }
    return NextResponse.json({ ok: true, message: genericMessage, ...(developmentResetUrl ? { developmentResetUrl } : {}) });
  } catch (error) {
    const bodyError = bodyErrorResponse(error);
    if (bodyError) return bodyError;
    logEvent("error", "auth.password_reset_request_unavailable", { requestId: request.headers.get("x-request-id") });
    return jsonError("Password reset is temporarily unavailable.", 503);
  }
}
