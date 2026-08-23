import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { auditLogs, users } from "@/db/schema";
import { credentialsSchema, normalizeEmail, verifyPassword } from "@/lib/auth/password";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { createDatabaseSession } from "@/lib/auth/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { logEvent } from "@/lib/observability/logger";

const DUMMY_PASSWORD_HASH = "$2b$12$hHySbpbRtR9436UGn2PhyuDEV1kac/gRti0IdDqLnpPPvekCeBmTO";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = consumeRateLimit(rateLimitKey(request, "login"));
  if (!limit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(limit.retryAfter) });
  try {
    const parsed = credentialsSchema.safeParse(await readJson(request, 16_384));
    if (!parsed.success) return jsonError("Invalid email or password.", 401);
    const [user] = await getDb().select({ id: users.id, passwordHash: users.passwordHash }).from(users).where(eq(users.email, normalizeEmail(parsed.data.email))).limit(1);
    const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
    if (!user || !valid) { logEvent("warn", "auth.login_rejected"); return jsonError("Invalid email or password.", 401); }
    const token = await createDatabaseSession(user.id);
    await getDb().insert(auditLogs).values({ userId: user.id, action: "account.login", entityType: "session" });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error) { const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError; logEvent("error", "auth.login_unavailable"); return jsonError("Sign in is temporarily unavailable.", 503); }
}
