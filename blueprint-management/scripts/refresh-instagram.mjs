#!/usr/bin/env node
/**
 * Local / CI Instagram refresher.
 *
 * For each roster artist, runs an Apify Instagram scraper against their
 * official handle, downloads the post thumbnails into public/cache/ig/,
 * and writes a consolidated manifest to public/cache/instagram.json.
 *
 * Safe to skip — if APIFY_TOKEN is missing we exit 0 and the site falls
 * back to an empty activity feed (graceful empty state).
 *
 * Usage:
 *   APIFY_TOKEN=... node scripts/refresh-instagram.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";

const token = process.env.APIFY_TOKEN;
if (!token) {
  console.error("APIFY_TOKEN not set — skipping Instagram refresh.");
  process.exit(0);
}

const { ApifyClient } = await import("apify-client");
const client = new ApifyClient({ token });

// Official handles come from src/data/artists.ts socials.
// Kept here (not imported) because this script runs as plain .mjs in CI
// without a TypeScript toolchain.
const TARGETS = [
  { slug: "tony-hadley", name: "Tony Hadley", handle: "tonyhadleyofficial" },
  { slug: "abc", name: "ABC", handle: "abc_martinfry" },
  { slug: "go-west", name: "Go West", handle: "gowestofficial" },
  { slug: "peter-cox", name: "Peter Cox", handle: "petercoxofficial" },
  { slug: "alison-limerick", name: "Alison Limerick", handle: "alisonlimerick" }
];

const POSTS_PER_ARTIST = 12;
const ACTOR = process.env.APIFY_IG_ACTOR ?? "apify~instagram-scraper";

const OUT_DIR = path.join(process.cwd(), "public", "cache");
const IMG_DIR = path.join(OUT_DIR, "ig");
const MANIFEST = path.join(OUT_DIR, "instagram.json");

await fs.mkdir(IMG_DIR, { recursive: true });

/** Download a URL to a local path. Returns true on success. */
async function downloadImage(url, dest) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    return true;
  } catch (err) {
    console.warn(`  ✗ failed to download ${url}: ${err.message}`);
    return false;
  }
}

/** Extract a safe file extension from a CDN URL (Instagram serves jpg/webp). */
function extFromUrl(url, fallback = "jpg") {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\.(jpg|jpeg|png|webp|gif|mp4)(?:$|\?)/i);
    return m ? m[1].toLowerCase() : fallback;
  } catch {
    return fallback;
  }
}

async function scrapeArtist(target) {
  console.log(`→ ${target.name} (@${target.handle})`);
  const run = await client.actor(ACTOR).call({
    directUrls: [`https://www.instagram.com/${target.handle}/`],
    resultsType: "posts",
    resultsLimit: POSTS_PER_ARTIST,
    searchType: "user",
    searchLimit: 1,
    addParentData: false
  });
  const { items } = await client
    .dataset(run.defaultDatasetId)
    .listItems({ limit: POSTS_PER_ARTIST });

  const posts = [];
  for (const item of items) {
    // Apify's instagram actor fields vary slightly across versions; handle both.
    const shortcode = item.shortCode ?? item.shortcode ?? item.code;
    const permalink =
      item.url ??
      (shortcode ? `https://www.instagram.com/p/${shortcode}/` : null);
    const imgUrl =
      item.displayUrl ??
      item.thumbnailUrl ??
      item.thumbnailSrc ??
      (Array.isArray(item.images) ? item.images[0] : null);
    const timestamp = item.timestamp ?? item.takenAt ?? item.createdAt;
    const type = item.type ?? (item.videoUrl ? "Video" : "Image");

    if (!permalink || !imgUrl) continue;

    const id = shortcode || permalink.split("/").filter(Boolean).pop();
    const ext = extFromUrl(imgUrl);
    const localImageName = `${target.slug}-${id}.${ext}`;
    const localImagePath = path.join(IMG_DIR, localImageName);
    const ok = await downloadImage(imgUrl, localImagePath);
    if (!ok) continue;

    posts.push({
      id,
      artistSlug: target.slug,
      artistName: target.name,
      handle: target.handle,
      permalink,
      publishedAt: timestamp
        ? new Date(timestamp).toISOString()
        : new Date().toISOString(),
      mediaType: type === "Video" ? "video" : "image",
      // Relative path served from /public
      thumbnail: `/cache/ig/${localImageName}`
    });
  }
  console.log(`  ✓ ${posts.length} posts`);
  return posts;
}

async function main() {
  const all = [];
  for (const target of TARGETS) {
    try {
      const posts = await scrapeArtist(target);
      all.push(...posts);
    } catch (err) {
      console.warn(`  ✗ ${target.name}: ${err.message}`);
    }
  }

  all.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Prune images that are no longer referenced
  const keep = new Set(all.map((p) => path.basename(p.thumbnail)));
  const existing = await fs.readdir(IMG_DIR).catch(() => []);
  let pruned = 0;
  for (const f of existing) {
    if (f.startsWith(".")) continue;
    if (!keep.has(f)) {
      await fs.unlink(path.join(IMG_DIR, f)).catch(() => {});
      pruned++;
    }
  }

  await fs.writeFile(
    MANIFEST,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), posts: all },
      null,
      2
    )
  );

  console.log(`\n✓ Wrote ${all.length} posts to public/cache/instagram.json`);
  console.log(`✓ Pruned ${pruned} stale image(s)`);
}

await main();
