import Link from "next/link";

export default function Logo({
  className = "",
  variant = "dark"
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const primary = variant === "light" ? "text-white" : "text-brand-600";
  const secondary = variant === "light" ? "text-white/70" : "text-ink";
  return (
    <Link
      href="/"
      aria-label="Blueprint Management — Home"
      className={`inline-flex flex-col leading-none ${className}`}
    >
      <span
        className={`font-display font-black ${primary} text-2xl md:text-[28px] tracking-tightest`}
      >
        blueprint
      </span>
      <span
        className={`uppercase tracking-wider2 text-[9px] md:text-[10px] font-medium ${secondary}`}
      >
        Management
      </span>
    </Link>
  );
}
