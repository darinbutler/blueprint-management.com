import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How blueprint-management.com uses cookies.",
  alternates: { canonical: `${siteConfig.url}/cookies` }
};

export default function CookiesPage() {
  return (
    <article className="container-editorial py-16 md:py-24 max-w-3xl">
      <p className="eyebrow">Cookies</p>
      <h1 className="headline mt-3">Cookie Policy</h1>
      <p className="mt-4 text-sm text-ink-muted">Last updated: April 2026</p>
      <div className="mt-10 space-y-6 body-lg">
        <p>
          blueprint-management.com uses a minimal set of functional cookies
          required to operate the site (e.g. for session handling). We do not
          use third-party advertising or cross-site tracking cookies.
        </p>
        <p>
          If we ever introduce analytics, we will do so with consent management
          in line with UK GDPR and the PECR.
        </p>
      </div>
    </article>
  );
}
