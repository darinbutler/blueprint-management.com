#!/usr/bin/env node
/**
 * Commercial-signal refresher.
 *
 * For each roster artist, pulls:
 *   - Spotify: top tracks, most recent releases (singles + albums), follower count.
 *   - YouTube: most recent uploads + channel subscriber count.
 *   - Bandsintown: upcoming tour dates.
 *
 * Writes one consolidated manifest at public/cache/commercial-signal.json.
 *
 * Each source is independent — if a secret is missing, we log and skip that
 * source for all artists. A missing source just means that tile disappears
 * from the UI; the rest of the page keeps working.
 *
 * Required secrets (configure in GitHub Actions):
 *   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET — Spotify Web API
 *   YOUTUBE_API_KEY                          — YouTube Data API v3
 *   TICKETMASTER_API_KEY                     — Ticketmaster Discovery API
 *
 * Usage:
 *   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... YOUTUBE_API_KEY=... \
 *     TICKETMASTER_API_KEY=... node scripts/refresh-commercial-signal.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "cache");
const MANIFEST = path.join(OUT_DIR, "commercial-signal.json");

const SPOTIFY_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const YT_KEY = process.env.YOUTUBE_API_KEY;
const TM_KEY = process.env.TICKETMASTER_API_KEY;

/**
 * Roster targets. Only the artist name is required — the script resolves
 * Spotify and YouTube IDs via search. For artists where search is ambiguous
 * (common names, or a different artist dominates the results), hard-pin the
 * ID by setting `spotifyId` / `youtubeChannelId`.
 */
const ARTISTS = [
  {
    slug: "tony-hadley",
    name: "Tony Hadley",
    spotifyId: null,
    youtubeChannelId: null,
    tmKeyword: "Tony Hadley"
  },
  {
    slug: "abc",
    name: "ABC Martin Fry",
    spotifyId: null,
    youtubeChannelId: null,
    tmKeyword: "ABC Martin Fry"
  },
  {
    slug: "go-west",
    name: "Go West",
    spotifyId: null,
    youtubeChannelId: null,
    tmKeyword: "Go West"
  },
  {
    slug: "peter-cox",
    name: "Peter Cox",
    spotifyId: null,
    youtubeChannelId: null,
    tmKeyword: "Peter Cox"
  },
  {
    slug: "alison-limerick",
    name: "Alison Limerick",
    spotifyId: null,
    youtubeChannelId: null,
    tmKeyword: "Alison Limerick"
  },
  {
    slug: "nik-kershaw",
    name: "Nik Kershaw",
    // Pinned from artists.ts socials
    spotifyId: "3clCGBq4ydKWRyFmIEgwGr",
    youtubeChannelId: null,
    tmKeyword: "Nik Kershaw"
  }
];

// ───────────────── Spotify ─────────────────

let spotifyToken = null;
async function spotifyAuth() {
  if (!SPOTIFY_ID || !SPOTIFY_SECRET) return null;
  if (spotifyToken) return spotifyToken;
  const basic = Buffer.from(`${SPOTIFY_ID}:${SPOTIFY_SECRET}`).toString(
    "base64"
  );
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  if (!res.ok) {
    console.warn(`  ✗ Spotify auth: ${res.status}`);
    return null;
  }
  const j = await res.json();
  spotifyToken = j.access_token;
  return spotifyToken;
}

async function spotifyGet(pathAndQuery) {
  const t = await spotifyAuth();
  if (!t) return null;
  const res = await fetch(`https://api.spotify.com/v1${pathAndQuery}`, {
    headers: { Authorization: `Bearer ${t}` }
  });
  if (!res.ok) {
    console.warn(`  ✗ Spotify ${pathAndQuery}: ${res.status}`);
    return null;
  }
  return res.json();
}

async function spotifyResolveId(name) {
  const j = await spotifyGet(
    `/search?type=artist&limit=1&q=${encodeURIComponent(name)}`
  );
  return j?.artists?.items?.[0]?.id ?? null;
}

async function spotifyForArtist(artist) {
  if (!SPOTIFY_ID || !SPOTIFY_SECRET) return null;
  const id = artist.spotifyId ?? (await spotifyResolveId(artist.name));
  if (!id) return null;
  const [profile, top, albums] = await Promise.all([
    spotifyGet(`/artists/${id}`),
    spotifyGet(`/artists/${id}/top-tracks?market=GB`),
    spotifyGet(
      `/artists/${id}/albums?include_groups=single,album&market=GB&limit=6`
    )
  ]);
  return {
    id,
    url: `https://open.spotify.com/artist/${id}`,
    followers: profile?.followers?.total ?? null,
    popularity: profile?.popularity ?? null,
    topTracks:
      top?.tracks?.slice(0, 5).map((t) => ({
        name: t.name,
        url: t.external_urls?.spotify,
        durationMs: t.duration_ms,
        album: t.album?.name,
        albumImage: t.album?.images?.[0]?.url
      })) ?? [],
    releases:
      albums?.items?.slice(0, 4).map((a) => ({
        name: a.name,
        type: a.album_type,
        releaseDate: a.release_date,
        url: a.external_urls?.spotify,
        image: a.images?.[0]?.url
      })) ?? []
  };
}

// ───────────────── YouTube ─────────────────

