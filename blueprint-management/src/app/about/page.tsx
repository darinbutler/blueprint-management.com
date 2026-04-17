import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import CTASection from "@/components/CTASection";
import { imageFor } from "@/lib/assets";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About Blueprint — 50+ Years of Boutique Artist Management",
  description:
    "Founded in the UK and headed up by global industry veteran Matt Glover, Blueprint Management has spent over fifty years building artist careers with a deliberately small roster and an artist-first partnership model.",
  alternates: { canonical: `${siteConfig.url}/about` }
};

export default function AboutPage() {
  return (
    <>
      <Hero
        variant="split"
        eyebrow="About Blueprint"
        title="Built for careers. Not for quarters."
        lede="Blueprint Management is a UK-headquartered, globally-active artist management company founded in 1974. Headed up by industry veteran Matt Glover, the agency has spent over five decades building world-class careers, one artist at a time."
        imageSrc={imageFor("about-hero")}
        imageAlt="An iconic European stadium at golden hour with an empty stage being set"
        primaryCta={{ label: "Work with us", href: "/contact" }}
        secondaryCta={{ label: "Meet the roster", href: "/roster" }}
      />

      <section className="section">
        <div className="container-editorial grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow">Our story</p>
            <h2 className="subhead mt-4">
              Fifty years in the room. Six artists in the roster.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 body-lg">
            <p>
              Blueprint was founded in 1974 on a simple premise: that the best
              artist management happens when a manager can still name every
              relationship on an artist's balance sheet — and still be the one
              to pick up the phone. Half a century later, that principle hasn't
              shifted.
            </p>
            <p>
              From the new-romantic era to the streaming economy, Blueprint has
              worked across every seat at the industry table — labels,
              publishers, agents, promoters, sync houses, lawyers, brand
              partners — building the kind of long-horizon relationships that
              only a boutique agency can maintain, for artists whose careers
              span decades, not album cycles.
            </p>
            <p>
              Blueprint was founded in 1974 by industry legend{" "}
              <strong>John Glover</strong>, who grew the business for over
              fifty years alongside his wife <strong>Julie Glover</strong> and
              son <strong>Matt Glover</strong>, with a tight team of music
              management experts. Today, headed up by Matt, Blueprint
              exclusively represents a carefully chosen roster of recording
              artists for management and agency:{" "}
              <strong>Alison Limerick</strong>,{" "}
              <strong>Tony Hadley (ex-Spandau Ballet)</strong>,{" "}
              <strong>ABC</strong>, <strong>Go West</strong>,{" "}
              <strong>Peter Cox</strong> and <strong>Nik Kershaw</strong>.
            </p>
          </div>
        </div>
      </section>

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
            <p className="eyebrow">Founder &amp; managing partner</p>
            <h2 className="subhead mt-4">John Glover &middot; Matt Glover</h2>
            <p className="body-lg mt-6">
              <strong>John Glover</strong> founded Blueprint in 1974 and spent
              the next five decades building a boutique artist management
              practice rooted in long-horizon relationships — a standard that
              still defines the firm today. A genuine industry legend, John
              grew Blueprint alongside his wife{" "}
              <strong>Julie Glover</strong> and a tight team of music
              management experts who joined the practice over the years.
            </p>
            <p className="body-lg mt-4">
              Today, Blueprint is led by his son{" "}
              <strong>Matt Glover</strong>, who has spent his working life in
              and around British popular music — from first-demo listening
              sessions through to stadium routings, label acquisitions,
              arena-tour settlements and legacy-catalogue deals. Every artist
              on the Blueprint roster is worked on directly by a Blueprint
              partner — never a junior, never a hunter, never a number on a
              board.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact?subject=Speak%20with%20Matt%20Glover"
                className="btn-primary"
              >
                Speak with Matt
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section">
        <div className="container-editorial">
          <p className="eyebrow">The Blueprint principles</p>
          <h2 className="subhead mt-4 max-w-3xl">
            Four ideas that have kept the roster small — and the relationships
            long.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                n: "01",
                h: "Partnership over pitch",
                p: "We don't hunt. If the relationship isn't five-year right, it isn't right."
              },
              {
                n: "02",
                h: "Founder-led",
                p: "Every artist is worked on directly by a Blueprint partner. No junior hand-off."
              },
              {
                n: "03",
                h: "Small on purpose",
                p: "Roster caps exist so every artist gets the time and attention a career demands."
              },
              {
                n: "04",
                h: "Career, not campaign",
                p: "We plan in decades, not in release cycles. It's why our artists stay."
              }
            ].map((x) => (
              <div
                key={x.n}
                className="p-7 rounded-2xl border border-ink/10 bg-canvas-paper"
              >
                <p className="font-display text-4xl text-brand-600">{x.n}</p>
                <h3 className="font-display text-xl mt-3">{x.h}</h3>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                  {x.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="The next fifty years of Blueprint starts with one conversation."
        lede="Matt and the partners read every enquiry that arrives. If Blueprint is the right fit, we'll reply within two business days."
      />
    </>
  );
}
