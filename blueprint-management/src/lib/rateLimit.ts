/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Caveat: state is per Node.js instance. On serverless deployments (Vercel)
 * each cold-started instance has its own counter, so effective limits are
 * looser than the configured values under very heavy load. For the volume
 * a contact form sees, this is fine. For anything higher-risk, swap in
 * Upstash Ratelimit (https://upstash.com/docs/ratelimit) — the call site
 * below is designed to drop in.
 */

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

// Opportunistic cleanup to keep the map bounded.
function sweep(now: number) {
  if (store.size < 1000) return;
  for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
}

export function rateLimit({
  key,
  limit,
  windowMs
}: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  sweep(now);
  let bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    store.set(key, bucket);
  }
  bucket.count += 1;
  const ok = bucket.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt
  };
}

/** Extract a reasonable client identifier from Next.js request headers. */
export function clientKey(req: Request): string {
  const h = req.headers;
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    h.get("cf-connecting-ip") ??
    "unknown";
  return ip;
}
