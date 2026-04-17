import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ArtistCard from "@/components/ArtistCard";
import CTASection from "@/components/CTASection";
import { artists } from "@/data/artists";
import { imageFor } from "@/lib/assets";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Roster — The Blueprint Artists",
  description:
    "Blueprint Management exclusively represents Alison Limerick, Tony Hadley (ex-Spandau Ballet), ABC, Go West and Peter Cox for worldwide management, touring and agency.",
  alternates: { canonical: `${siteConfig.url}/roster` }
};

export default function RosterPage() {
  return (
    <>
      <Hero
        eyebrow="The Blueprint Roster"
        title="Six artists. Decades of catalogue."
        lede="Blueprint exclusively represents the following recording artists for worldwide management, touring and agency."
        imageSrc={imageFor("roster-hero")}
        imageAlt="Backstage corridor with dressing room doors in a venue"
        primaryCta={{ label: "Book a Blueprint artist", href: "/contact?subject=Artist%20booking%20enquiry" }}
        align="left"
      />

      <section className="section">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.slug}
                artist={artist}
                imageSrc={imageFor(`artist-${artist.slug}`)}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Interested in booking or partnering with a Blueprint artist?"
        lede="Every artist on the roster is booked directly through Blueprint. Send us an enquiry and we'll route it to the right partner within one business day."
        ctaLabel="Start an enquiry"
      />
    </>
  );
}
