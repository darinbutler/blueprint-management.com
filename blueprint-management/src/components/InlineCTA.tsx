import Link from "next/link";

export default function InlineCTA({
  title,
  subject
}: {
  title: string;
  subject?: string;
}) {
  const href = subject
    ? `/contact?subject=${encodeURIComponent(subject)}`
    : "/contact";
  return (
    <div className="mt-10 border-t border-ink/10 pt-8 flex flex-wrap gap-4 items-center justify-between">
      <p className="font-display text-xl md:text-2xl max-w-xl">{title}</p>
      <Link href={href} className="btn-primary">
        Enquire now
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
    </div>
  );
}
