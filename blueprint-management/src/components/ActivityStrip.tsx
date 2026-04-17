import Link from "next/link";
import ActivityTile from "./ActivityTile";
import { readInstagramFeed } from "@/lib/instagram";

/**
 * Homepage "Latest activity" strip.
 * Shows the 8 most recent posts across all artists, plus a link
 * through to the full /activity page.
 */
export default async function ActivityStrip() {
  const posts = (await readInstagramFeed()).slice(0, 8);

  if (posts.length === 0) {
    // Graceful empty state — shown before the first scraper run lands.
    return null;
  }

  return (
    <section className="section bg-canvas">
      <div className="container-editorial">
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <p className="eyebrow">Latest activity</p>
            <h2 className="subhead mt-3">
              What the Blueprint roster is putting out this week.
            </h2>
          </div>
          <Link
            href="/activity"
            className="text-sm link-underline text-brand-600 whitespace-nowrap"
          >
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {posts.map((post, i) => (
            <ActivityTile key={post.id} post={post} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
