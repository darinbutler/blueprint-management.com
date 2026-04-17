import type { Metadata } from "next";
import ActivityGrid from "@/components/ActivityGrid";
import { readInstagramFeed, readInstagramManifest } from "@/lib/instagram";
import { siteConfig } from "@/data/site";
import { artists } from "@/data/artists";

export const metadata: Metadata = {
  title: "Activity — See what Blueprint artists are posting right now",
  description:
    "A live, chronological feed of Instagram activity across the Blueprint Management roster — Tony Hadley, ABC, Go West, Peter Cox and Alison Limerick. Showcasing the reach, output and audience Blueprint artists command week to week.",
  alternates: { canonical: `${siteConfig.url}/activity` }
};

function formatGeneratedAt(iso: string | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return "";
  }
}

export default async function ActivityPage() {
  const [posts, manifest] = await Promise.all([
    readInstagramFeed(),
    readInstagramManifest()
  ]);
  const updated = formatGeneratedAt(manifest?.generatedAt);

  // Only show filter options for artists that actually have posts cached.
  const rosterForFilter = artists
    .map((a) => ({ slug: a.slug, name: a.name }))
    .filter((a) => posts.some((p) => p.artistSlug === a.slug));

  return (
    <>
      <section className="bg-canvas">
        <div className="container-editorial py-16 md:py-24">
          <p className="eyebrow">Activity</p>
          <h1 className="headline mt-3 max-w-3xl">
            The roster, in motion.
          </h1>
          <p className="body-lg mt-5 max-w-2xl">
            A chronological view of Instagram activity across the Blueprint
            roster — tours, releases, sessions, behind-the-scenes. Refreshed
            weekly; each tile opens the original post.
          </p>
          {updated && (
            <p className="mt-4 text-xs text-ink-muted">
              Last refreshed {updated}
            </p>
          )}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-editorial">
          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="body-lg text-ink-muted">
                The activity feed refreshes every Sunday. Check back soon —
                or{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-brand-600 link-underline"
                >
                  get in touch
                </a>{" "}
                to learn about a specific artist&apos;s recent output.
              </p>
            </div>
          ) : (
            <ActivityGrid posts={posts} roster={rosterForFilter} />
          )}
        </div>
      </section>
    </>
  );
}
