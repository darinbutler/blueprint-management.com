import type { Metadata } from "next";
import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import CTASection from "@/components/CTASection";
import { readFeed } from "@/lib/feeds";
import { imageFor } from "@/lib/assets";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Journal — Roster News & Industry Thinking",
  description:
    "The Blueprint Management Journal: live roster news, analysis of the music-manager industry, and long-form thinking for emerging and established artists.",
  alternates: { canonical: `${siteConfig.url}/blog` }
};

export default async function BlogPage() {
  const feed = await readFeed();
  const [featured, ...rest] = feed;

  return (
    <>
      <Hero
        variant="split"
        eyebrow="The Blueprint Journal"
        title="Roster news, industry thinking, management craft."
        lede="Live news about the artists Blueprint represents, analysis of the music-management industry, and long-form thinking written for emerging and established artists."
        imageSrc={imageFor("blog-hero")}
        imageAlt="An editorial still life of notebooks and music industry magazines"
      />

      {featured && (
        <section className="section">
          <div className="container-editorial">
            <p className="eyebrow mb-6">Featured</p>
            <BlogCard item={featured} size="lg" />
          </div>
        </section>
      )}

      <section className="section bg-canvas-paper border-t border-ink/5">
        <div className="container-editorial">
          <div className="flex items-end justify-between gap-6 mb-10">
            <h2 className="subhead">Latest</h2>
            <p className="text-xs text-ink-muted">
              Feed refreshed automatically · Powered by Apify
            </p>
          </div>
          {rest.length === 0 ? (
            <p className="text-ink-soft">
              No articles yet — the feed will populate as soon as the Apify
              refresh runs.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((item) => (
                <BlogCard key={item.slug + item.sourceUrl} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Want to be in the Blueprint Journal?"
        lede="We commission long-form pieces from emerging managers, industry voices and artists on questions of craft. Pitch us via the contact page."
        ctaLabel="Pitch an article"
        ctaHref="/contact?subject=Journal%20pitch"
      />
    </>
  );
}
