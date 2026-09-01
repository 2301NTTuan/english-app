import { after, NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { verifiedUserForSessionToken } from "@/lib/auth/server";
import { logEvent } from "@/lib/observability/logger";

const publicPaths = new Set(["/login", "/register", "/privacy", "/terms"]);
export async function proxy(request: NextRequest) {
  const startedAt = performance.now();
  const incomingRequestId = request.headers.get("x-request-id");
  const requestId = incomingRequestId && /^[a-zA-Z0-9_-]{8,64}$/.test(incomingRequestId) ? incomingRequestId : crypto.randomUUID();
  const path = request.nextUrl.pathname;
  after(() => {
    const durationMs = Math.round(performance.now() - startedAt);
    const slowThreshold = Number(process.env.SLOW_REQUEST_MS ?? 1_000);
    logEvent(durationMs >= slowThreshold ? "warn" : "info", durationMs >= slowThreshold ? "request.slow" : "request.completed", { requestId, method: request.method, path, durationMs });
  });
  const headers = new Headers(request.headers); headers.set("x-request-id", requestId);
  if (path.startsWith("/api/")) {
    const response = NextResponse.next({ request: { headers } }); response.headers.set("x-request-id", requestId); return response;
  }
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  let verifiedSession = false;
  if (sessionToken && !publicPaths.has(path)) {
    try { verifiedSession = Boolean(await verifiedUserForSessionToken(sessionToken)); }
    catch { logEvent("error", "auth.route_gate_unavailable", { requestId, path }); }
  }
  if (!verifiedSession && !publicPaths.has(path)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${path}${request.nextUrl.search}`);
    const response = NextResponse.redirect(login);
    if (sessionToken) response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
    response.headers.set("x-request-id", requestId); return response;
  }
  const response = NextResponse.next({ request: { headers } }); response.headers.set("x-request-id", requestId); return response;
}

export const config = { matcher: ["/", "/api/:path*", "/learn/:path*", "/vocabulary/:path*", "/grammar/:path*", "/expressions/:path*", "/review/:path*", "/mistakes/:path*", "/path/:path*", "/placement/:path*", "/progress/:path*", "/settings/:path*"] };
