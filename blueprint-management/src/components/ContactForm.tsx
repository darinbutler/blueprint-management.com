"use client";

import { useState, type FormEvent } from "react";

/**
 * Static-site contact form — posts directly to Web3Forms.
 * No server runtime required (works on GitHub Pages).
 *
 * Setup (one-off):
 *   1. Go to https://web3forms.com and enter butlerdarin@gmail.com
 *   2. Web3Forms emails you an access key — copy it
 *   3. Paste it into NEXT_PUBLIC_WEB3FORMS_KEY in .env.local, and also into
 *      the GitHub repo's Secrets → Actions as WEB3FORMS_KEY
 *   4. Verify the address the first time it receives a submission
 *
 * The key is safe to expose (prefixed NEXT_PUBLIC_) — Web3Forms enforces
 * domain-origin checks server-side so it can only be used from your site.
 */

type Status = "idle" | "submitting" | "success" | "error";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export default function ContactForm({
  enquiryType = "General enquiry",
  subjectPrefix
}: {
  enquiryType?: string;
  subjectPrefix?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bail silently if filled
    if ((data.get("_gotcha") ?? "").toString().trim()) {
      setStatus("success");
      setMessage("Thanks — we'll be in touch soon.");
      form.reset();
      return;
    }

    if (!accessKey) {
      setStatus("error");
      setMessage(
        "The form isn't configured yet. Please email butlerdarin@gmail.com directly."
      );
      return;
    }

    // Compose subject + access key for Web3Forms
    data.append("access_key", accessKey);
    const subject = `[${subjectPrefix ?? enquiryType}] ${
      data.get("name") ?? "New enquiry"
    } — ${data.get("enquiry") ?? "general"}`;
    data.set("subject", subject);
    data.append("from_name", "Blueprint Management — Contact form");

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: data
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Submission failed");
      }
      setStatus("success");
      setMessage(
        "Thank you — your enquiry has reached Blueprint Management. We'll reply within two business days."
      );
      form.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setStatus("error");
      setMessage(msg);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="enquiryType" defaultValue={enquiryType} readOnly />
      {/* Honeypot (hidden from users, bots fill it) */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Full name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Phone (optional)" name="phone" autoComplete="tel" />
        <Field label="Artist / project name" name="project" autoComplete="organization" />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="enquiry"
          className="text-xs uppercase tracking-wider2 text-ink-muted"
        >
          Nature of enquiry
        </label>
        <select
          id="enquiry"
          name="enquiry"
          defaultValue="artist-booking"
          className="border border-ink/15 rounded-lg px-4 py-3 bg-canvas-paper focus:outline-none focus:ring-2 focus:ring-brand-600"
        >
          <option value="artist-booking">Booking a Blueprint artist</option>
          <option value="representation">Management representation (new artist)</option>
          <option value="press">Press / PR</option>
          <option value="brand">Brand partnership / sync</option>
          <option value="general">General / other</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-xs uppercase tracking-wider2 text-ink-muted"
        >
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="border border-ink/15 rounded-lg px-4 py-3 bg-canvas-paper focus:outline-none focus:ring-2 focus:ring-brand-600"
          placeholder="Tell us about your project, the artist you'd like to book, or where you are in your career and what support you're looking for."
        />
      </div>
      <label className="flex items-start gap-3 text-xs text-ink-muted">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 accent-brand-600"
        />
        <span>
          I agree that Blueprint Management may store and process the details
          above to respond to my enquiry. See our{" "}
          <a href="/privacy" className="underline">
            privacy policy
          </a>
          .
        </span>
      </label>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending…" : "Send enquiry"}
        </button>
        {message && (
          <p
            className={`text-sm ${
              status === "success" ? "text-brand-600" : "text-red-600"
            }`}
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-xs uppercase tracking-wider2 text-ink-muted"
      >
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="border border-ink/15 rounded-lg px-4 py-3 bg-canvas-paper focus:outline-none focus:ring-2 focus:ring-brand-600"
      />
    </div>
  );
}
