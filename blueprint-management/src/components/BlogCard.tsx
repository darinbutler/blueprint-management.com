import Image from "next/image";
import Link from "next/link";
import type { FeedItem } from "@/lib/feeds";

export default function BlogCard({
  item,
  size = "md"
}: {
  item: FeedItem;
  size?: "sm" | "md" | "lg";
}) {
  const isExternal = !!item.sourceUrl;
const href: string = item.sourceUrl ?? `/blog/${item.slug}`;
  const aspect = size === "lg" ? "aspect-[16/9]" : "aspect-[4/3]";
  return (
    <article className="group card-editorial flex flex-col h-full">
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener nofollow" : undefined}
        className="block"
      >
        <div className={`relative ${aspect} overflow-hidden bg-ink`}>
          <Image
            src={item.image || "/generated/journal-article-fallback.jpg"}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider2 text-ink-muted">
            {item.category && <span className="text-brand-600">{item.category}</span>}
            {item.category && item.source && <span>·</span>}
            {item.source && <span>{item.source}</span>}
          </div>
          <h3 className="font-display text-xl md:text-2xl leading-snug group-hover:text-brand-600 transition-colors line-clamp-3">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="text-sm text-ink-soft line-clamp-3">{item.excerpt}</p>
          )}
          <div className="mt-auto pt-3 text-xs text-ink-muted flex items-center justify-between">
            {item.publishedAt && (
              <time dateTime={item.publishedAt}>
                {new Date(item.publishedAt).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </time>
            )}
            <span className="text-brand-600">
              {isExternal ? "Read on source ↗" : "Read article →"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
