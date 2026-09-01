import { z } from "zod";
import { consumeEmailVerification } from "@/lib/auth/recovery";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { logEvent } from "@/lib/observability/logger";

const schema = z.object({ token: z.string().min(32).max(256) });

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = await consumeRateLimit(rateLimitKey(request, "email-verification-consume"), 8);
  if (!limit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(limit.retryAfter) });
  try {
    const parsed = schema.safeParse(await readJson(request, 2_048));
    if (!parsed.success) return jsonError("This verification link is invalid or has expired.", 400);
    const result = await consumeEmailVerification(parsed.data.token);
    if (result === "invalid") return Response.json({ error: "This verification link is invalid.", code: "INVALID_TOKEN" }, { status: 400 });
    if (result === "expired") return Response.json({ error: "This verification link has expired.", code: "EXPIRED_TOKEN" }, { status: 400 });
    if (result === "already-verified") return Response.json({ ok: true, status: "already-verified" });
    return Response.json({ ok: true, status: "verified" });
  } catch (error) {
    const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError;
    logEvent("error", "auth.email_verification_unavailable", { requestId: request.headers.get("x-request-id") });
    return jsonError("Email verification is temporarily unavailable.", 503);
  }
}
