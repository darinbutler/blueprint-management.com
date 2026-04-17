import Link from "next/link";
import Image from "next/image";
import type { Artist } from "@/data/artists";

export default function ArtistCard({
  artist,
  imageSrc
}: {
  artist: Artist;
  imageSrc: string;
}) {
  return (
    <Link
      href={`/roster/${artist.slug}`}
      className="group card-editorial block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink">
        <Image
          src={imageSrc}
          alt={`${artist.name} — portrait`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-7">
          <p className="eyebrow text-brand-300">
            {artist.genres.slice(0, 2).join(" · ")}
          </p>
          <h3 className="font-display text-2xl md:text-3xl text-white mt-1 tracking-tight">
            {artist.billing}
          </h3>
        </div>
      </div>
      <div className="p-6 md:p-7">
        <p className="text-sm text-ink-soft leading-relaxed line-clamp-3">
          {artist.tagline}
        </p>
        <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-wider2">
          <span className="text-ink/60">View profile</span>
          <span className="text-brand-600 translate-x-0 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
