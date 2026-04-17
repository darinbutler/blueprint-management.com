import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import CTASection from "@/components/CTASection";
import { imageFor } from "@/lib/assets";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Legacy — Fifty years of Blueprint Management",
  description:
    "The story of Blueprint Management — founded in 1974 by industry legend John Glover, grown over five decades alongside his wife Julie Glover, son Matt Glover and a tight team of music management experts.",
  alternates: { canonical: `${siteConfig.url}/legacy` }
};

type Milestone = {
  year: string;
  heading: string;
  body: string;
  imageId: string;
  imageAlt: string;
};

const MILESTONES: Milestone[] = [
  {
    year: "1974",
    heading: "John Glover founds Blueprint.",
    body: "Industry legend John Glover opens the doors of Blueprint Management in London with a single principle: manage careers, not campaigns. A tight, artist-first practice in a business increasingly run by committee.",
    imageId: "legacy-1974",
    imageAlt: "A vintage studio reel-to-reel tape machine in soft light"
  },
  {
    year: "Late 1970s",
    heading: "A different kind of agency.",
    body: "While the majors chase hits, Blueprint quietly builds the relationships that matter — with promoters, publishers, press and producers. The model that would define the firm for fifty years is set in its first decade: small roster, deep partnership, long horizon.",
    imageId: "legacy-1980s",
    imageAlt: "Black-and-white archival studio image with microphone and control desk"
  },
  {
    year: "1980s",
    heading: "New Romantic, new heights.",
    body: "The new-wave and New Romantic era brings Blueprint onto the biggest stages in British music. John extends the team and the roster, mentoring a generation of managers who would go on to shape the industry. Julie Glover partners with him across the business — keeping the practice rigorous, human and built to last.",
    imageId: "legacy-1990s",
    imageAlt: "Silhouetted singer on stage at a major concert venue"
  },
  {
    year: "1990s",
    heading: "The second generation arrives.",
    body: "Matt Glover joins the business having grown up inside it — listening to demos in the kitchen, learning the craft from the rooms his father ran. Together, father and son start layering the next chapter of the roster, and Blueprint extends deeper into international touring and catalogue strategy.",
    imageId: "legacy-2000s",
    imageAlt: "Concert crowd with hands raised in a dimly lit venue"
  },
  {
    year: "2000s",
    heading: "A tight team of experts.",
    body: "Blueprint steadily deepens its bench — a small, hand-picked group of music management experts spanning label strategy, sync and rights, agency, legal and press. Every artist on the roster gets a partner, not a pitch deck. The firm deliberately stays small.",
    imageId: "legacy-2010s",
    imageAlt: "Festival stage at dusk with dramatic stage lights"
  },
  {
    year: "2010s",
    heading: "Symphonic tours and streaming-era catalogue.",
    body: "The industry shifts from physical to streaming and back to live. Blueprint's roster navigates both — symphonic headline runs for heritage artists, sync and catalogue deals for the back catalogue, and new-music campaigns built patiently with labels Blueprint has known for decades.",
    imageId: "legacy-2000s",
    imageAlt: "Orchestra on a large concert stage with audience"
  },
  {
    year: "Today",
    heading: "Fifty years. Six artists. One standard.",
    body: "Matt Glover now leads Blueprint with the same principles his father built the practice on. Six recording artists — Tony Hadley, ABC, Go West, Peter Cox, Alison Limerick and Nik Kershaw — worked on directly by Blueprint partners. The next chapter is already being written, quietly and on purpose.",
    imageId: "legacy-today",
    imageAlt: "Artist walking onto a large festival stage surrounded by lights"
  }
];

export default function LegacyPage() {
  return (
    <>
      <Hero
        eyebrow="The Blueprint Legacy"
        title="Fifty years of building careers, not campaigns."
        lede="Blueprint Management was founded in 1974 by industry legend John Glover, and grown over five decades alongside his wife Julie Glover, his son Matt Glover, and a tight team of music management experts. This is the long version of that story."
        imageSrc={imageFor("legacy-hero")}
        imageAlt="Dimly lit archival music studio with vintage equipment"
        primaryCta={{ label: "Meet the roster", href: "/roster" }}
        secondaryCta={{ label: "Speak with Blueprint", href: "/contact" }}
      />

      {/* Founders block */}
      <section className="section bg-canvas">
        <div className="container-editorial grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow">The founders</p>
            <h2 className="subhead mt-4">
              A family practice, built over half a century.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 body-lg">
            <p>
              <strong>John Glover</strong> is a genuine industry legend. He
              spent over fifty years at the centre of British music management
              — the kind of manager who answered his own phone, turned up at
              the soundcheck, and held the artist relationship for decades
              rather than release cycles.
            </p>
            <p>
              He built Blueprint alongside his wife{" "}
              <strong>Julie Glover</strong>, whose clear-eyed judgement and
              care for the artists on the roster are woven into how the firm
              operates. And he brought through his son{" "}
              <strong>Matt Glover</strong>, who grew up in the business and
              now leads it — extending the same standards into a new
              generation of artists, technology and touring.
            </p>
            <p>
              Around the family has always been a deliberately small team of
              music management experts — specialists in agency, label
              strategy, sync, press, legal and tour production — many of whom
              have been with Blueprint for decades. The roster is small by
              design. The bench is deep.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-canvas-paper border-y border-ink/5">
        <div className="container-editorial">
          <div className="max-w-3xl mb-16">
            <p className="eyebrow">The timeline</p>
            <h2 className="subhead mt-3">Five decades, in order.</h2>
          </div>

          <ol className="relative border-l border-ink/15 pl-8 md:pl-12 space-y-16">
            {MILESTONES.map((m) => (
              <li key={m.year} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[41px] md:-left-[49px] top-2 w-3 h-3 rounded-full bg-brand-600 ring-4 ring-canvas-paper"
                />
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5">
                    <p className="eyebrow text-brand-600">{m.year}</p>
                    <h3 className="font-display text-2xl md:text-3xl mt-3 leading-tight">
                      {m.heading}
                    </h3>
                    <p className="body-lg mt-4 text-ink-soft">{m.body}</p>
                  </div>
                  <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-ink">
                      <Image
                        src={imageFor(m.imageId)}
                        alt={m.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        eyebrow="Blueprint today"
        title="Fifty years in. The work keeps going."
        lede="If you'd like to understand how Blueprint can partner with an artist — whether heritage, emerging or mid-career — we'd like to hear from you."
        ctaLabel="Speak with Blueprint"
        ctaHref="/contact"
      />
    </>
  );
}
