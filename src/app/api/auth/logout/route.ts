import { NextResponse } from "next/server";
import { assertSameOrigin, jsonError } from "@/lib/auth/request";
import { deleteCurrentSession } from "@/lib/auth/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try { await deleteCurrentSession(); } catch { /* A local cookie must still be cleared. */ }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
