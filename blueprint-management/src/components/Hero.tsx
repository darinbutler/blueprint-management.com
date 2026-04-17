import Link from "next/link";
import Image from "next/image";

type HeroProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  imageSrc: string;
  imageAlt: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  align?: "left" | "center";
  variant?: "full" | "split";
};

export default function Hero({
  eyebrow,
  title,
  lede,
  imageSrc,
  imageAlt,
  primaryCta,
  secondaryCta,
  align = "left",
  variant = "full"
}: HeroProps) {
  if (variant === "split") {
    return (
      <section className="relative grid lg:grid-cols-2 min-h-[70vh] bg-ink text-white overflow-hidden">
        <div className="relative z-10 flex items-center p-8 md:p-16 lg:p-24">
          <div className="max-w-xl animate-fade-up">
            {eyebrow && <p className="eyebrow text-brand-300 mb-5">{eyebrow}</p>}
            <h1 className="headline text-white">{title}</h1>
            {lede && <p className="body-lg text-white/80 mt-6">{lede}</p>}
            <div className="flex flex-wrap gap-3 mt-8">
              {primaryCta && (
                <Link href={primaryCta.href} className="btn-primary">
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="btn border border-white/25 text-white hover:bg-white hover:text-ink"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="relative min-h-[50vh] lg:min-h-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[calc(100vh-96px)] min-h-[720px] bg-ink text-white overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/80" />
      <div className="absolute inset-0 grain-overlay" />
      <div
        className={`container-editorial relative z-10 h-full flex ${
          align === "center" ? "items-center justify-center text-center" : "items-end pb-24 md:pb-28"
        }`}
      >
        <div
          className={`animate-fade-up ${
            align === "center" ? "max-w-4xl" : "max-w-3xl"
          }`}
        >
          {eyebrow && (
            <p className="eyebrow text-brand-300 mb-5">{eyebrow}</p>
          )}
          <h1 className="headline text-white">{title}</h1>
          {lede && (
            <p className="body-lg text-white/85 mt-6 max-w-2xl">{lede}</p>
          )}
          {(primaryCta || secondaryCta) && (
            <div
              className={`flex flex-wrap gap-3 mt-10 ${
                align === "center" ? "justify-center" : ""
              }`}
            >
              {primaryCta && (
                <Link href={primaryCta.href} className="btn-primary">
                  {primaryCta.label}
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
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="btn border border-white/25 text-white hover:bg-white hover:text-ink"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
