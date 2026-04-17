# Apify configuration

Two use cases:

## 1. Competitor IA research
- Actor: `apify~web-scraper`
- Input file: [`actor-input.competitors.json`](./actor-input.competitors.json)
- Crawls the 5 competitor URLs, extracts navigation items, headlines and hero copy.
- Run from the Blueprint admin endpoint: `POST /api/apify/competitors?token=$ADMIN_REFRESH_TOKEN`
- Output cached at `/public/cache/competitors.json` — used to inform the IA when the roster changes.

## 2. Content / Journal feed
- Actors: `lhotanova~google-news-scraper` (per roster artist) + `apify~rss-feed-scraper` (for industry bodies)
- Input file: [`actor-input.feeds.json`](./actor-input.feeds.json) (sample — run per query)
- Run from the Blueprint admin endpoint: `POST /api/apify/feeds?token=$ADMIN_REFRESH_TOKEN`
- Output cached at `/public/cache/feeds.json` — feeds `/blog` directly.

## Env
Both endpoints require `APIFY_TOKEN` on the server and `ADMIN_REFRESH_TOKEN` to gate the endpoint itself.

## Recommended cadence
- Feeds: every 6 hours via Apify Scheduled Runs (or Vercel Cron)
- Competitors: weekly, manually

## Running manually from your laptop
```
APIFY_TOKEN=xxx \
ADMIN_REFRESH_TOKEN=xxx \
SITE_URL=https://blueprint-management.com \
npm run refresh:apify
```
