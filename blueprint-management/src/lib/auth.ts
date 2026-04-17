import crypto from "node:crypto";
import { requireSecret } from "./env";

/**
 * Admin / cron auth for /api/gemini and /api/apify/* endpoints.
 *
 * Accepts a token in (preferred → least preferred):
 *   1. Authorization: Bearer <token>     ← preferred; used by Vercel Cron
 *   2. X-Admin-Token: <token>            ← preferred for curl
 *   3. ?token=<token>                    ← legacy, still accepted, discouraged
 *
 * The comparison is constant-time to prevent timing side-channels.
 *
 * Vercel Cron hits paths with `Authorization: Bearer $CRON_SECRET` — we
 * accept CRON_SECRET as an equal-authority alias so the scheduled feed
 * refresh works without leaking ADMIN_REFRESH_TOKEN into the cron path.
 */
export function requireAdminToken(req: Request): void {
  const expectedAdmin = requireSecret("ADMIN_REFRESH_TOKEN");
  const expectedCron = tryGetCronSecret();
  const provided = extractToken(req);

  if (!provided) throwUnauthorised("missing");

  const matchesAdmin = safeEqual(provided, expectedAdmin);
  const matchesCron = expectedCron
    ? safeEqual(provided, expectedCron)
    : false;

  if (!matchesAdmin && !matchesCron) throwUnauthorised("invalid");
}

function extractToken(req: Request): string | undefined {
  const auth = req.headers.get("authorization") ?? "";
  const bearer = auth.match(/^Bearer\s+(.+)$/i);
  if (bearer?.[1]) return bearer[1].trim();

  const xAdmin = req.headers.get("x-admin-token");
  if (xAdmin) return xAdmin.trim();

  const qs = new URL(req.url).searchParams.get("token");
  if (qs) return qs.trim();

  return undefined;
}

function tryGetCronSecret(): string | undefined {
  const v = process.env.CRON_SECRET;
  return v && v.trim() !== "" ? v : undefined;
}

function safeEqual(a: string, b: string): boolean {
  // Normalise length before timing-safe compare — compare hashes of each
  // input so different-length strings don't short-circuit.
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function throwUnauthorised(_reason: "missing" | "invalid"): never {
  // Same response regardless of reason — don't help attackers differentiate.
  throw new Response("Unauthorized", {
    status: 401,
    headers: {
      "Cache-Control": "no-store",
      "WWW-Authenticate": 'Bearer realm="blueprint-admin"'
    }
  });
}
