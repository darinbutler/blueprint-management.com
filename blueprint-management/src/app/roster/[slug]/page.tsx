import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import CTASection from "@/components/CTASection";
import InlineCTA from "@/components/InlineCTA";
import SocialIcons from "@/components/SocialIcons";
import ArtistSignal from "@/components/ArtistSignal";
import { artists, getArtistBySlug } from "@/data/artists";
import { imageFor } from "@/lib/assets";
import { siteConfig } from "@/data/site";
import { getArtistSignal } from "@/lib/commercialSignal";

export async function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const artist = getArtistBySlug(params.slug);
  if (!artist) return {};
  return {
    title: artist.seo.title,
    description: artist.seo.description,
    keywords: artist.seo.keywords,
    alternates: { canonical: `${siteConfig.url}/roster/${artist.slug}` },
    openGraph: {
      title: artist.seo.title,
      description: artist.seo.description,
      images: [imageFor(`artist-${artist.slug}`)]
    }
  };
}

export default async function ArtistPage({
  params
}: {
  params: { slug: string };
}) {
  const artist = getArtistBySlug(params.slug);
  if (!artist) notFound();
  const signal = await getArtistSignal(params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    description: artist.bio,
    url: `${siteConfig.url}/roster/${artist.slug}`,
    sameAs: [artist.officialUrl, ...artist.socials.map((s) => s.url)],
    genre: artist.genres,
    manager: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    }
  };

  return (
    <>
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="absolute inset-0 opacity-70">
          <Image
            src={imageFor(`artist-${artist.slug}`)}
            alt={`${artist.name} portrait`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        </div>
        <div className="container-editorial relative py-28 md:py-36 max-w-3xl">
          <p className="eyebrow text-brand-300">
            Blueprint Roster · {artist.genres.join(" · ")}
          </p>
          <h1 className="headline mt-4 text-white">{artist.name}</h1>
          <p className="body-lg mt-6 text-white/85">{artist.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/contact?subject=${encodeURIComponent(
                `${artist.name} — enquiry`
              )}`}
              className="btn-primary"
            >
              Enquire about {artist.name}
            </Link>
            <a
              href={artist.officialUrl}
              target="_blank"
              rel="noopener"
              className="btn border border-white/25 text-white hover:bg-white hover:text-ink"
            >
              Official site ↗
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-editorial grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-6 body-lg">
            <p>{artist.bioLong}</p>
            <InlineCTA
              title={`Want to book ${artist.name} or partner on a campaign?`}
              subject={`${artist.name} — enquiry`}
            />
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            <div className="p-7 rounded-2xl border border-ink/10 bg-canvas-paper">
              <h2 className="font-display text-2xl">Career highlights</h2>
              <ul className="mt-5 space-y-3">
                {artist.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm text-ink-soft">
                    <span className="text-brand-600">◆</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-7 rounded-2xl border border-ink/10 bg-canvas-paper">
              <h2 className="font-display text-2xl">At a glance</h2>
              <dl className="mt-5 grid grid-cols-2 gap-y-4 text-sm">
                {artist.hometown && (
                  <>
                    <dt className="text-ink-muted">Based</dt>
                    <dd>{artist.hometown}</dd>
                  </>
                )}
                {artist.activeSince && (
                  <>
                    <dt className="text-ink-muted">Active since</dt>
                    <dd>{artist.activeSince}</dd>
                  </>
                )}
                <dt className="text-ink-muted">Genres</dt>
                <dd>{artist.genres.join(", ")}</dd>
                <dt className="text-ink-muted">Official</dt>
                <dd>
                  <a
                    href={artist.officialUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-brand-600 link-underline"
                  >
                    {artist.officialUrl.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </dl>
              <div className="mt-5">
                <p className="eyebrow text-ink-muted mb-3">Follow</p>
                <SocialIcons socials={artist.socials} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <ArtistSignal signal={signal} artistName={artist.name} />

      <CTASection
        eyebrow={`Book ${artist.name}`}
        title={`Every enquiry for ${artist.name} goes directly to Blueprint.`}
        lede="Tell us about your event, campaign or project. We'll come back within one business day."
        ctaLabel={`Enquire about ${artist.name}`}
        ctaHref={`/contact?subject=${encodeURIComponent(`${artist.name} — enquiry`)}`}
      />

      <Script
        id={`artist-jsonld-${artist.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
