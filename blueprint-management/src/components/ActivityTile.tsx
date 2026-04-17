import Image from "next/image";
import type { InstagramPost } from "@/lib/instagram";

/**
 * Single tile in the Activity grid / strip.
 * Visual-first per spec — thumbnail, with a subtle artist + platform
 * overlay. Click-through opens the original Instagram post.
 */
export default function ActivityTile({
  post,
  priority = false
}: {
  post: InstagramPost;
  priority?: boolean;
}) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square overflow-hidden rounded-xl bg-ink"
      aria-label={`${post.artistName} on Instagram — opens in a new tab`}
    >
      <Image
        src={post.thumbnail}
        alt={`${post.artistName} — Instagram post`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority={priority}
      />

      {/* Video indicator */}
      {post.mediaType === "video" && (
        <div className="absolute top-3 right-3 text-white/90">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Hover overlay — artist name + IG mark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-center justify-between gap-2 text-white">
          <span className="font-display text-sm truncate">
            {post.artistName}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
            className="flex-shrink-0"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
            <path d="M16.5 7.5L16.51 7.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
      </div>
    </a>
  );
}
