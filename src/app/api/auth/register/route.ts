import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { auditLogs, authSessions, learningPreferences, users, userStateSnapshots } from "@/db/schema";
import { createEmptyAccountState } from "@/lib/storage/app-repository";
import { hashPassword, normalizeEmail, registrationSchema } from "@/lib/auth/password";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { createSessionToken, hashSessionToken, SESSION_COOKIE, sessionCookieOptions, sessionExpiresAt } from "@/lib/auth/session";
import { logEvent } from "@/lib/observability/logger";
import { issueEmailVerification } from "@/lib/auth/recovery";
import { sendVerificationEmail } from "@/lib/email/delivery";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = await consumeRateLimit(rateLimitKey(request, "register"), 5);
  if (!limit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(limit.retryAfter) });
  try {
    const parsed = registrationSchema.safeParse(await readJson(request, 16_384));
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid registration details.", 400);
    const email = normalizeEmail(parsed.data.email);
    const passwordHash = await hashPassword(parsed.data.password);
    const token = createSessionToken();
    const userId = await getDb().transaction(async (tx) => {
      const [user] = await tx.insert(users).values({ name: parsed.data.name, email, passwordHash }).returning({ id: users.id });
      await tx.insert(learningPreferences).values({ userId: user.id });
      await tx.insert(userStateSnapshots).values({ userId: user.id, schemaVersion: 1, state: createEmptyAccountState() });
      await tx.insert(authSessions).values({ tokenHash: hashSessionToken(token), userId: user.id, expiresAt: sessionExpiresAt() });
      await tx.insert(auditLogs).values({ userId: user.id, action: "account.registered", entityType: "user", entityId: user.id });
      return user.id;
    });
    let developmentVerificationUrl: string | undefined;
    try {
      const verificationToken = await issueEmailVerification(userId);
      developmentVerificationUrl = (await sendVerificationEmail(email, verificationToken, request.url)).developmentUrl;
    } catch { logEvent("error", "email.verification_delivery_failed", { requestId: request.headers.get("x-request-id") }); }
    const response = NextResponse.json({ ok: true, ...(developmentVerificationUrl ? { developmentVerificationUrl } : {}) }, { status: 201 });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error) {
    const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError;
    if (typeof error === "object" && error && "code" in error && error.code === "23505") { logEvent("warn", "auth.registration_duplicate"); return jsonError("An account with that email already exists.", 409); }
    logEvent("error", "auth.registration_unavailable");
    return jsonError("Registration is temporarily unavailable.", 503);
  }
}
