import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db/client";
import { auditLogs, emailVerificationTokens, learningPreferences, users, userStateSnapshots } from "@/db/schema";
import { createEmptyAccountState } from "@/lib/storage/app-repository";
import { createOneTimeToken, hashOneTimeToken, issueEmailVerification, verificationExpiresAt } from "./recovery";
import { hashPassword, normalizeEmail, verifyPassword } from "./password";

const DUMMY_PASSWORD_HASH = "$2b$12$hHySbpbRtR9436UGn2PhyuDEV1kac/gRti0IdDqLnpPPvekCeBmTO";

export interface RegistrationInput { name: string; email: string; password: string }
export interface RegisteredAccount { userId: string; email: string; verificationToken: string }
export type CredentialResult = { status: "invalid" } | { status: "unverified"; userId: string } | { status: "verified"; userId: string };

export async function registerAccount(input: RegistrationInput): Promise<RegisteredAccount> {
  const email = normalizeEmail(input.email);
  const passwordHash = await hashPassword(input.password);
  const verificationToken = createOneTimeToken();
  const tokenHash = hashOneTimeToken(verificationToken);
  const expiresAt = verificationExpiresAt();

  const userId = await getDb().transaction(async (tx) => {
    const [user] = await tx.insert(users).values({ name: input.name.trim(), email, passwordHash }).returning({ id: users.id });
    await tx.insert(learningPreferences).values({ userId: user.id });
    await tx.insert(userStateSnapshots).values({ userId: user.id, schemaVersion: 1, state: createEmptyAccountState() });
    await tx.insert(emailVerificationTokens).values({ tokenHash, userId: user.id, expiresAt });
    await tx.insert(auditLogs).values({ userId: user.id, action: "account.registered", entityType: "user", entityId: user.id });
    return user.id;
  });

  return { userId, email, verificationToken };
}

export async function verifyCredentials(email: string, password: string): Promise<CredentialResult> {
  const [user] = await getDb().select({ id: users.id, passwordHash: users.passwordHash, emailVerifiedAt: users.emailVerifiedAt })
    .from(users).where(eq(users.email, normalizeEmail(email))).limit(1);
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
  if (!user || !valid) return { status: "invalid" };
  return user.emailVerifiedAt ? { status: "verified", userId: user.id } : { status: "unverified", userId: user.id };
}

export async function prepareVerificationResend(email: string, now = new Date()): Promise<{ email: string; token: string } | null> {
  const normalizedEmail = normalizeEmail(email);
  const [user] = await getDb().select({ id: users.id, email: users.email }).from(users)
    .where(and(eq(users.email, normalizedEmail), isNull(users.emailVerifiedAt))).limit(1);
  if (!user) return null;
  return { email: user.email, token: await issueEmailVerification(user.id, now) };
}
