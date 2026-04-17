import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Blueprint Management handles personal data.",
  alternates: { canonical: `${siteConfig.url}/privacy` }
};

export default function PrivacyPage() {
  return (
    <article className="container-editorial py-16 md:py-24 max-w-3xl">
      <p className="eyebrow">Privacy</p>
      <h1 className="headline mt-3">Privacy Policy</h1>
      <p className="mt-4 text-sm text-ink-muted">Last updated: April 2026</p>

      <div className="mt-10 space-y-6 body-lg">
        <p>
          Blueprint Management ("we", "us", "our") takes your privacy seriously.
          This policy explains what personal data we collect when you interact
          with blueprint-management.com and how we use it, in line with UK GDPR.
        </p>

        <h2 className="subhead mt-10">What we collect</h2>
        <p>
          When you submit an enquiry through our contact form we collect your
          name, email address, phone number (if provided), any project or
          artist name you share, and the message you send us. This information
          is delivered to our enquiries inbox and is used solely to respond to
          your enquiry.
        </p>

        <h2 className="subhead mt-10">How long we keep it</h2>
        <p>
          We keep enquiry data for up to 24 months after our final
          correspondence, or longer if you become a Blueprint client. You can
          request deletion at any time by emailing{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-600 link-underline">
            {siteConfig.contact.email}
          </a>.
        </p>

        <h2 className="subhead mt-10">Third parties</h2>
        <p>
          Enquiry emails are delivered via Resend (resend.com). Our journal
          feed is populated using Apify (apify.com). Imagery on the site may be
          generated via Google Gemini. These services process data on our
          behalf under their respective terms.
        </p>

        <h2 className="subhead mt-10">Your rights</h2>
        <p>
          You have the right to access, correct, delete, or restrict processing
          of your personal data. To exercise any of these rights please email
          us. You also have the right to complain to the UK ICO.
        </p>
      </div>
    </article>
  );
}
