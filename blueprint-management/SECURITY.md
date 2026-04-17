# Security notes — Blueprint Management

Short threat model + operating rules for the blueprint-management.com codebase. Read before dropping real API keys in.

## 1. Secrets inventory

| Name | Where it lives | Who needs it | Risk if leaked |
|---|---|---|---|
| `RESEND_API_KEY` | Server env only | `/api/contact` | Attacker can send email from your verified domain (spoofing, spam). Revoke immediately at resend.com/api-keys. |
| `GEMINI_API_KEY` | Server env only | `/api/gemini` | Attacker can rack up Imagen spend on your Google billing account. Revoke at aistudio.google.com/apikey. |
| `APIFY_TOKEN` | Server env only | `/api/apify/*` | Attacker can run actors against your Apify account (compute costs). Revoke at console.apify.com/account/integrations. |
| `ADMIN_REFRESH_TOKEN` | Server env only | Admin endpoints | Attacker can trigger image regen + feed refresh (compute cost, possible DoS). Rotate by setting a new value. |
| `CRON_SECRET` | Server env only (Vercel) | Vercel Cron | Attacker can trigger the feed refresh endpoint. Set a separate long random string in the Vercel dashboard. |
| `CONTACT_TO_EMAIL` | Not a secret | Fallback for form destination | Not sensitive — but may disclose your inbox address. |

**No NEXT_PUBLIC_* secrets.** Any env var prefixed `NEXT_PUBLIC_` is bundled into the client JS; only non-sensitive config (site URL, site name) uses that prefix.

## 2. Handling rules

- **Never commit `.env.local`** — it's in `.gitignore`. CI should fail fast if one is present.
- **Never paste secrets into chat, issue trackers, commit messages or screenshots.**
- **Rotate immediately if a secret appears in any of the above.** Each provider offers one-click rotation.
- **Use separate values per environment** (dev, preview, prod). Vercel supports this natively.
- **Store local secrets outside the repo** — e.g. `~/.blueprint-management.env` sourced into your shell, or a password manager.

## 3. Attack surface and mitigations

### Public endpoints

| Endpoint | Mitigation |
|---|---|
| `POST /api/contact` | Per-IP rate limit (5 req / 10 min), 32KB payload cap, honeypot, GDPR consent required, header-injection strip on subject fields, generic error responses so internals aren't leaked. |
| Every other page | Static-rendered where possible; no write surface exposed. |

### Admin endpoints

| Endpoint | Mitigation |
|---|---|
| `POST /api/gemini` | Bearer-token auth (preferred) or `X-Admin-Token` header; query-string `token=` still accepted for curl but **discouraged** — appears in server access logs. Constant-time token comparison via `crypto.timingSafeEqual`. |
| `POST /api/apify/competitors` | Same as above. |
| `POST /api/apify/feeds` | Same as above. Also accepts `CRON_SECRET` for Vercel Cron. |

### Platform

- **HTTP security headers** set in `next.config.mjs`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` locked down to no camera/mic/geolocation.
- **HTTPS-only**: enforce via Vercel (automatic on .com domains).

## 4. What's NOT protected against (intentional tradeoffs)

- **Distributed rate limit**: The in-memory limiter in `src/lib/rateLimit.ts` is per-instance. On Vercel, each serverless instance has its own counter, so the practical limit is a multiple of the configured value under high concurrency. Upgrade to Upstash Ratelimit if the contact form becomes a target.
- **Bot signup with valid-looking emails**: The honeypot + rate limit + consent checkbox handle most form spam. For higher-volume attacks, add Cloudflare Turnstile (free).
- **CSRF on the contact form**: Same-origin fetch + no auth state means CSRF isn't practical here. If you ever add an authenticated admin UI, add a CSRF token.

## 5. Rotation checklist

On any suspected leak:

1. **Resend**: Revoke the key at [resend.com/api-keys](https://resend.com/api-keys), create a new one, update Vercel env.
2. **Gemini**: Regenerate at [aistudio.google.com/apikey](https://aistudio.google.com/apikey), update Vercel env.
3. **Apify**: Rotate at [console.apify.com/account/integrations](https://console.apify.com/account/integrations), update Vercel env.
4. **Admin / Cron tokens**: Generate new long random strings (`openssl rand -hex 32`), update Vercel env. Anyone sharing the old values loses access.
5. **Redeploy** Vercel so env changes take effect.
6. **Review Vercel access logs** for unusual traffic to `/api/gemini` and `/api/apify/*`.

## 6. Reporting

If you spot a vulnerability, email butlerdarin@gmail.com. Don't file a public GitHub issue.
