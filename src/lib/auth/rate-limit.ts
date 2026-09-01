import "server-only";

import { createHash } from "node:crypto";
import { lt, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { authRateLimits } from "@/db/schema";
import { logEvent } from "@/lib/observability/logger";

interface Bucket { count: number; resetAt: number }
export interface RateLimitResult { allowed: boolean; retryAfter: number; unavailable?: boolean }

const buckets = new Map<string, Bucket>();
let lastCleanup = 0;

function memoryRateLimit(key: string, limit: number, windowMs: number, now: number): RateLimitResult {
  if (buckets.size >= 10_000) for (const [bucketKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(bucketKey);
  if (buckets.size >= 10_000 && !buckets.has(key)) return { allowed: false, retryAfter: Math.ceil(windowMs / 1000) };
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true, retryAfter: 0 }; }
  if (current.count >= limit) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function backend() {
  return process.env.RATE_LIMIT_BACKEND ?? (process.env.NODE_ENV === "production" ? "postgres" : "memory");
}

function hashKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

async function postgresRateLimit(key: string, limit: number, windowMs: number, now: number): Promise<RateLimitResult> {
  const db = getDb();
  const currentTime = new Date(now);
  const nextReset = new Date(now + windowMs);
  const [row] = await db.insert(authRateLimits).values({ keyHash: hashKey(key), count: 1, resetAt: nextReset, updatedAt: currentTime })
    .onConflictDoUpdate({
      target: authRateLimits.keyHash,
      set: {
        count: sql<number>`case when ${authRateLimits.resetAt} <= ${currentTime} then 1 else ${authRateLimits.count} + 1 end`,
        resetAt: sql<Date>`case when ${authRateLimits.resetAt} <= ${currentTime} then ${nextReset} else ${authRateLimits.resetAt} end`,
        updatedAt: currentTime,
      },
    })
    .returning({ count: authRateLimits.count, resetAt: authRateLimits.resetAt });

  if (now - lastCleanup > 60 * 60_000) {
    lastCleanup = now;
    void db.delete(authRateLimits).where(lt(authRateLimits.resetAt, new Date(now - 24 * 60 * 60_000))).catch(() => undefined);
  }

  const retryAfter = Math.max(1, Math.ceil((row.resetAt.getTime() - now) / 1000));
  return row.count <= limit ? { allowed: true, retryAfter: 0 } : { allowed: false, retryAfter };
}

/** Uses PostgreSQL atomically in production; storage failures deny the request. */
export async function consumeRateLimit(key: string, limit = 8, windowMs = 15 * 60_000, now = Date.now()): Promise<RateLimitResult> {
  if (backend() === "memory") {
    if (process.env.NODE_ENV === "production") {
      logEvent("error", "security.rate_limit_insecure_backend");
      return { allowed: false, retryAfter: Math.ceil(windowMs / 1000), unavailable: true };
    }
    return memoryRateLimit(key, limit, windowMs, now);
  }
  try {
    return await postgresRateLimit(key, limit, windowMs, now);
  } catch {
    logEvent("error", "security.rate_limit_store_unavailable");
    return { allowed: false, retryAfter: Math.ceil(windowMs / 1000), unavailable: true };
  }
}

/** Only honor client-address headers when the deployment explicitly trusts its edge proxy. */
export function rateLimitKey(request: Request, action: string) {
  const trusted = process.env.TRUST_PROXY === "true";
  const forwarded = trusted ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : undefined;
  const realIp = trusted ? request.headers.get("x-real-ip")?.trim() : undefined;
  return `${action}:${forwarded || realIp || "untrusted-client"}`;
}

/** Adds a privacy-preserving per-account bucket without retaining the raw email address. */
export function rateLimitSubjectKey(action: string, subject: string) {
  return `${action}:subject:${hashKey(subject.trim().toLowerCase())}`;
}

export function clearRateLimitsForTests() { buckets.clear(); lastCleanup = 0; }
