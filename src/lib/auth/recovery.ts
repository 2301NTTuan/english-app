import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/db/client";
import { auditLogs, authSessions, emailVerificationTokens, passwordResetTokens, users } from "@/db/schema";
import { hashPassword, normalizeEmail } from "@/lib/auth/password";

const RESET_TTL_MS = 60 * 60_000;
const VERIFY_TTL_MS = 24 * 60 * 60_000;
const createOpaqueToken = () => randomBytes(32).toString("base64url");
const hashOpaqueToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function issuePasswordReset(email: string, now = new Date(), ttlMs = RESET_TTL_MS): Promise<string | null> {
  const [user] = await getDb().select({ id: users.id }).from(users).where(eq(users.email, normalizeEmail(email))).limit(1);
  if (!user) return null;
  const token = createOpaqueToken();
  await getDb().transaction(async (tx) => {
    await tx.update(passwordResetTokens).set({ usedAt: now }).where(and(eq(passwordResetTokens.userId, user.id), isNull(passwordResetTokens.usedAt)));
    await tx.insert(passwordResetTokens).values({ tokenHash: hashOpaqueToken(token), userId: user.id, expiresAt: new Date(now.getTime() + ttlMs) });
    await tx.insert(auditLogs).values({ userId: user.id, action: "account.password_reset_requested", entityType: "user", entityId: user.id });
  });
  return token;
}

export async function consumePasswordReset(token: string, password: string, now = new Date()): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return getDb().transaction(async (tx) => {
    const [claimed] = await tx.update(passwordResetTokens).set({ usedAt: now }).where(and(
      eq(passwordResetTokens.tokenHash, hashOpaqueToken(token)), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, now),
    )).returning({ userId: passwordResetTokens.userId });
    if (!claimed) return false;
    await tx.update(users).set({ passwordHash, updatedAt: now }).where(eq(users.id, claimed.userId));
    await tx.delete(authSessions).where(eq(authSessions.userId, claimed.userId));
    await tx.insert(auditLogs).values({ userId: claimed.userId, action: "account.password_reset_completed", entityType: "user", entityId: claimed.userId });
    return true;
  });
}

export async function issueEmailVerification(userId: string, now = new Date(), ttlMs = VERIFY_TTL_MS): Promise<string> {
  const token = createOpaqueToken();
  await getDb().transaction(async (tx) => {
    await tx.update(emailVerificationTokens).set({ usedAt: now }).where(and(eq(emailVerificationTokens.userId, userId), isNull(emailVerificationTokens.usedAt)));
    await tx.insert(emailVerificationTokens).values({ tokenHash: hashOpaqueToken(token), userId, expiresAt: new Date(now.getTime() + ttlMs) });
  });
  return token;
}

export async function consumeEmailVerification(token: string, now = new Date()): Promise<boolean> {
  return getDb().transaction(async (tx) => {
    const [claimed] = await tx.update(emailVerificationTokens).set({ usedAt: now }).where(and(
      eq(emailVerificationTokens.tokenHash, hashOpaqueToken(token)), isNull(emailVerificationTokens.usedAt), gt(emailVerificationTokens.expiresAt, now),
    )).returning({ userId: emailVerificationTokens.userId });
    if (!claimed) return false;
    await tx.update(users).set({ emailVerifiedAt: now, updatedAt: now }).where(eq(users.id, claimed.userId));
    await tx.insert(auditLogs).values({ userId: claimed.userId, action: "account.email_verified", entityType: "user", entityId: claimed.userId });
    return true;
  });
}
