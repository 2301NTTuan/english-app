import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { assertSameOrigin, bodyErrorResponse, jsonError, readJson } from "@/lib/auth/request";
import { currentUser } from "@/lib/auth/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { z } from "zod";

const deletionSchema = z.object({ confirmation: z.literal("DELETE"), password: z.string().max(128) });
export async function DELETE(request: Request) {
  if (!assertSameOrigin(request)) return jsonError("Request rejected.", 403);
  try {
    const user = await currentUser();
    if (!user) return jsonError("Authentication required.", 401);
    const parsed = deletionSchema.safeParse(await readJson(request, 16_384));
    if (!parsed.success) return jsonError("Type DELETE and provide your password.", 400);
    const [record] = await getDb().select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id)).limit(1);
    if (!record || !await verifyPassword(parsed.data.password, record.passwordHash)) return jsonError("Password is incorrect.", 403);
    await getDb().delete(users).where(eq(users.id, user.id));
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
    return response;
  } catch (error) { const bodyError = bodyErrorResponse(error); if (bodyError) return bodyError; return jsonError("Account deletion is temporarily unavailable.", 503); }
}
