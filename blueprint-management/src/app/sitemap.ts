import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { artists } from "@/data/artists";
import { readFeed } from "@/lib/feeds";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const lastmod = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/roster",
    "/contact",
    "/blog",
    "/for-emerging-artists",
    "/privacy",
    "/terms",
    "/cookies"
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: lastmod,
    changeFrequency: p === "/" || p === "/blog" ? "weekly" : "monthly",
    priority: p === "/" ? 1.0 : p.startsWith("/roster") ? 0.9 : 0.7
  }));

  const artistRoutes: MetadataRoute.Sitemap = artists.map((a) => ({
    url: `${base}/roster/${a.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly",
    priority: 0.85
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const feed = await readFeed();
    blogRoutes = feed
      .filter((f) => !f.sourceUrl) // only own posts, not external links
      .map((f) => ({
        url: `${base}/blog/${f.slug}`,
        lastModified: f.publishedAt ? new Date(f.publishedAt) : lastmod,
        changeFrequency: "monthly",
        priority: 0.6
      }));
  } catch {
    // ignore
  }

  return [...staticRoutes, ...artistRoutes, ...blogRoutes];
}
