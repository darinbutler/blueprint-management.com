import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import CTASection from "@/components/CTASection";
import { imageFor } from "@/lib/assets";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About Blueprint — Boutique Artist Management, Done Properly",
  description:
    "Blueprint is a UK boutique artist management company. What we do, how we do it, and why fifty years of doing it means we tend to see the obstacles before they arrive.",
  alternates: { canonical: `${siteConfig.url}/about` }
};

export default function AboutPage() {
  return (
    <>
      <Hero
        variant="split"
        eyebrow="About Blueprint"
        title="What we do. Why we do it."
        lede="Blueprint is a UK boutique artist management company. We take a small, deliberately chosen roster of recording artists and build careers around them — across touring, label and publishing strategy, brand and sync, and the thousand small decisions that only matter if you care about the fifty-year picture."
        imageSrc={imageFor("about-hero")}
        imageAlt="An iconic European stadium at golden hour with an empty stage being set"
        primaryCta={{ label: "Work with us", href: "/contact" }}
        secondaryCta={{ label: "Our legacy", href: "/legacy" }}
      />

      {/* What we do */}
      <section className="section">
        <div className="container-editorial grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow">What Blueprint does</p>
            <h2 className="subhead mt-4">
              Full-service artist management, for artists whose careers span
              decades rather than release cycles.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 body-lg">
            <p>
              On the surface, Blueprint is a traditional boutique management
              company: we represent a small roster of recording artists, and
              we hold the strategy, the diary and the relationships that
              carry a career forward. Underneath, the work is unglamorous and
              detailed — and that is precisely the point.
            </p>
            <p>
              A Blueprint engagement spans touring strategy and routing,
              agency and promoter relationships, label and publishing deals,
              sync and catalogue exploitation, brand partnerships, press and
              PR, studio and A&amp;R, rights and royalty oversight, and the
              quiet day-to-day administration that actually keeps a working
              artist working. No one thing on that list is remarkable. The
              work is in holding all of it, at once, consistently, for the
              same artist, over years.
            </p>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="section bg-canvas-paper border-y border-ink/5">
        <div className="container-editorial grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow">Why it&apos;s different</p>
            <h2 className="subhead mt-4">
              Most artist management is either too small to know the business
              &mdash; or too big to know you.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 body-lg">
            <p>
              Large agencies are built for throughput. They sign widely,
              staff junior, and live or die on a handful of stadium acts
              subsidising a long tail of ignored clients. Bedroom managers
              are often sincere but quickly out of their depth the moment a
              tour is cross-border, a publishing deal has reversions, or a
              sync opportunity lands on a deadline.
            </p>
            <p>
              Blueprint sits deliberately between the two. A small, chosen
              roster. A senior-led team. Every artist worked on directly by
              a Blueprint partner &mdash; never a junior, never a hunter,
              never a number on a board. It is not scalable by design. That
              is the point.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="section">
        <div className="container-editorial">
          <p className="eyebrow">Expertise</p>
          <h2 className="subhead mt-4 max-w-3xl">
            Deep specialism across every seat at the industry table.
          </h2>
          <p className="body-lg mt-5 max-w-3xl text-ink-soft">
            Blueprint is small, but the bench is deep. Around the Glover
            family sits a long-standing team of music management experts,
            many of whom have been with the practice for decades. Between
            them, the room covers:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              {
                n: "01",
                h: "Touring &amp; agency",
                p: "Worldwide routing, promoter relationships, symphonic and festival headline strategy, arena-tour settlement and contracting."
              },
              {
                n: "02",
                h: "Label &amp; publishing",
                p: "Major and indie deals, rights reversion, catalogue acquisition, publishing administration and audit."
              },
              {
                n: "03",
                h: "Sync &amp; brand",
                p: "Film, TV, advertising and game placements; brand partnerships that protect the artist&apos;s story, not dilute it."
              },
              {
                n: "04",
                h: "Studio &amp; A&amp;R",
                p: "Producer and co-writer introductions, studio selection, budgeting, A&amp;R input from demo through to master."
              },
              {
                n: "05",
                h: "Press, PR &amp; digital",
                p: "Campaign planning, journalist relationships built over decades, social and streaming strategy that serves the long view."
              },
              {
                n: "06",
                h: "Legal, rights &amp; royalties",
                p: "Contract review with trusted external counsel, neighbouring rights collection, PRS/MCPS oversight, estate planning."
              }
            ].map((x) => (
              <div
                key={x.n}
                className="p-7 rounded-2xl border border-ink/10 bg-canvas-paper"
              >
                <p className="font-display text-4xl text-brand-600">{x.n}</p>
                <h3
                  className="font-display text-xl mt-3"
                  dangerouslySetInnerHTML={{ __html: x.h }}
                />
                <p
                  className="text-sm text-ink-soft mt-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: x.p }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience + Foresight */}
      <section className="section bg-canvas-paper border-y border-ink/5">
        <div className="container-editorial grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[5/4] rounded-2xl overflow-hidden shadow-editorial">
            <Image
              src={imageFor("about-story")}
              alt="A classic London recording studio environment"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="eyebrow">Experience &amp; foresight</p>
            <h2 className="subhead mt-4">
              We tend to see the obstacles before they arrive.
            </h2>
            <p className="body-lg mt-6">
              Fifty years in this business means Blueprint has handled
              essentially every scenario an artist career will throw at a
              manager &mdash; <strong>on tour</strong>, in the{" "}
              <strong>studio</strong>, and in the quiet{" "}
              <strong>day-to-day</strong> of running a working career.
              Promoter collapses, visa holds, border tax shocks, sync
              deadlines that land on a bank holiday, master tapes that
              don&apos;t arrive, mechanical royalty disputes, labels
              restructuring mid-campaign, catalogue opportunities that need
              a decision by end of business Friday.
            </p>
            <p className="body-lg mt-4">
              The value of that experience is not that it makes us faster
              when things go wrong. It is that it lets us see things coming.
              A typical Blueprint week is as much about adjustments we make
              quietly, weeks ahead of a problem, as it is about the
              headline wins. That foresight is the single hardest thing to
              buy in the industry. It cannot be hired at speed. It is built
              in the rooms, over years.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section">
        <div className="container-editorial grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow">Leadership</p>
            <h2 className="subhead mt-4">
              A family practice. A tight team of experts.
            </h2>
            <p className="body-lg mt-6 text-ink-soft">
              Blueprint was founded in 1974 by{" "}
              <strong>John Glover</strong> and grown over five decades
              alongside his wife <strong>Julie Glover</strong> and their
              son <strong>Matt Glover</strong>. Today Matt leads the
              practice with a long-standing partner team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/legacy" className="btn-secondary">
                Read the full story
              </Link>
              <Link
                href="/contact?subject=Speak%20with%20Matt%20Glover"
                className="btn-ghost"
              >
                Speak with Matt &rarr;
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {[
              {
                k: "50+",
                h: "Years in the room",
                p: "From new-romantic-era chart campaigns to streaming-era symphonic tours."
              },
              {
                k: "6",
                h: "Artists on the roster",
                p: "Intentionally small. Every artist worked on directly by a Blueprint partner."
              },
              {
                k: "360\u00b0",
                h: "Management model",
                p: "Touring, label, publishing, sync, brand, rights &mdash; held in one practice."
              },
              {
                k: "1",
                h: "Phone to pick up",
                p: "When it&apos;s urgent, an artist gets a Blueprint partner directly. Not a junior."
              }
            ].map((x) => (
              <div
                key={x.h}
                className="p-6 rounded-2xl border border-ink/10 bg-canvas-paper"
              >
                <p className="font-display text-5xl text-brand-600">{x.k}</p>
                <h3 className="font-display text-lg mt-2">{x.h}</h3>
                <p
                  className="text-sm text-ink-soft mt-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: x.p }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="The next fifty years of Blueprint starts with one conversation."
        lede="Matt and the partners read every enquiry that arrives. If Blueprint is the right fit, we'll reply within two business days."
        ctaLabel="Speak with Blueprint"
        ctaHref="/contact"
      />
    </>
  );
}
