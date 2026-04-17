"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  enquiryType = "General enquiry",
  subjectPrefix
}: {
  enquiryType?: string;
  subjectPrefix?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot — bail silently if filled
    if (data._gotcha) {
      setStatus("success");
      setMessage("Thanks — we'll be in touch soon.");
      form.reset();
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, subjectPrefix })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Submission failed");
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
      <input
        type="hidden"
        name="enquiryType"
        defaultValue={enquiryType}
        readOnly
      />
      {/* Honeypot */}
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
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Phone (optional)" name="phone" autoComplete="tel" />
        <Field
          label="Artist / project name"
          name="project"
          autoComplete="organization"
        />
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
