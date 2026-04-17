import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for blueprint-management.com.",
  alternates: { canonical: `${siteConfig.url}/terms` }
};

export default function TermsPage() {
  return (
    <article className="container-editorial py-16 md:py-24 max-w-3xl">
      <p className="eyebrow">Terms</p>
      <h1 className="headline mt-3">Terms of Use</h1>
      <p className="mt-4 text-sm text-ink-muted">Last updated: April 2026</p>
      <div className="mt-10 space-y-6 body-lg">
        <p>
          By accessing blueprint-management.com you agree to use the site for
          lawful purposes only, not to interfere with the operation of the
          site, and to respect the intellectual property contained on it.
          Content, imagery and artist materials are © Blueprint Management and
          the respective artists and may not be reproduced without written
          consent.
        </p>
        <p>
          Nothing on this site constitutes a binding offer of management,
          booking or representation. Entering into any such arrangement
          requires a signed agreement between Blueprint Management and the
          relevant party.
        </p>
      </div>
    </article>
  );
}
