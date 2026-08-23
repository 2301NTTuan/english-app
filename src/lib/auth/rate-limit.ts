interface Bucket { count: number; resetAt: number }
const buckets = new Map<string, Bucket>();

export function consumeRateLimit(key: string, limit = 8, windowMs = 15 * 60_000, now = Date.now()): { allowed: boolean; retryAfter: number } {
  if (buckets.size >= 10_000) for (const [bucketKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(bucketKey);
  if (buckets.size >= 10_000 && !buckets.has(key)) return { allowed: false, retryAfter: Math.ceil(windowMs / 1000) };
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true, retryAfter: 0 }; }
  if (current.count >= limit) return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function rateLimitKey(request: Request, action: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${action}:${forwarded || request.headers.get("x-real-ip") || "unknown"}`;
}

export function clearRateLimitsForTests() { buckets.clear(); }
