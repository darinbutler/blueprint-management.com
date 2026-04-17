import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFeed } from "@/lib/feeds";
import { siteConfig } from "@/data/site";
import InlineCTA from "@/components/InlineCTA";

export async function generateStaticParams() {
  const feed = await readFeed();
  return feed
    .filter((f) => !f.sourceUrl)
    .map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const feed = await readFeed();
  const item = feed.find((f) => f.slug === params.slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `${siteConfig.url}/blog/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      images: item.image ? [item.image] : []
    }
  };
}

export default async function BlogPost({
  params
}: {
  params: { slug: string };
}) {
  const feed = await readFeed();
  const item = feed.find((f) => f.slug === params.slug);
  if (!item) notFound();

  // If the post is an external feed item, redirect users to the source.
  // We still render a friendly landing for SEO + share cards.
  return (
    <article className="container-editorial py-16 md:py-24 max-w-3xl">
      <p className="eyebrow">
        {item.category ?? "Journal"}
        {item.source && ` · ${item.source}`}
      </p>
      <h1 className="headline mt-3">{item.title}</h1>
      {item.publishedAt && (
        <p className="mt-4 text-sm text-ink-muted">
          {new Date(item.publishedAt).toLocaleDateString("en-GB", {
            dateStyle: "long"
          })}
        </p>
      )}

      {item.image && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mt-10">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <div className="prose prose-lg mt-10 max-w-none text-ink-soft">
        {item.excerpt && <p className="body-lg">{item.excerpt}</p>}
        {item.sourceUrl && (
          <p className="mt-8">
            This article was originally published on {item.source}.{" "}
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener nofollow"
              className="text-brand-600 link-underline"
            >
              Read the full article on the source site ↗
            </a>
            .
          </p>
        )}
      </div>

      <InlineCTA
        title="Thinking about management for your career? Start a conversation with Blueprint."
      />

      <div className="mt-14 flex items-center justify-between text-sm">
        <Link href="/blog" className="text-brand-600 link-underline">
          ← Back to the Journal
        </Link>
      </div>
    </article>
  );
}
