import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { auditLogs } from "@/db/schema";
import { credentialsSchema } from "@/lib/auth/password";
import { consumeRateLimit, rateLimitKey } from "@/lib/auth/rate-limit";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { createDatabaseSession } from "@/lib/auth/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { logEvent } from "@/lib/observability/logger";
import { verifyCredentials } from "@/lib/auth/account";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  const limit = await consumeRateLimit(rateLimitKey(request, "login"));
  if (!limit.allowed) return jsonError("Too many attempts. Try again later.", 429, { "Retry-After": String(limit.retryAfter) });
  try {
    const parsed = credentialsSchema.safeParse(await readJson(request, 16_384));
    if (!parsed.success) return jsonError("Invalid email or password.", 401);
    const credentials = await verifyCredentials(parsed.data.email, parsed.data.password);
    if (credentials.status === "invalid") { logEvent("warn", "auth.login_rejected"); return jsonError("Invalid email or password.", 401); }
    if (credentials.status === "unverified") {
      logEvent("info", "auth.login_verification_required", { userId: credentials.userId });
      return NextResponse.json({ error: "Your email address hasn't been verified yet.", code: "EMAIL_NOT_VERIFIED" }, { status: 403 });
    }
    const token = await createDatabaseSession(credentials.userId);
    await getDb().insert(auditLogs).values({ userId: credentials.userId, action: "account.login", entityType: "session" });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error) { const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError; logEvent("error", "auth.login_unavailable"); return jsonError("Sign in is temporarily unavailable.", 503); }
}
