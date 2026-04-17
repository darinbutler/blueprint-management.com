import fs from "node:fs/promises";
import path from "node:path";

/**
 * Commercial-signal reader.
 *
 * Reads public/cache/commercial-signal.json (written by the weekly workflow)
 * and returns a typed per-artist view. Safe fallbacks everywhere: if the
 * manifest is absent, or a given source is null for an artist, the consumer
 * just sees an empty block.
 */

export type SpotifyTrack = {
  name: string;
  url?: string;
  durationMs?: number;
  album?: string;
  albumImage?: string;
};

export type SpotifyRelease = {
  name: string;
  type: "single" | "album" | "compilation" | string;
  releaseDate: string;
  url?: string;
  image?: string;
};

export type SpotifySignal = {
  id: string;
  url: string;
  followers: number | null;
  popularity: number | null;
  topTracks: SpotifyTrack[];
  releases: SpotifyRelease[];
};

export type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  url: string;
  thumbnail?: string;
  views: number | null;
};

export type YouTubeSignal = {
  channelId: string;
  channelTitle?: string;
  url: string;
  subscribers: number | null;
  totalViews: number | null;
  recentVideos: YouTubeVideo[];
};

export type TourEvent = {
  datetime: string;
  venue?: string;
  city?: string;
  region?: string;
  country?: string;
  url?: string;
};

export type ToursSignal = {
  url: string;
  upcomingCount: number;
  events: TourEvent[];
};

export type ArtistSignal = {
  spotify: SpotifySignal | null;
  youtube: YouTubeSignal | null;
  tours: ToursSignal | null;
};

type Manifest = {
  generatedAt: string;
  artists: Record<string, ArtistSignal>;
};

const CACHE_PATH = path.join(
  process.cwd(),
  "public",
  "cache",
  "commercial-signal.json"
);

let cached: Manifest | null | undefined;

async function readManifest(): Promise<Manifest | null> {
  if (cached !== undefined) return cached;
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf8");
    cached = JSON.parse(raw) as Manifest;
  } catch {
    cached = null;
  }
  return cached;
}

export async function getArtistSignal(
  slug: string
): Promise<ArtistSignal | null> {
  const m = await readManifest();
  return m?.artists?.[slug] ?? null;
}

export async function getManifestMeta(): Promise<{
  generatedAt: string | null;
}> {
  const m = await readManifest();
  return { generatedAt: m?.generatedAt ?? null };
}

/** Helper: pick the single most recent release across all configured sources. */
export function latestEvent(
  signal: ArtistSignal | null
): { kind: "release" | "video" | "show"; date: string; label: string } | null {
  if (!signal) return null;
  const items: Array<{
    kind: "release" | "video" | "show";
    date: string;
    label: string;
  }> = [];
  const release = signal.spotify?.releases?.[0];
  if (release) {
    items.push({
      kind: "release",
      date: release.releaseDate,
      label: release.name
    });
  }
  const video = signal.youtube?.recentVideos?.[0];
  if (video) {
    items.push({
      kind: "video",
      date: video.publishedAt,
      label: video.title
    });
  }
  const show = signal.tours?.events?.[0];
  if (show) {
    items.push({
      kind: "show",
      date: show.datetime,
      label: [show.venue, show.city].filter(Boolean).join(", ")
    });
  }
  if (items.length === 0) return null;
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items[0];
}
