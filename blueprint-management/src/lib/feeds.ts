import fs from "node:fs/promises";
import path from "node:path";

/**
 * Static-site feed reader.
 *
 * At build time, reads /public/cache/feeds.json (populated by
 * scripts/refresh-feeds.mjs run locally or by GitHub Actions).
 *
 * Falls back to three Blueprint-authored seed posts if the cache isn't
 * populated yet — so the site always renders something in /blog even on
 * the first build.
 */

export type FeedItem = {
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  source?: string;
  sourceUrl?: string;
  category?: string;
  publishedAt?: string;
};

const CACHE_PATH = path.join(process.cwd(), "public", "cache", "feeds.json");

export async function readFeed(): Promise<FeedItem[]> {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf8");
    const data = JSON.parse(raw) as FeedItem[];
    return data.sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db - da;
    });
  } catch {
    return SEED_POSTS;
  }
}

export function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

const SEED_POSTS: FeedItem[] = [
  {
    slug: "building-blueprint-50-years",
    title: "Careers, not campaigns: 50 years of Blueprint",
    excerpt:
      "Matt Glover reflects on five decades of artist management — what has changed, what hasn't, and why the best managers still travel with the artist.",
    category: "From Blueprint",
    source: "Blueprint Journal",
    publishedAt: new Date().toISOString(),
    image: "/generated/blog-hero.jpg"
  },
  {
    slug: "emerging-artists-real-partnership",
    title: "What emerging artists actually need from a manager in 2026",
    excerpt:
      "The roster is small on purpose. Here's why boutique management still beats the agency machine when you're building a career.",
    category: "Industry",
    source: "Blueprint Journal",
    publishedAt: new Date(Date.now() - 86_400_000 * 7).toISOString(),
    image: "/generated/emerging-artists.jpg"
  },
  {
    slug: "tony-hadley-symphonic-return",
    title: "Tony Hadley announces 2026 European symphonic return",
    excerpt:
      "A new run of orchestral dates for the former Spandau Ballet frontman, produced with long-time collaborators across the UK and Italy.",
    category: "Artist News",
    source: "Blueprint Journal",
    publishedAt: new Date(Date.now() - 86_400_000 * 14).toISOString(),
    image: "/generated/journal-article-fallback.jpg"
  }
];
