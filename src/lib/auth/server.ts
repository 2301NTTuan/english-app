import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db/client";
import { authSessions, users } from "@/db/schema";
import { createSessionToken, hashSessionToken, SESSION_COOKIE, sessionExpiresAt } from "./session";

export interface AuthenticatedUser { id: string; name: string; email: string }

export async function createDatabaseSession(userId: string) {
  const token = createSessionToken();
  await getDb().insert(authSessions).values({ tokenHash: hashSessionToken(token), userId, expiresAt: sessionExpiresAt() });
  return token;
}

export async function currentUser(): Promise<AuthenticatedUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [row] = await getDb().select({ id: users.id, name: users.name, email: users.email })
    .from(authSessions).innerJoin(users, eq(authSessions.userId, users.id))
    .where(and(eq(authSessions.tokenHash, hashSessionToken(token)), gt(authSessions.expiresAt, new Date()))).limit(1);
  return row ?? null;
}

export async function deleteCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await getDb().delete(authSessions).where(eq(authSessions.tokenHash, hashSessionToken(token)));
}
