# Blueprint Management — blueprint-management.com

Editorial, lifestyle-leaning website for **Blueprint Management**, a UK boutique artist management company with 50+ years of experience, headed up by Matt Glover. Exclusively represents Alison Limerick, Tony Hadley (ex-Spandau Ballet), ABC, Go West and Peter Cox.

Tech: **Next.js 14 (App Router) · TypeScript · Tailwind · Resend · Google Gemini (Imagen) · Apify**.

---

## 1. Quick start

```bash
# 1. install deps
npm install

# 2. copy env and fill in keys
cp .env.example .env.local

# 3. dev
npm run dev        # → http://localhost:3000
```

## 2. Environment variables

Drop these into `.env.local`:

| Variable | What it's for | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, e.g. `https://blueprint-management.com` | yes |
| `RESEND_API_KEY` | Contact-form delivery (https://resend.com) | yes |
| `CONTACT_TO_EMAIL` | Destination inbox (defaults to `butlerdarin@gmail.com`) | yes |
| `CONTACT_FROM_EMAIL` | Verified Resend sender, e.g. `hello@blueprint-management.com` | yes |
| `GEMINI_API_KEY` | Google AI Studio key for Imagen image generation | for images |
| `GEMINI_IMAGE_MODEL` | Defaults to `imagen-3.0-generate-002` | no |
| `APIFY_TOKEN` | Apify API token (https://console.apify.com) | for Journal + competitor crawl |
| `ADMIN_REFRESH_TOKEN` | Long random string — gates `/api/gemini` and `/api/apify/*` | yes |
| `CRON_SECRET` | Long random string — used by Vercel Cron to auth scheduled feed refreshes | prod only |

Generate `ADMIN_REFRESH_TOKEN` and `CRON_SECRET` with `openssl rand -hex 32`.
For a full security rundown (rotation, threat model, scanner setup), see [`SECURITY.md`](./SECURITY.md).

## 3. What's in the box

```
blueprint-management/
├── src/
│   ├── app/
│   │   ├── layout.tsx                   ← Root layout, SEO metadata, JSON-LD org
│   │   ├── page.tsx                     ← Home
│   │   ├── about/page.tsx
│   │   ├── roster/page.tsx              ← Roster grid
│   │   ├── roster/[slug]/page.tsx       ← Artist profile (static-param generated)
│   │   ├── contact/page.tsx             ← Above-the-fold form + FAQ
│   │   ├── blog/page.tsx                ← Journal (Apify-populated)
│   │   ├── blog/[slug]/page.tsx
│   │   ├── for-emerging-artists/page.tsx  ← SEO landing page
│   │   ├── privacy / terms / cookies
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts                   ← /sitemap.xml (auto-generated)
│   │   ├── robots.ts                    ← /robots.txt
│   │   └── api/
│   │       ├── contact/route.ts         ← Resend-backed form
│   │       ├── gemini/route.ts          ← Admin: regenerate imagery
│   │       └── apify/
│   │           ├── competitors/route.ts ← Admin: refresh competitor IA snapshot
│   │           └── feeds/route.ts       ← Admin: refresh Journal feed
│   ├── components/                      ← Header, Footer, Hero, ContactForm, etc.
│   ├── data/
│   │   ├── site.ts                      ← Nav + footer + site metadata
│   │   ├── artists.ts                   ← Full roster content + SEO per artist
│   │   ├── geminiPrompts.ts             ← 10 prompt templates per section
│   │   └── apifyTargets.ts              ← 5 competitors + feed targets
│   └── lib/
│       ├── gemini.ts                    ← Imagen + Gemini text helpers
│       ├── apify.ts                     ← Apify actor wrappers (web-scraper, news, rss)
│       ├── feeds.ts                     ← Journal cache reader + fallback posts
│       ├── assets.ts                    ← Image path resolver (generated vs Unsplash fallback)
│       └── resend.ts                    ← Resend + admin-token guard
├── scripts/
│   ├── refresh-apify.mjs
│   └── refresh-gemini.mjs
├── apify/
│   ├── actor-input.competitors.json     ← Apify web-scraper input
│   ├── actor-input.feeds.json
│   └── README.md
├── public/
│   ├── logo.svg  logo-mark.svg  favicon.svg
│   ├── llms.txt  llms-full.txt
│   └── (generated/  cache/  populated at runtime)
├── next.config.mjs  tailwind.config.ts  tsconfig.json
├── vercel.json                          ← Cron: refresh feed every 6 hrs
└── .env.example
```

## 4. Generating imagery via Google Gemini

`/src/data/geminiPrompts.ts` contains **10 curated Imagen prompts**, one per site section, each in the Blueprint editorial aesthetic (deep blue + warm stage gold + ink, cinematic).

Prompts:
- `homeHero`, `homeLegacy`, `homeRosterBanner`
- `aboutHero`, `aboutStory`
- `rosterHero`
- `emergingArtists`
- `contactHero`
- `blogHero`, `journalArticleFallback`

### Running generation
Once env is set, either:

```bash
# Call the endpoint locally
ADMIN_REFRESH_TOKEN=xxx SITE_URL=http://localhost:3000 npm run refresh:gemini

# Or after deploy — prefer the Authorization header (query-string token works
# but appears in Vercel access logs; use the header in production).
curl -X POST https://blueprint-management.com/api/gemini \
  -H "Authorization: Bearer $ADMIN_REFRESH_TOKEN"
```

Images are written to `/public/generated/<id>.jpg`. Flip `USE_GENERATED=true` in your env to have the site prefer the generated images over the Unsplash fallbacks.

Per-artist portraits can be generated by adding them as keys to `geminiPrompts.ts` (see `artist-tony-hadley` etc. in `lib/assets.ts` fallbacks) and calling `/api/gemini?key=<id>`.

## 5. Apify integration — two use cases

### 5a. Competitor IA scrape
Hit `POST /api/apify/competitors?token=$ADMIN_REFRESH_TOKEN`. Uses the `apify~web-scraper` actor to crawl the 5 configured competitor URLs (Xtreme Talent, Sound Artist Management, Various Artists Management, Authority Management, UTA Brands). Extracts navigation, headlines and hero copy, writes `/public/cache/competitors.json`. Use this output to audit your own IA against competitors.

Config file: `apify/actor-input.competitors.json`.

### 5b. Journal / content feed
Hit `POST /api/apify/feeds?token=$ADMIN_REFRESH_TOKEN`. Runs:
- `lhotanova~google-news-scraper` per roster artist
- `apify~rss-feed-scraper` for MMF, UK Music

Deduplicates by URL, sorts newest first, caps at 100, writes `/public/cache/feeds.json`. The `/blog` page reads from this cache (with a graceful fallback to three Blueprint-authored seed posts for the first deploy).

A `vercel.json` cron entry is wired to run this every 6 hours automatically on Vercel.

### 5c. Admin UI
Both refresh endpoints are token-gated via `ADMIN_REFRESH_TOKEN`. If you want a UI, a minimal `/admin` page wrapping these two buttons plus the Gemini refresh is ~40 lines — out of scope for this scaffold but hooks are in place.

## 6. Contact form (Resend)

`/api/contact` validates the submission, enforces a honeypot, and sends a branded HTML email to `CONTACT_TO_EMAIL` (default `butlerdarin@gmail.com`) via Resend. The form:
- Sits above the fold on `/contact`
- Pre-fills an enquiry subject via `?subject=...` (e.g. `?subject=Tony%20Hadley%20—%20enquiry`)
- Has honey-pot spam defence
- Requires consent checkbox (GDPR)
- Appears as a secondary enquiry CTA on every artist profile

## 7. SEO

- **Structured data**: `Organization/MusicGroup` JSON-LD on root layout + per-artist `MusicGroup` with manager relationship
- **sitemap.xml**: auto-generated via `src/app/sitemap.ts` (includes all static pages, 5 artists, and Blueprint-authored blog posts)
- **robots.txt**: auto-generated — disallows `/api/` and `/admin/`
- **llms.txt** + **llms-full.txt**: canonical LLM-friendly descriptions of the site
- **Canonical URLs** on every page
- **OpenGraph + Twitter cards** on every page
- **Long-form SEO landing page**: `/for-emerging-artists` is a pillar page targeting high-intent keywords (emerging artist management, boutique music management, etc.)

### Keyword coverage
Primary: *artist management UK*, *boutique music management*, *band management agency*
Artist-specific: *Tony Hadley management*, *ABC band management*, *Go West management*, *Alison Limerick management*, *Peter Cox management*
Long-tail: *music manager for emerging artists*, *how to get artist management*, *career music management UK*

## 8. Deploying to Vercel

1. Push the repo to GitHub (the `blueprint-management.com` repo you already have).
2. Import into Vercel — it auto-detects Next.js.
3. Add all env vars from `.env.example` to Vercel's dashboard.
4. Build command: `next build` (default). Output: `.next`.
5. Point the `blueprint-management.com` domain at Vercel.
6. On first deploy, run `POST /api/gemini?token=...` once to populate hero imagery, and `POST /api/apify/feeds?token=...` to populate the Journal.

Cron feeds refresh is auto-wired via `vercel.json`.

## 9. Accessibility + performance

- Semantic landmarks (`header`, `main`, `footer`, `nav`, `article`, `aside`)
- Colour contrast AA across palette
- Focus rings on all interactive controls
- `next/image` with `sizes` everywhere
- `next/font` for Inter + Fraunces (subsetted, display swap)
- Critical CSS via Tailwind build
- No blocking client-side JS beyond the header mobile toggle + contact-form handler

## 10. What's next (out of scope for this scaffold)

- Build a richer `/admin` page with refresh buttons
- Blueprint-authored long-form blog posts (Journal seeds are in `lib/feeds.ts`)
- Per-artist tour date calendars (Bandsintown/Songkick integration)
- Analytics (Plausible / Fathom recommended over GA4)
- Cookie banner (only needed once analytics land)
