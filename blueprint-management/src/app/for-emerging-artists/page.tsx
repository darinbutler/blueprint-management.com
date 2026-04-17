import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import CTASection from "@/components/CTASection";
import { imageFor } from "@/lib/assets";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "For Emerging Artists — Trusted Boutique Music Management",
  description:
    "Emerging artist? Blueprint Management takes on a small number of new artists each year. A partnership-first approach to career-building, backed by fifty years of music-industry relationships.",
  keywords: [
    "emerging artist management",
    "new artist management UK",
    "boutique music manager",
    "artist development",
    "music career management"
  ],
  alternates: { canonical: `${siteConfig.url}/for-emerging-artists` }
};

export default function EmergingArtistsPage() {
  return (
    <>
      <Hero
        eyebrow="For Emerging Artists"
        title="You don't need a bigger agency. You need a better one."
        lede="Most management companies are either vanity outfits with limited industry experience, or hunter-led machines whose rosters have outgrown their ability to care. Blueprint sits deliberately between both."
        imageSrc={imageFor("emerging-artists")}
        imageAlt="An emerging musician rehearsing in a sun-drenched studio"
        primaryCta={{ label: "Request a conversation", href: "/contact?subject=Emerging%20artist%20enquiry" }}
        secondaryCta={{ label: "See who we represent", href: "/roster" }}
      />

      <section className="section">
        <div className="container-editorial grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow">Who this page is for</p>
            <h2 className="subhead mt-4">
              Artists who plan in decades. Not in release cycles.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 body-lg">
            <p>
              If you're a serious emerging artist with a clear voice and a
              long-range view of your career, we want to hear from you. Blueprint
              takes on a very small number of new artists each year — carefully,
              intentionally, and only when both sides believe it's a partnership
              that can run for five-plus years.
            </p>
            <p>
              We don't run open A&amp;R funnels. We don't have scouts on
              commission. Matt Glover and the Blueprint partners read every
              enquiry that comes in, and they'll always reply personally — even
              if it's not yet the right fit.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-canvas-paper border-y border-ink/5">
        <div className="container-editorial">
          <p className="eyebrow">What a Blueprint partnership looks like</p>
          <h2 className="subhead mt-3 max-w-3xl">
            Four practical commitments — not a pitch deck.
          </h2>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {[
              {
                h: "A real partner on every call",
                p: "Every artist is worked on directly by a Blueprint partner. You never get passed to a junior, and you never compete for attention against a roster of 50."
              },
              {
                h: "Fifty years of phone numbers",
                p: "Labels, publishers, agents, promoters, sync houses, lawyers, brands — the relationships that move the needle, built over decades."
              },
              {
                h: "Strategy before release",
                p: "We plan the five-year arc before the next single. If the catalogue doesn't earn, the catalogue doesn't serve the career."
              },
              {
                h: "Honest conversations",
                p: "We'll tell you when a release isn't ready, when a deal isn't right, and when the smart play is patience. Real management says 'no' as often as it says 'yes'."
              }
            ].map((x) => (
              <div
                key={x.h}
                className="p-7 rounded-2xl border border-ink/10 bg-canvas"
              >
                <h3 className="font-display text-xl">{x.h}</h3>
                <p className="text-ink-soft mt-3 leading-relaxed">{x.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-editorial grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow">What we look for</p>
            <h2 className="subhead mt-4">
              Not a genre. Not a stream count. A signal.
            </h2>
            <p className="body-lg mt-6">
              Blueprint has never been a genre shop. Our roster spans
              new-romantic pop, art-pop, blue-eyed soul, dance and singer-songwriter
              work — because what we optimise for isn't a sound; it's an artist
              whose work, work-rate and worldview can sustain a long career.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ul className="space-y-5 body-lg">
              {[
                "A clear, recognisable artistic voice",
                "Body of work — even if small — that you can stand behind",
                "Live chops: you know what it feels like to hold a room",
                "Work-rate: you're already moving, even without a team",
                "A realistic, long-range view of the industry"
              ].map((l) => (
                <li key={l} className="flex gap-4">
                  <span className="text-brand-600 mt-2">◆</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact?subject=Emerging%20artist%20enquiry"
                className="btn-primary"
              >
                Send us your music
              </Link>
              <Link href="/about" className="btn-ghost">
                Read about Blueprint →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Think we might be the right fit? Start a conversation."
        lede="Matt and the partners read every enquiry that arrives. Include a link to your music, a sentence on where you are, and what you're looking for."
        ctaLabel="Request a conversation"
        ctaHref="/contact?subject=Emerging%20artist%20enquiry"
      />
    </>
  );
}
