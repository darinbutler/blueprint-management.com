import { ApifyClient } from "apify-client";
import { requireSecret } from "./env";

/**
 * Apify integration — used for two things:
 *   1. Competitor scraping (web-scraper)   → /api/apify/competitors
 *   2. Content feeds (google-news, rss)    → /api/apify/feeds
 *
 * Both endpoints write caches to /public/cache/*.json on demand.
 */

export function getApifyClient() {
  return new ApifyClient({ token: requireSecret("APIFY_TOKEN") });
}

export type CompetitorSnapshot = {
  id: string;
  name: string;
  url: string;
  fetchedAt: string;
  nav: string[];
  headlines: string[];
  hero?: string;
};

export type FeedItemRaw = {
  title: string;
  url: string;
  source?: string;
  publishedAt?: string;
  excerpt?: string;
  image?: string;
  category?: string;
};

/**
 * NOTE: apify~web-scraper expects `pageFunction` as a **stringified** JS function —
 * it's executed in the target page's browser context, so it must be serialisable
 * over JSON. Keep this as a string.
 */
const COMPETITOR_PAGE_FN = `async function pageFunction(context) {
  const { $, request } = context;
  const nav = [];
  $("nav a, header a").each(function () {
    const text = $(this).text().trim();
    if (text) nav.push(text);
  });
  const headlines = [];
  $("main h1, main h2, main h3, section h1, section h2").each(function () {
    const text = $(this).text().trim();
    if (text) headlines.push(text);
  });
  const hero = $("section:first-of-type h1").text().trim();
  return {
    url: request.url,
    nav: Array.from(new Set(nav)).slice(0, 40),
    headlines: Array.from(new Set(headlines)).slice(0, 40),
    hero
  };
}`;

export async function runWebScraper(startUrls: { url: string }[]): Promise<
  Record<string, unknown>[]
> {
  const client = getApifyClient();
  const actor =
    process.env.APIFY_WEB_SCRAPER_ACTOR ?? "apify~web-scraper";

  const input = {
    runMode: "DEVELOPMENT",
    startUrls,
    linkSelector: "",
    pageFunction: COMPETITOR_PAGE_FN,
    maxRequestsPerCrawl: startUrls.length * 3,
    maxPagesPerCrawl: startUrls.length * 3,
    proxyConfiguration: { useApifyProxy: true }
  };

  const run = await client.actor(actor).call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items as Record<string, unknown>[];
}

export async function runGoogleNews(query: string): Promise<FeedItemRaw[]> {
  const client = getApifyClient();
  const actor =
    process.env.APIFY_GOOGLE_NEWS_ACTOR ?? "lhotanova~google-news-scraper";

  const run = await client
    .actor(actor)
    .call({
      query,
      language: "en",
      region: "GB",
      maxItems: 15
    });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return (items as Record<string, unknown>[]).map((item) => ({
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

export async function runRss(url: string): Promise<FeedItemRaw[]> {
  const client = getApifyClient();
  const actor = process.env.APIFY_RSS_ACTOR ?? "apify~rss-feed-scraper";
  const run = await client.actor(actor).call({ rssUrls: [url] });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return (items as Record<string, unknown>[]).map((item) => ({
    title: String(item.title ?? ""),
    url: String(item.link ?? item.url ?? ""),
    source: String(item.source ?? url.replace(/^https?:\/\//, "").split("/")[0] ?? ""),
    publishedAt: item.pubDate ? String(item.pubDate) : undefined,
    excerpt: String(item.description ?? item.contentSnippet ?? ""),
    image: item.enclosure ? String(item.enclosure) : undefined,
    category: "Industry"
  }));
}
