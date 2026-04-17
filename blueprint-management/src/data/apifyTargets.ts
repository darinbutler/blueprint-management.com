/**
 * Apify target configurations — two use cases:
 *
 *  1. Competitor scraping (one-off / refresh-on-demand) — informs IA, navigation,
 *     content categories. Output lives in /public/cache/competitors.json.
 *
 *  2. Content feeds (cached, refreshable) — pulls news + social mentions about the
 *     roster and the wider industry. Output lives in /public/cache/feeds.json
 *     and drives the /blog index.
 */

export const competitorTargets = [
  {
    id: "xtreme-talent",
    name: "Xtreme Talent Agency",
    url: "https://www.xtremetalentagency.com/",
    selectors: {
      nav: "nav a, header a",
      categories: "main h1, main h2, main h3",
      hero: "section:first-of-type h1, section:first-of-type p"
    }
  },
  {
    id: "sound-artist-mgmt",
    name: "Sound Artist Management",
    url: "https://soundartistmanagement.com/",
    selectors: {
      nav: "nav a, header a",
      categories: "main h1, main h2, main h3",
      hero: "section:first-of-type h1, section:first-of-type p"
    }
  },
  {
    id: "various-artists-mgmt",
    name: "Various Artists Management",
    url: "https://variousartistsmanagement.com/",
    selectors: {
      nav: "nav a, header a",
      categories: "main h1, main h2, main h3",
      hero: "section:first-of-type h1, section:first-of-type p"
    }
  },
  {
    id: "authority-mgmt",
    name: "Authority Management",
    url: "https://www.authoritymgmt.com/",
    selectors: {
      nav: "nav a, header a",
      categories: "main h1, main h2, main h3",
      hero: "section:first-of-type h1, section:first-of-type p"
    }
  },
  {
    id: "uta-brands",
    name: "UTA Brands",
    url: "https://www.unitedtalent.com/brands",
    selectors: {
      nav: "nav a, header a",
      categories: "main h1, main h2, main h3",
      hero: "section:first-of-type h1, section:first-of-type p"
    }
  }
] as const;

export const feedTargets = [
  // Google News queries (run via google-news-scraper)
  { type: "google-news", query: "Tony Hadley" },
  { type: "google-news", query: "Spandau Ballet" },
  { type: "google-news", query: "ABC Martin Fry" },
  { type: "google-news", query: "Go West band tour" },
  { type: "google-news", query: "Alison Limerick house music" },
  { type: "google-news", query: "Nik Kershaw" },
  { type: "google-news", query: "music manager industry UK" },
  // Industry-body RSS
  { type: "rss", url: "https://themmf.net/feed/" },
  { type: "rss", url: "https://www.ukmusic.org/feed/" }
] as const;

export type CompetitorTarget = (typeof competitorTargets)[number];
export type FeedTarget = (typeof feedTargets)[number];