async function ytGet(pathAndQuery) {
  if (!YT_KEY) return null;
  const sep = pathAndQuery.includes("?") ? "&" : "?";
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3${pathAndQuery}${sep}key=${YT_KEY}`
  );
  if (!res.ok) {
    console.warn(`  ✗ YouTube ${pathAndQuery}: ${res.status}`);
    return null;
  }
  return res.json();
}

async function ytResolveChannelId(name) {
  const j = await ytGet(
    `/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(
      name
    )}`
  );
  return j?.items?.[0]?.id?.channelId ?? null;
}

async function youtubeForArtist(artist) {
  if (!YT_KEY) return null;
  const channelId =
    artist.youtubeChannelId ?? (await ytResolveChannelId(artist.name));
  if (!channelId) return null;
  const chan = await ytGet(
    `/channels?part=contentDetails,statistics,snippet&id=${channelId}`
  );
  const c = chan?.items?.[0];
  if (!c) return null;
  const uploadsPlaylist = c.contentDetails?.relatedPlaylists?.uploads;
  const uploads = uploadsPlaylist
    ? await ytGet(
        `/playlistItems?part=snippet,contentDetails&maxResults=4&playlistId=${uploadsPlaylist}`
      )
    : null;
  const videoIds =
    uploads?.items?.map((it) => it.contentDetails.videoId).filter(Boolean) ??
    [];
  const stats = videoIds.length
    ? await ytGet(`/videos?part=statistics,snippet&id=${videoIds.join(",")}`)
    : null;
  return {
    channelId,
    channelTitle: c.snippet?.title,
    url: `https://www.youtube.com/channel/${channelId}`,
    subscribers: Number(c.statistics?.subscriberCount ?? 0) || null,
    totalViews: Number(c.statistics?.viewCount ?? 0) || null,
    recentVideos:
      stats?.items?.map((v) => ({
        id: v.id,
        title: v.snippet?.title,
        publishedAt: v.snippet?.publishedAt,
        url: `https://www.youtube.com/watch?v=${v.id}`,
        thumbnail:
          v.snippet?.thumbnails?.medium?.url ??
          v.snippet?.thumbnails?.default?.url,
        views: Number(v.statistics?.viewCount ?? 0) || null
      })) ?? []
  };
}

// ───────────────── Ticketmaster Discovery ─────────────────

async function tmForArtist(artist) {
  if (!TM_KEY) return null;
  try {
    const url =
      `https://app.ticketmaster.com/discovery/v2/events.json` +
      `?keyword=${encodeURIComponent(artist.tmKeyword)}` +
      `&classificationName=music` +
      `&size=10&sort=date,asc` +
      `&apikey=${encodeURIComponent(TM_KEY)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ✗ Ticketmaster ${artist.name}: ${res.status}`);
      return null;
    }
    const j = await res.json();
    const events = j?._embedded?.events ?? [];
    const filtered = events.filter((e) => {
      // Match artist name against returned attractions to filter unrelated bookings
      const names =
        e?._embedded?.attractions?.map((a) =>
          String(a?.name ?? "").toLowerCase()
        ) ?? [];
      const needle = artist.tmKeyword.toLowerCase();
      return names.some(
        (n) =>
          n === needle ||
          n.includes(needle) ||
          needle.includes(n)
      );
    });
    const pool = filtered.length ? filtered : events;
    return {
      url: `https://www.ticketmaster.com/search?q=${encodeURIComponent(
        artist.tmKeyword
      )}`,
      upcomingCount: pool.length,
      events: pool.slice(0, 6).map((e) => {
        const v = e?._embedded?.venues?.[0];
        const start = e?.dates?.start;
        return {
          datetime: start?.dateTime ?? `${start?.localDate}T${start?.localTime ?? "00:00:00"}`,
          venue: v?.name,
          city: v?.city?.name,
          region: v?.state?.name ?? v?.state?.stateCode,
          country: v?.country?.name ?? v?.country?.countryCode,
          url: e.url
        };
      })
    };
  } catch (err) {
    console.warn(`  ✗ Ticketmaster ${artist.name}: ${err.message}`);
    return null;
  }
}

// ───────────────── Main ─────────────────

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  console.log("Sources available:");
  console.log(`  Spotify:      ${SPOTIFY_ID ? "✓" : "skip (no creds)"}`);
  console.log(`  YouTube:      ${YT_KEY ? "✓" : "skip (no creds)"}`);
  console.log(`  Ticketmaster: ${TM_KEY ? "✓" : "skip (no creds)"}`);
  console.log();

  const out = {};
  for (const a of ARTISTS) {
    console.log(`→ ${a.name}`);
    const [spotify, youtube, tours] = await Promise.all([
      spotifyForArtist(a).catch((e) => {
        console.warn(`  ✗ spotify: ${e.message}`);
        return null;
      }),
      youtubeForArtist(a).catch((e) => {
        console.warn(`  ✗ youtube: ${e.message}`);
        return null;
      }),
      tmForArtist(a).catch((e) => {
        console.warn(`  ✗ ticketmaster: ${e.message}`);
        return null;
      })
    ]);
    out[a.slug] = { spotify, youtube, tours };
    const tally = [];
    if (spotify) tally.push(`spotify(${spotify.releases.length} releases)`);
    if (youtube)
      tally.push(`youtube(${youtube.recentVideos.length} videos)`);
    if (tours) tally.push(`tours(${tours.upcomingCount})`);
    console.log(`  ✓ ${tally.join(", ") || "no data"}`);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    artists: out
  };
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Wrote ${MANIFEST}`);
}

await main();
