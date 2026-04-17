"use client";

import { useMemo, useState } from "react";
import ActivityTile from "./ActivityTile";
import type { InstagramPost } from "@/lib/instagram";

type RosterEntry = { slug: string; name: string };

/**
 * Client-side filterable grid. Kept lightweight:
 * a single pill row of artist filters + a responsive tile grid.
 */
export default function ActivityGrid({
  posts,
  roster
}: {
  posts: InstagramPost[];
  roster: RosterEntry[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((p) => p.artistSlug === filter);
  }, [posts, filter]);

  const filters: RosterEntry[] = [{ slug: "all", name: "All artists" }, ...roster];

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter activity by artist"
        className="flex flex-wrap gap-2 mb-8 md:mb-10 sticky top-16 md:top-20 z-30 py-3 bg-canvas/90 backdrop-blur"
      >
        {filters.map((f) => {
          const active = filter === f.slug;
          return (
            <button
              key={f.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.slug)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                active
                  ? "bg-ink text-canvas border-ink"
                  : "border-ink/15 text-ink hover:border-ink/40"
              }`}
            >
              {f.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {filtered.map((post, i) => (
          <ActivityTile key={post.id} post={post} priority={i < 8} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-ink-muted">
          No posts for this artist yet.
        </p>
      )}
    </>
  );
}
