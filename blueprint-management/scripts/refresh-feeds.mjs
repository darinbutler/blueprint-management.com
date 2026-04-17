#!/usr/bin/env node
/**
 * Local / CI feed refresher.
 * Runs Apify actors against the roster + industry-body RSS, writes
 * /public/cache/feeds.json. Commit the resulting JSON to trigger a redeploy.
 *
 * Usage:
 *   APIFY_TOKEN=... node scripts/refresh-feeds.mjs
 *
 * Safe to skip — if feeds.json is absent, the site falls back to the seed
 * posts defined in src/lib/feeds.ts.
 */

import fs from "node:fs/promises";
import path from "node:path";

const token = process.env.APIFY_TOKEN;
if (!token) {
  console.error("APIFY_TOKEN not set — skipping feed refresh.");
  process.exit(0);
}

const { ApifyClient } = await import("apify-client");
const client = new ApifyClient({ token });

const ROSTER_QUERIES = [
  "Tony Hadley",
  "Spandau Ballet",
  "ABC Martin Fry",
  "Go West band tour",
  "Alison Limerick house music",
  "music manager industry UK"
];

const RSS_FEEDS = [
  "https://themmf.net/feed/",
  "https://www.ukmusic.org/feed/"
];

function toSlug(s) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

async function runGoogleNews(query) {
  const actor =
    process.env.APIFY_GOOGLE_NEWS_ACTOR ?? "lhotanova~google-news-scraper";
  const run = await client.actor(actor).call({
    query,
    language: "en",
    region: "GB",
    maxItems: 15
  });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items.map((item) => ({
    title: String(item.title ?? ""),
    url: String(item.link ?? item.url ?? ""),
    source: String(item.source ?? item.publisher ?? ""),
    publishedAt: item.publishedAt
      ? String(item.publishedAt)
      : item.date
        ? String(item.date)
        : undefined,
    excerpt: String(item.snippet ?? item.description ?? ""),
    image: item.image ? String(item.image) : undefined,
    category: query
  }));
}

async function runRss(url) {
  const actor = process.env.APIFY_RSS_ACTOR ?? "apify~rss-feed-scraper";
  const run = await client.actor(actor).call({ rssUrls: [url] });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items.map((item) => ({
    title: String(item.title ?? ""),
    url: String(item.link ?? item.url ?? ""),
    source: String(
      item.source ?? url.replace(/^https?:\/\//, "").split("/")[0] ?? ""
    ),
    publishedAt: item.pubDate ? String(item.pubDate) : undefined,
    excerpt: String(item.description ?? item.contentSnippet ?? ""),
    image: item.enclosure ? String(item.enclosure) : undefined,
    category: "Industry"
  }));
}

const collected = [];
const seen = new Set();

for (const q of ROSTER_QUERIES) {
  try {
    const items = await runGoogleNews(q);
    for (const raw of items) {
      if (!raw.url || seen.has(raw.url)) continue;
      seen.add(raw.url);
      collected.push({
        slug: toSlug(`${raw.source ?? "blueprint"}-${raw.title}`),
        title: raw.title,
        excerpt: raw.excerpt,
        image: raw.image,
        source: raw.source,
        sourceUrl: raw.url,
        category: raw.category,
        publishedAt: raw.publishedAt
      });
    }
  } catch (err) {
    console.error(`Google News failed for "${q}":`, err.message);
  }
}

for (const url of RSS_FEEDS) {
  try {
    const items = await runRss(url);
    for (const raw of items) {
      if (!raw.url || seen.has(raw.url)) continue;
      seen.add(raw.url);
      collected.push({
        slug: toSlug(`${raw.source ?? "blueprint"}-${raw.title}`),
        title: raw.title,
        excerpt: raw.excerpt,
        image: raw.image,
        source: raw.source,
        sourceUrl: raw.url,
        category: raw.category,
        publishedAt: raw.publishedAt
      });
    }
  } catch (err) {
    console.error(`RSS failed for ${url}:`, err.message);
  }
}

collected.sort((a, b) => {
  const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
  const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
  return db - da;
});

const top = collected.slice(0, 100);
const outDir = path.join(process.cwd(), "public", "cache");
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, "feeds.json"), JSON.stringify(top, null, 2));

console.log(`Wrote ${top.length} feed items to public/cache/feeds.json`);
