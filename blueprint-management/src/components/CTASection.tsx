import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  lede?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: "dark" | "light";
};

export default function CTASection({
  eyebrow = "Trusted artist management",
  title,
  lede,
  ctaLabel = "Enquire with Blueprint",
  ctaHref = "/contact",
  variant = "dark"
}: Props) {
  const isDark = variant === "dark";
  return (
    <section
      className={`relative overflow-hidden ${
        isDark ? "bg-ink text-white" : "bg-canvas-paper text-ink"
      }`}
    >
      {isDark && <div className="absolute inset-0 bg-radial-brand opacity-90" />}
      <div className="container-editorial relative section">
        <div className="max-w-3xl">
          <p
            className={`eyebrow ${
              isDark ? "text-brand-300" : "text-brand-600"
            }`}
          >
            {eyebrow}
          </p>
          <h2 className="subhead mt-4">{title}</h2>
          {lede && (
            <p
              className={`body-lg mt-5 ${
                isDark ? "text-white/80" : "text-ink-soft"
              }`}
            >
              {lede}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={ctaHref} className="btn-primary">
              {ctaLabel}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/roster"
              className={
                isDark
                  ? "btn border border-white/25 text-white hover:bg-white hover:text-ink"
                  : "btn-secondary"
              }
            >
              View the roster
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
