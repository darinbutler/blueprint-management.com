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
      <section className="relative bg-canvas">
        <div className="container-editorial grid lg:grid-cols-12 gap-10 lg:gap-16 py-16 md:py-24">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <p className="eyebrow">Contact Blueprint</p>
            <h1 className="headline mt-3">
              Tell us what you&apos;re building. We&apos;ll reply within two business days.
            </h1>
            <p className="body-lg mt-5 max-w-2xl">
              Whether you&apos;re booking a Blueprint artist, looking for management
              representation as an emerging or established artist, or exploring
              a brand partnership — start here.
            </p>

            <div className="mt-10 p-8 md:p-10 rounded-2xl border border-ink/10 bg-canvas-paper shadow-editorial">
              <ContactForm enquiryType="Contact page" />
            </div>
          </div>

          <aside className="lg:col-span-5 order-1 lg:order-2">
            <div className="sticky top-28 space-y-6">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src={imageFor("contact-hero")}
                  alt="Minimalist London office interior at dusk"
                  fill
                  priority
                  className="object-cover"
    </>
  );
}
