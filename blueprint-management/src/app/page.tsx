import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import CTASection from "@/components/CTASection";
import ArtistCard from "@/components/ArtistCard";
import BlogCard from "@/components/BlogCard";
import Marquee from "@/components/Marquee";
import { artists } from "@/data/artists";
import { readFeed } from "@/lib/feeds";
import { imageFor } from "@/lib/assets";

export default async function HomePage() {
  const feed = (await readFeed()).slice(0, 3);

  return (
    <>
      <Hero
        eyebrow="Blueprint Management · Est. 1974"
        title="Careers, not campaigns."
        lede="A boutique artist management company with over 50 years of experience, based in the United Kingdom — representing a select roster of world-class recording artists and the emerging voices who deserve real partnership."
        imageSrc={imageFor("home-hero")}
        imageAlt="Live music festival stage with stage lights and packed crowd"
        primaryCta={{ label: "Enquire with Blueprint", href: "/contact" }}
        secondaryCta={{ label: "Meet the roster", href: "/roster" }}
      />

      <Marquee
        items={[
          "50+ years",
          "Artist-first",
          "UK based · Global roster",
          "Founder-led",
          "Tony Hadley",
          "ABC",
          "Go West",
          "Peter Cox",
          "Alison Limerick",
          "Nik Kershaw"
        ]}
      />

      {/* Value props — dark, atmospheric, venue-like */}
      <section className="relative section bg-ink text-white overflow-hidden">
        {/* Backdrop: festival stage photography, held low so text reads */}
        <div className="absolute inset-0 opacity-25">
          <Image
            src={imageFor("home-hero")}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            aria-hidden
          />
        </div>
        {/* Layered gradients for venue-lighting mood + legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 60% at 20% 0%, rgba(31,86,224,0.25), transparent 60%), radial-gradient(60% 50% at 100% 100%, rgba(75,128,246,0.18), transparent 70%)"
          }}
        />
        <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />

        <div className="container-editorial relative grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brand-300">Why Blueprint</p>
            <h2 className="subhead mt-4 text-white">
              Most artist management is either too small to know the business —
              or too big to know you.
            </h2>
            <p className="body-lg mt-6 text-white/80">
              Blueprint sits deliberately between the vanity agency and the
              hunter-led factory. One founder, one small team, one carefully
              chosen roster — and five decades of navigating every seat at the
              industry table.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="btn border border-white/25 text-white hover:bg-white hover:text-ink"
              >
                What we do
              </Link>
              <Link
                href="/contact"
                className="text-sm text-white/70 hover:text-white self-center pl-2"
              >
                Speak with Matt Glover →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {[
              {
                k: "50+",
                h: "Years in the room",
                p: "From the new-romantic era to streaming-era symphonic tours — the reps, the relationships, the receipts."
              },
              {
                k: "6",
                h: "Artists on the roster",
                p: "Intentionally small. Every artist gets the managing partner, not a pitch deck."
              },
              {
                k: "360°",
                h: "Management model",
                p: "Touring, agency, brand, sync, publishing, PR — coordinated under one partnership."
              },
              {
                k: "UK",
                h: "Global reach",
                p: "London-headquartered. Touring across Europe, North America, Asia-Pacific and Australia."
              }
            ].map((item) => (
              <div
                key={item.h}
                className="relative p-7 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-brand-300/60 hover:bg-white/[0.07] transition-colors"
              >
                <p className="font-display text-5xl text-brand-300">{item.k}</p>
                <h3 className="font-display text-xl mt-3 text-white">
                  {item.h}
                </h3>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                  {item.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roster section */}
      <section className="section bg-canvas-paper border-y border-ink/5">
        <div className="container-editorial">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow">The Blueprint roster</p>
              <h2 className="subhead mt-3">
                Six artists. One standard of care.
              </h2>
            </div>
            <Link
              href="/roster"
              className="btn-ghost whitespace-nowrap hidden md:inline-flex"
            >
              View full roster →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Editorial band — emerging artists */}
      <section className="section">
        <div className="container-editorial grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-editorial">
            <Image
              src={imageFor("emerging-artists")}
              alt="An emerging musician rehearsing in a sunlit studio"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="eyebrow">For emerging artists</p>
            <h2 className="subhead mt-4">
              If you're serious about a career — not a campaign — we should
              talk.
            </h2>
            <p className="body-lg mt-6">
              Most management offers end with a release plan. Blueprint's start
              there. We take on emerging artists we believe in, slowly and
              deliberately, with a five-year horizon and the full weight of a
              fifty-year network behind them.
            </p>
            <ul className="mt-8 space-y-3 text-ink-soft">
              {[
                "Personal mentorship from Matt Glover and the Blueprint partners",
                "Introductions to label, publisher, agent and brand relationships built over 50 years",
                "Strategic career planning — not a release-to-release shuffle",
                "The same standard of management as the artists on our roster"
              ].map((l) => (
                <li key={l} className="flex gap-3">
                  <span className="text-brand-600">◆</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact?subject=Emerging%20artist%20enquiry"
                className="btn-primary"
              >
                Request a conversation
              </Link>
              <Link href="/for-emerging-artists" className="btn-ghost">
                Read the emerging-artist guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Journal preview */}
      <section className="section bg-canvas-paper border-y border-ink/5">
        <div className="container-editorial">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow">The Blueprint Journal</p>
              <h2 className="subhead mt-3">
                Roster news, industry thinking, and management craft.
              </h2>
            </div>
            <Link href="/blog" className="btn-ghost whitespace-nowrap">
              All articles →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feed.map((item) => (
              <BlogCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="A conversation is the first step. The rest follows."
        lede="Whether you're booking an artist on the Blueprint roster, looking for long-term management, or exploring a brand partnership — we'll reply within two business days."
      />
    </>
  );
}
