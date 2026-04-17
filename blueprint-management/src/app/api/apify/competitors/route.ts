import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { competitorTargets } from "@/data/apifyTargets";
import { runWebScraper, type CompetitorSnapshot } from "@/lib/apify";
import { requireAdminToken } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only endpoint: scrapes the 5 configured competitor sites using an
 * Apify web-scraper actor, extracts navigation and headline patterns, and
 * writes /public/cache/competitors.json. Intended as an offline inform-the-IA
 * research tool, not a runtime dependency of the public site.
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
    const rawItems = await runWebScraper(
      competitorTargets.map((c) => ({ url: c.url }))
    );

    const snapshots: CompetitorSnapshot[] = competitorTargets.map((target) => {
      const match = rawItems.find(
        (i) =>
          typeof i.url === "string" &&
          (i.url as string).startsWith(target.url.replace(/\/$/, ""))
      );
      return {
        id: target.id,
        name: target.name,
        url: target.url,
        fetchedAt: new Date().toISOString(),
        nav: (match?.nav as string[]) ?? [],
        headlines: (match?.headlines as string[]) ?? [],
        hero: (match?.hero as string) ?? ""
      };
    });

    const dir = path.join(process.cwd(), "public", "cache");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "competitors.json"),
      JSON.stringify(snapshots, null, 2)
    );

    return NextResponse.json({ ok: true, count: snapshots.length, snapshots });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "scrape failed" },
      { status: 500 }
    );
  }
}
