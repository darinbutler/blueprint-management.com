import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { feedTargets } from "@/data/apifyTargets";
import { runGoogleNews, runRss } from "@/lib/apify";
import { requireAdminToken } from "@/lib/resend";
import { toSlug, type FeedItem } from "@/lib/feeds";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only endpoint: refreshes the Journal / blog feed from Apify.
 * Combines Google News queries about the roster with RSS feeds from
 * music-industry bodies, dedupes by URL, and writes to
 * /public/cache/feeds.json.
 */
export async function POST(request: Request) {
  try {
    requireAdminToken(request);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const collected: FeedItem[] = [];
    const seen = new Set<string>();

    for (const target of feedTargets) {
      try {
        const items =
          target.type === "google-news"
            ? await runGoogleNews(target.query)
            : await runRss(target.url);

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
        console.error("Feed fetch failed for target", target, err);
      }
    }

    // Sort newest first, cap at 100
    collected.sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db - da;
    });
    const top = collected.slice(0, 100);

    const dir = path.join(process.cwd(), "public", "cache");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "feeds.json"),
      JSON.stringify(top, null, 2)
    );

    return NextResponse.json({ ok: true, count: top.length });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "feed refresh failed" },
      { status: 500 }
    );
  }
}
