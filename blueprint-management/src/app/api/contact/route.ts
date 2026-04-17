import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { rateLimit, clientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

// Per-IP: max 5 submissions every 10 minutes.
const RL_LIMIT = 5;
const RL_WINDOW_MS = 10 * 60 * 1000;

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  project?: string;
  enquiry?: string;
  enquiryType?: string;
  subjectPrefix?: string;
  message?: string;
  consent?: string;
  _gotcha?: string;
};

export async function POST(request: Request) {
  // Rate limit early — before parsing, before touching Resend.
  const rl = rateLimit({
    key: `contact:${clientKey(request)}`,
    limit: RL_LIMIT,
    windowMs: RL_WINDOW_MS
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many enquiries. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(RL_LIMIT),
          "X-RateLimit-Remaining": String(rl.remaining)
        }
      }
    );
  }

  // Reject payloads larger than 32 KB.
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 32_000) {
    return NextResponse.json(
      { error: "Payload too large." },
      { status: 413 }
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot
  if (body._gotcha) {
    return NextResponse.json({ ok: true });
  }

  const name = clampString(body.name, 200);
  const email = clampString(body.email, 320);
  const message = clampString(body.message, 8000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "butlerdarin@gmail.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "Blueprint Management <onboarding@resend.dev>";

  // Strip CR/LF from any string that becomes part of an email header to
  // prevent header-injection. Bound the final subject length too.
  const sp =
    body.subjectPrefix ?? body.enquiryType ?? "Blueprint Enquiry";
  const safePrefix = stripHeader(clampString(sp, 100));
  const safeEnquiry = stripHeader(clampString(body.enquiry ?? "general", 100));
  const subject = clampString(
    `[${safePrefix}] ${stripHeader(name)} — ${safeEnquiry}`,
    200
  );

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width:640px; margin:auto; color:#0a0a0f;">
      <div style="background:#143db8; color:#fff; padding:24px 28px;">
        <p style="margin:0; font-size:12px; letter-spacing:0.2em; text-transform:uppercase; opacity:0.8;">Blueprint Management</p>
        <h1 style="margin:6px 0 0; font-size:22px;">New enquiry received</h1>
      </div>
      <div style="padding:28px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr><td style="padding:8px 0; color:#6b7280; width:160px;">Name</td><td>${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0; color:#6b7280;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          ${body.phone ? `<tr><td style="padding:8px 0; color:#6b7280;">Phone</td><td>${escapeHtml(body.phone)}</td></tr>` : ""}
          ${body.project ? `<tr><td style="padding:8px 0; color:#6b7280;">Project / artist</td><td>${escapeHtml(body.project)}</td></tr>` : ""}
          <tr><td style="padding:8px 0; color:#6b7280;">Enquiry</td><td>${escapeHtml(body.enquiry ?? "general")}</td></tr>
          ${body.enquiryType ? `<tr><td style="padding:8px 0; color:#6b7280;">Page</td><td>${escapeHtml(body.enquiryType)}</td></tr>` : ""}
        </table>
        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
        <p style="white-space:pre-wrap; line-height:1.6;">${escapeHtml(message)}</p>
      </div>
      <div style="padding:16px 28px; background:#fafafa; color:#6b7280; font-size:12px;">
        Sent from the contact form on blueprint-management.com
      </div>
    </div>
  `;

  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      html,
      text: plainText({ name, email, body })
    });
    if (result.error) {
      return NextResponse.json(
        { error: result.error.message ?? "Delivery failed" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    // Log only the error type + message — never the request body (contains
    // PII) and never the API key.
    const shape =
      err instanceof Error ? `${err.name}: ${err.message}` : "unknown";
    console.error("[contact] delivery failed:", shape);
    return NextResponse.json(
      { error: "Unable to deliver your message right now. Please try again." },
      { status: 500 }
    );
  }
}

function plainText({
  name,
  email,
  body
}: {
  name: string;
  email: string;
  body: Payload;
}) {
  return [
    `New Blueprint Management enquiry`,
    ``,
    `From: ${name} <${email}>`,
    body.phone ? `Phone: ${body.phone}` : "",
    body.project ? `Project: ${body.project}` : "",
    `Enquiry type: ${body.enquiry ?? "general"}`,
    body.enquiryType ? `Source page: ${body.enquiryType}` : "",
    ``,
    body.message ?? ""
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clampString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function stripHeader(value: string): string {
  // Remove CR/LF and any NUL bytes — prevents SMTP header injection if the
  // value ever flows into a header field.
  return value.replace(/[\r\n\0]+/g, " ").trim();
}
