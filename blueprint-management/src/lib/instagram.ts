import fs from "node:fs/promises";
import path from "node:path";

/**
 * Instagram activity reader.
 *
 * At build time, reads public/cache/instagram.json (populated by
 * scripts/refresh-instagram.mjs, run weekly by GitHub Actions).
 *
 * Returns an empty array if the cache isn't populated yet — the UI
 * handles that with a graceful empty state so the build never breaks.
 */

export type InstagramPost = {
  id: string;
  artistSlug: string;
  artistName: string;
  handle: string;
  permalink: string;
  publishedAt: string;
  mediaType: "image" | "video";
  /** Path under /public — e.g. /cache/ig/tony-hadley-XYZ.jpg */
  thumbnail: string;
};

type Manifest = {
  generatedAt: string;
  posts: InstagramPost[];
};

const CACHE_PATH = path.join(
  process.cwd(),
  "public",
  "cache",
  "instagram.json"
);

export async function readInstagramFeed(): Promise<InstagramPost[]> {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf8");
    const data = JSON.parse(raw) as Manifest;
    return [...data.posts].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function readInstagramManifest(): Promise<Manifest | null> {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf8");
    return JSON.parse(raw) as Manifest;
  } catch {
    return null;
  }
}
