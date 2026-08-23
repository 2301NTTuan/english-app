import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { developmentResetUrl, issuePasswordReset } from "@/lib/auth/recovery";
import { logEvent } from "@/lib/observability/logger";

const requestSchema = z.object({ email: z.string().trim().email().max(254) });
const genericMessage = "If an account matches that email, password-reset instructions are available through the configured delivery channel.";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = consumeRateLimit(rateLimitKey(request, "password-reset-request"), 5);
  if (!limit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(limit.retryAfter) });
  try {
    const parsed = requestSchema.safeParse(await readJson(request, 4_096));
    if (!parsed.success) return jsonError("Enter a valid email address.", 400);
    const token = await issuePasswordReset(parsed.data.email);
    const resetUrl = developmentResetUrl(request.url, token);
    return NextResponse.json({ ok: true, message: genericMessage, ...(resetUrl ? { developmentResetUrl: resetUrl } : {}) });
  } catch (error) {
    const bodyError = bodyErrorResponse(error);
    if (bodyError) return bodyError;
    logEvent("error", "auth.password_reset_request_unavailable", { requestId: request.headers.get("x-request-id") });
    return jsonError("Password reset is temporarily unavailable.", 503);
  }
}
