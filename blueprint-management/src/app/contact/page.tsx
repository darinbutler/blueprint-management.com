import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { imageFor } from "@/lib/assets";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact — Speak with Blueprint Management",
  description:
    "Enquire with Blueprint Management about booking a Blueprint artist, new-artist management representation, press, brand partnerships or sync. We reply within two business days.",
  alternates: { canonical: `${siteConfig.url}/contact` }
};

export default function ContactPage() {
  return (
    <>
      {/* Above-the-fold: form left, imagery right */}
      <section className="relative bg-canvas">
        <div className="container-editorial grid lg:grid-cols-12 gap-10 lg:gap-16 py-16 md:py-24">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <p className="eyebrow">Contact Blueprint</p>
            <h1 className="font-display tracking-tight leading-tight text-3xl md:text-4xl lg:text-5xl mt-3 max-w-2xl">
              Drop us a line using the contact form below.
            </h1>

            <div className="mt-10 p-8 md:p-10 rounded-2xl border border-ink/10 bg-canvas-paper shadow-editorial">
              <ContactForm enquiryType="Contact page" />
            </div>
          </div>

          <aside className="lg:col-span-5 order-1 lg:order-2">
            <div className="sticky top-28 space-y-6">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src={imageFor("contact-hero")}
                  alt="Festival stage at dusk with crowd and stage lights"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="p-6 rounded-2xl border border-ink/10 bg-canvas-paper">
                <h2 className="font-display text-xl">Blueprint office</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-ink-muted">Address</dt>
                    <dd>
                      71&ndash;75 Shelton Street<br />
                      Covent Garden<br />
                      London WC2H 9JQ
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Hours</dt>
                    <dd>Mon&ndash;Fri &middot; 09:30 &ndash; 18:00 GMT</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-canvas-paper border-t border-ink/5">
        <div className="container-editorial max-w-3xl">
          <p className="eyebrow">Frequently asked</p>
          <h2 className="subhead mt-3">Before you hit send.</h2>
          <div className="mt-10 space-y-8">
            {[
              {
                q: "I'd like to book one of your artists. Do I start here?",
                a: "Yes. All booking enquiries for Alison Limerick, Tony Hadley, ABC, Go West and Peter Cox are routed through Blueprint. Use the form above and select 'Booking a Blueprint artist'."
              },
              {
                q: "I'm an emerging artist. Do you take unsolicited enquiries?",
                a: "We do. The Blueprint roster is small by design — but we meet every emerging-artist enquiry and respond personally. Select 'Management representation (new artist)' and tell us where you are in your career."
              },
              {
                q: "How quickly do you respond?",
                a: "Within two business days for all enquiries. Booking requests with a firm date are triaged first."
              }
            ].map((f) => (
              <div key={f.q}>
                <h3 className="font-display text-xl">{f.q}</h3>
                <p className="body-lg mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
