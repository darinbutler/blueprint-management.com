import type { ReactNode } from "react";

type Social = { platform: string; url: string };

/** Inline SVG icons — no external icon library, keeps bundle size minimal. */
const icons: Record<string, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16.5 7.5L16.51 7.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21.5l-7.47 8.533L22.5 22h-6.86l-5.37-7.026L3.98 22H.72l7.995-9.137L.5 2h7.03l4.855 6.417L18.244 2Zm-1.2 18h1.87L7.05 4H5.07l11.974 16Z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21.5l-7.47 8.533L22.5 22h-6.86l-5.37-7.026L3.98 22H.72l7.995-9.137L.5 2h7.03l4.855 6.417L18.244 2Zm-1.2 18h1.87L7.05 4H5.07l11.974 16Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.89a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31Z" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.6.6 0 0 1-.86.2c-2.35-1.43-5.3-1.75-8.77-.96a.62.62 0 1 1-.27-1.2c3.8-.86 7.08-.48 9.73 1.1a.62.62 0 0 1 .17.86Zm1.23-2.74a.78.78 0 0 1-1.07.25c-2.69-1.65-6.78-2.13-9.96-1.17a.78.78 0 1 1-.45-1.49c3.62-1.1 8.14-.56 11.22 1.32a.78.78 0 0 1 .26 1.09Zm.1-2.86C14.7 8.87 9.2 8.69 6.1 9.63a.93.93 0 1 1-.54-1.78c3.56-1.08 9.64-.87 13.45 1.4a.93.93 0 1 1-.95 1.6Z" />
    </svg>
  )
};

function iconFor(platform: string): ReactNode {
  const key = platform.toLowerCase().trim();
  // Match common variants
  if (icons[key]) return icons[key];
  if (key === "twitter/x" || key === "x/twitter") return icons.x;
  if (key === "ig") return icons.instagram;
  if (key === "fb") return icons.facebook;
  if (key === "yt") return icons.youtube;
  // Fallback: globe-ish pill
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export default function SocialIcons({
  socials,
  size = "md",
  className = ""
}: {
  socials: Social[];
  size?: "sm" | "md";
  className?: string;
}) {
  if (!socials?.length) return null;
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const padClass = size === "sm" ? "p-2" : "p-2.5";
  return (
    <ul
      className={`flex flex-wrap items-center gap-2 ${className}`}
      aria-label="Social channels"
    >
      {socials.map((s) => (
        <li key={s.platform}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.platform} — opens in a new tab`}
            title={s.platform}
            className={`inline-flex items-center justify-center ${padClass} rounded-full border border-ink/15 text-ink hover:text-brand-600 hover:border-brand-600 transition-colors`}
          >
            <span className={sizeClass}>{iconFor(s.platform)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
