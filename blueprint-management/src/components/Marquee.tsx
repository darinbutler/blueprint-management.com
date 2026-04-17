import Link from "next/link";

export type MarqueeItem =
  | string
  | { type?: "tag" | "artist"; text: string; href?: string };

/**
 * Dark, venue-marquee style ticker.
 *
 * - Tag items: small uppercase caps, tracked, muted white.
 * - Artist items: display italic, slightly brighter, optionally linked.
 * - Pulsing LED dots between items.
 * - Gradient fade at both edges so items feel like they flow through a window.
 * - Hover anywhere in the strip pauses the scroll.
 * - Faster ticker (30s) for more life.
 */
export default function Marquee({ items }: { items: MarqueeItem[] }) {
  const normalized = items.map<{
    type: "tag" | "artist";
    text: string;
    href?: string;
  }>((it) =>
    typeof it === "string"
      ? { type: "tag", text: it }
      : { type: it.type ?? "tag", text: it.text, href: it.href }
  );
  // Duplicate twice for a seamless loop (translate -50%)
  const row = [...normalized, ...normalized];

  return (
    <div className="relative overflow-hidden bg-ink text-white border-y border-white/10">
      {/* Ambient stage glow behind the strip */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            "radial-gradient(50% 120% at 20% 50%, rgba(31,86,224,0.25), transparent 60%), radial-gradient(40% 120% at 85% 50%, rgba(75,128,246,0.2), transparent 70%)"
        }}
      />

      {/* Edge fade masks — items appear to emerge / disappear into the dark */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-40 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-40 bg-gradient-to-l from-ink to-transparent" />

      <div
        className="group relative flex whitespace-nowrap py-6 md:py-7"
        style={{ willChange: "transform" }}
      >
        <div
          className="flex animate-ticker group-hover:[animation-play-state:paused]"
          style={{ animationDuration: "36s" }}
        >
          {row.map((item, i) => (
            <MarqueeEntry key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MarqueeEntry({
  item
}: {
  item: { type: "tag" | "artist"; text: string; href?: string };
}) {
  const content =
    item.type === "artist" ? (
      <span className="font-display italic text-xl md:text-2xl text-white tracking-tight">
        {item.text}
      </span>
    ) : (
      <span className="text-xs md:text-sm uppercase tracking-wider2 font-medium text-white/65">
        {item.text}
      </span>
    );

  return (
    <span className="flex items-center mx-7 md:mx-10">
      {item.href ? (
        <Link
          href={item.href}
          className={
            item.type === "artist"
              ? "hover:text-brand-300 transition-colors"
              : "hover:text-white transition-colors"
          }
        >
          {content}
        </Link>
      ) : (
        content
      )}
      {/* Pulsing LED separator */}
      <span
        aria-hidden
        className="ml-7 md:ml-10 w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"
      />
    </span>
  );
}
