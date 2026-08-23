import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

const publicPaths = new Set(["/login", "/register", "/privacy", "/terms"]);
export function proxy(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (!hasSessionCookie && !publicPaths.has(request.nextUrl.pathname)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    const response = NextResponse.redirect(login); response.headers.set("x-request-id", requestId); return response;
  }
  const headers = new Headers(request.headers); headers.set("x-request-id", requestId);
  const response = NextResponse.next({ request: { headers } }); response.headers.set("x-request-id", requestId); return response;
}

export const config = { matcher: ["/", "/learn/:path*", "/vocabulary/:path*", "/grammar/:path*", "/expressions/:path*", "/review/:path*", "/mistakes/:path*", "/path/:path*", "/placement/:path*", "/progress/:path*", "/settings/:path*"] };
