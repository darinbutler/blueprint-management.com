import Image from "next/image";
import type { ArtistSignal as ArtistSignalT } from "@/lib/commercialSignal";

/**
 * Per-artist "What's happening now" block.
 *
 * Shows three vertical columns — Releases / Videos / Tour dates — based on
 * whatever we have cached. Hidden entirely when no sources have data,
 * so the profile stays clean before the first refresh.
 */
export default function ArtistSignal({
  signal,
  artistName
}: {
  signal: ArtistSignalT | null;
  artistName: string;
}) {
  if (!signal) return null;
  const hasAny =
    (signal.spotify && (signal.spotify.releases.length > 0 || signal.spotify.topTracks.length > 0)) ||
    (signal.youtube && signal.youtube.recentVideos.length > 0) ||
    (signal.tours && signal.tours.events.length > 0);
  if (!hasAny) return null;

  return (
    <section className="relative section bg-ink text-white overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            "radial-gradient(50% 100% at 20% 0%, rgba(31,86,224,0.22), transparent 60%), radial-gradient(40% 100% at 85% 100%, rgba(75,128,246,0.18), transparent 70%)"
        }}
      />
      <div className="absolute inset-0 grain-overlay opacity-40 pointer-events-none" />

      <div className="container-editorial relative">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow text-brand-300">What&apos;s happening now</p>
            <h2 className="subhead mt-3 text-white max-w-2xl">
              {artistName} — in release, on screen and on stage.
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Releases */}
          <SignalColumn
            title="Latest releases"
            source="Spotify"
            sourceUrl={signal.spotify?.url}
            stat={
              signal.spotify?.followers != null
                ? `${compactNumber(signal.spotify.followers)} followers`
                : undefined
            }
          >
            {signal.spotify?.releases?.length ? (
              <ul className="space-y-4">
                {signal.spotify.releases.slice(0, 4).map((r) => (
                  <li key={r.url ?? r.name}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 items-center group"
                    >
                      {r.image && (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                          <Image
                            src={r.image}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-display text-base text-white group-hover:text-brand-300 transition-colors truncate">
                          {r.name}
                        </p>
                        <p className="text-xs uppercase tracking-wider2 text-white/50 mt-0.5">
                          {r.type} · {formatDate(r.releaseDate)}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyNote text="No recent releases cached yet." />
            )}
          </SignalColumn>

          {/* Videos */}
          <SignalColumn
            title="Recent videos"
            source="YouTube"
            sourceUrl={signal.youtube?.url}
            stat={
              signal.youtube?.subscribers != null
                ? `${compactNumber(signal.youtube.subscribers)} subscribers`
                : undefined
            }
          >
            {signal.youtube?.recentVideos?.length ? (
              <ul className="space-y-4">
                {signal.youtube.recentVideos.slice(0, 3).map((v) => (
                  <li key={v.id}>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      {v.thumbnail && (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                          <Image
                            src={v.thumbnail}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        </div>
                      )}
                      <p className="font-display text-base text-white group-hover:text-brand-300 transition-colors mt-3 line-clamp-2">
                        {v.title}
                      </p>
                      <p className="text-xs uppercase tracking-wider2 text-white/50 mt-1">
                        {formatDate(v.publishedAt)}
                        {v.views != null && ` · ${compactNumber(v.views)} views`}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyNote text="No recent videos cached yet." />
            )}
          </SignalColumn>

          {/* Tours */}
          <SignalColumn
            title="Upcoming shows"
            source="Bandsintown"
            sourceUrl={signal.tours?.url}
            stat={
              signal.tours?.upcomingCount
                ? `${signal.tours.upcomingCount} upcoming`
                : undefined
            }
          >
            {signal.tours?.events?.length ? (
              <ul className="space-y-4">
                {signal.tours.events.slice(0, 5).map((e) => (
                  <li key={e.url ?? e.datetime}>
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 items-start group"
                    >
                      <time
                        dateTime={e.datetime}
                        className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex-shrink-0"
                      >
                        <span className="text-[10px] uppercase tracking-wider2 text-white/50">
                          {monthShort(e.datetime)}
                        </span>
                        <span className="font-display text-lg text-white leading-none">
                          {day(e.datetime)}
                        </span>
                      </time>
                      <div className="min-w-0">
                        <p className="font-display text-base text-white group-hover:text-brand-300 transition-colors truncate">
                          {e.venue ?? "Show"}
                        </p>
                        <p className="text-xs text-white/60 mt-0.5 truncate">
                          {[e.city, e.country].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyNote text="No upcoming shows listed." />
            )}
          </SignalColumn>
        </div>
      </div>
    </section>
  );
}

// ─────────── Subcomponents ───────────

function SignalColumn({
  title,
  source,
  sourceUrl,
  stat,
  children
}: {
  title: string;
  source: string;
  sourceUrl?: string;
  stat?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-7">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="font-display text-xl text-white">{title}</h3>
          {stat && (
            <p className="text-xs uppercase tracking-wider2 text-brand-300 mt-1">
              {stat}
            </p>
          )}
        </div>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-wider2 text-white/50 hover:text-white whitespace-nowrap"
          >
            {source} ↗
          </a>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <p className="text-sm text-white/50">{text}</p>;
}

// ─────────── Formatting helpers ───────────

function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return iso;
  }
}

function monthShort(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  } catch {
    return "";
  }
}

function day(iso: string): string {
  try {
    return String(new Date(iso).getDate());
  } catch {
    return "";
  }
}
