/**
 * Resolve image path for a given Gemini prompt id.
 * Falls back to a curated Unsplash URL when no generated asset exists
 * (i.e. the first time the site is deployed before the admin has run
 * POST /api/gemini to produce /public/generated/*.jpg).
 */

const FALLBACKS: Record<string, string> = {
  "home-hero":
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=2400&q=80",
  "home-legacy":
    "https://images.unsplash.com/photo-1458560871784-56d23406c091?auto=format&fit=crop&w=1600&q=80",
  "home-roster-banner":
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2400&q=80",
  "about-hero":
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=2400&q=80",
  "about-story":
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=80",
  "roster-hero":
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=2400&q=80",
  "emerging-artists":
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80",
  "contact-hero":
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=80",
  "blog-hero":
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=2400&q=80",
  "journal-article-fallback":
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1600&q=80",
  // Artist portraits
  "artist-tony-hadley":
    "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80",
  "artist-abc":
    "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?auto=format&fit=crop&w=1200&q=80",
  "artist-go-west":
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
  "artist-peter-cox":
    "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80",
  "artist-alison-limerick":
    "https://images.unsplash.com/photo-1516981879613-9f5da904015f?auto=format&fit=crop&w=1200&q=80"
};

export function assetFor(
  id: string,
  ext: "jpg" | "png" = "jpg"
): string {
  // In production, once Gemini has been run, /public/generated/<id>.<ext>
  // will exist and Next will serve it. We still emit that path here —
  // Next's <Image /> component will 404 if it's missing, so operators
  // should run POST /api/gemini before launch. Use fallback() for Unsplash.
  return `/generated/${id}.${ext}`;
}

export function fallback(id: string): string {
  return FALLBACKS[id] ?? FALLBACKS["journal-article-fallback"]!;
}

/**
 * Returns the preferred image path, with a guarantee that the URL resolves
 * (via Unsplash fallback) even before Gemini has been run.
 *
 * Flag USE_GENERATED=true when /public/generated is populated.
 */
export function imageFor(id: string): string {
  if (process.env.USE_GENERATED === "true") return assetFor(id);
  return fallback(id);
}
