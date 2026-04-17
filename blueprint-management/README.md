# Blueprint Management — blueprint-management.com

Editorial website for **Blueprint Management**, a UK boutique artist management company with 50+ years of experience, headed up by Matt Glover. Exclusively represents Alison Limerick, Tony Hadley (ex-Spandau Ballet), ABC, Go West and Peter Cox.

**Static site** built with Next.js 14 + Tailwind, deployed to **GitHub Pages** on the custom domain `blueprint-management.com`.

---

## 1. How the site works

| Part | Tech | Where it runs |
|---|---|---|
| Pages, roster, blog | Next.js `output: 'export'` | Static HTML on GitHub Pages |
| Contact form | Web3Forms | Browser → Web3Forms API → your inbox |
| Imagery | Pre-generated + Unsplash fallbacks | Served from `/public/generated/` |
| Journal feed | JSON committed to repo | Refreshed by GitHub Actions every 6 hrs |

No server. No runtime secrets on the host. Your only costs are your GitHub Pages quota (generous) and your domain registrar.

## 2. Repo layout

```
blueprint-management.com/                    ← GitHub repo root
├── .github/workflows/
│   ├── deploy-pages.yml                     ← builds & deploys on every push to main
│   └── refresh-feeds.yml                    ← refreshes Journal feed every 6 hrs
└── blueprint-management/                    ← the Next.js project
    ├── src/
    │   ├── app/                             ← pages: /, /about, /roster, /blog, /contact…
    │   ├── components/
    │   ├── data/                            ← artists, site config
    │   └── lib/                             ← feeds, assets
    ├── public/
    │   ├── CNAME                            ← 'blueprint-management.com' — custom domain
    │   ├── cache/feeds.json                 ← Journal feed (committed)
    │   ├── generated/                       ← optional pre-rendered imagery
    │   └── llms.txt, logo.svg, favicon.svg
    ├── scripts/
    │   └── refresh-feeds.mjs                ← local / CI Apify feed runner
    └── next.config.mjs                      ← static export config
```

## 3. Local development

```bash
cd blueprint-management
npm install
npm run dev           # → http://localhost:3000
```

Create `.env.local` with at minimum:
```
NEXT_PUBLIC_SITE_URL=https://blueprint-management.com
NEXT_PUBLIC_SITE_NAME=Blueprint Management
NEXT_PUBLIC_WEB3FORMS_KEY=<your web3forms key>
```
See `.env.example` for optional feed and imagery keys.

## 4. Going live on GitHub Pages

One-time setup (all in the GitHub repo web UI):

1. **Settings → Secrets and variables → Actions**, add one secret:
   - `WEB3FORMS_KEY` — from https://web3forms.com (sign up with butlerdarin@gmail.com)
   - Optional: `APIFY_TOKEN` — if you want the feed workflow to fetch live news
2. **Settings → Pages**
   - Source: **GitHub Actions**
   - Custom domain: `blueprint-management.com`
   - Tick **Enforce HTTPS** once the DNS check passes
3. **DNS** at your domain registrar — point `blueprint-management.com` at GitHub Pages:
   - **A** records for apex:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME** record for `www` → `darinbutler.github.io`
4. **Push to `main`** → the deploy workflow runs and publishes the static build.

## 5. Publishing workflow

- **Content tweaks** (copy, artist bios, roster ordering): edit in `blueprint-management/src/data/` or the page files, commit to `main`. Site redeploys automatically.
- **Design / layout changes**: edit the relevant component in `blueprint-management/src/components/`, commit, redeploy.
- **Blog refresh**: `refresh-feeds.yml` runs on a 6-hour schedule and commits `public/cache/feeds.json` when anything changed. Manual: Actions tab → Refresh blog feed → Run workflow.
- **Imagery regeneration**: run locally with `GEMINI_API_KEY=... node scripts/refresh-gemini.mjs` (script not included in this Pages build — add it if needed) and commit `public/generated/*.jpg`.

## 6. SEO + discoverability

- `/sitemap.xml` auto-generated from `src/app/sitemap.ts`
- `/robots.txt` auto-generated from `src/app/robots.ts`
- `/llms.txt` + `/llms-full.txt` for LLM crawlers
- `Organization` / `MusicGroup` JSON-LD on root and per-artist pages
- OpenGraph + Twitter cards on every page

## 7. What the site doesn't have (by design)

- **No live email sending from your own server** — Web3Forms handles delivery to butlerdarin@gmail.com
- **No runtime API keys on the host** — GitHub Pages can't hold them
- **No real-time content** — the Journal updates every 6 hrs via the feed workflow, or immediately on any commit

## 8. What you control without touching code

| Task | Where |
|---|---|
| Change the email the form delivers to | Web3Forms dashboard |
| Change DNS | Your domain registrar |
| Enforce HTTPS | Repo Settings → Pages |
| Trigger redeploy | Actions tab → Deploy to GitHub Pages → Run workflow |
| Rotate form key | Web3Forms dashboard → update `WEB3FORMS_KEY` secret in repo Settings |

## 9. Troubleshooting

- **Site is blank / 404 on custom domain** — DNS hasn't propagated yet (up to 24 hrs). Check `dig blueprint-management.com +short` returns the four GitHub IPs.
- **Form submission silently fails** — `WEB3FORMS_KEY` isn't set in Actions secrets, so the build output has no key. Add it and redeploy.
- **Feed never updates** — `APIFY_TOKEN` isn't set, or the `refresh-feeds.yml` workflow is disabled. Either add the token or set the repo variable `SKIP_APIFY=true` to silence it.
- **Custom domain not working** — in repo Settings → Pages, make sure the CNAME file in `blueprint-management/public/CNAME` matches what's in the Pages custom-domain field exactly.
