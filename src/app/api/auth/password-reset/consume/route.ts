import { z } from "zod";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { passwordSchema } from "@/lib/auth/password";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { consumePasswordReset } from "@/lib/auth/recovery";
import { logEvent } from "@/lib/observability/logger";

const resetSchema = z.object({ token: z.string().min(32).max(256), password: passwordSchema, confirmation: z.string().max(128) })
  .refine((value) => value.password === value.confirmation, { path: ["confirmation"], message: "Passwords do not match." });

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = await consumeRateLimit(rateLimitKey(request, "password-reset-consume"), 8);
  if (!limit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(limit.retryAfter) });
  try {
    const parsed = resetSchema.safeParse(await readJson(request, 8_192));
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid password reset.", 400);
    if (!await consumePasswordReset(parsed.data.token, parsed.data.password)) return jsonError("This password-reset link is invalid or has expired.", 400);
    return Response.json({ ok: true });
  } catch (error) {
    const bodyError = bodyErrorResponse(error);
    if (bodyError) return bodyError;
    logEvent("error", "auth.password_reset_unavailable", { requestId: request.headers.get("x-request-id") });
    return jsonError("Password reset is temporarily unavailable.", 503);
  }
}
