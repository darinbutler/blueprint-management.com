/**
 * Server-side environment validation.
 *
 * Every secret in this file is read lazily and validated at the point of use
 * (not at module load) so the site still builds if a key is temporarily
 * missing. Access is through typed getters that throw descriptive errors
 * rather than returning empty strings.
 *
 * Secret names are never logged — only a redacted "set / not set" signal.
 */

type Secret =
  | "RESEND_API_KEY"
  | "GEMINI_API_KEY"
  | "APIFY_TOKEN"
  | "ADMIN_REFRESH_TOKEN"
  | "CRON_SECRET";

function read(name: Secret): string | undefined {
  return process.env[name];
}

export function requireSecret(name: Secret): string {
  const value = read(name);
  if (!value || value.trim() === "") {
    throw new Error(
      `[env] ${name} is not configured on the server. Add it to .env.local in development, or to the Vercel project's Environment Variables in production.`
    );
  }
  // Reject placeholder values from .env.example
  if (
    /^(xxx|change-me|placeholder|your[_-]?key|paste[_-]?here)/i.test(value) ||
    value.includes("XXXXXXXXX")
  ) {
    throw new Error(`[env] ${name} still contains a placeholder value.`);
  }
  return value;
}

/**
 * Boot-time summary. Never logs values — only which secrets are present.
 * Call from a root-level server file (e.g. the first server render) to
 * get a one-line heads-up in your Vercel logs if anything's missing.
 */
export function envSummary(): string {
  const checks: { name: Secret; required: boolean }[] = [
    { name: "RESEND_API_KEY", required: true },
    { name: "ADMIN_REFRESH_TOKEN", required: true },
    { name: "GEMINI_API_KEY", required: false },
    { name: "APIFY_TOKEN", required: false },
    { name: "CRON_SECRET", required: false }
  ];
  return checks
    .map((c) => {
      const present = !!read(c.name);
      const tag = present ? "✓" : c.required ? "✗ MISSING" : "·";
      return `${tag} ${c.name}`;
    })
    .join("  ");
}

/** Never exposes the actual value — only length + prefix for debugging. */
export function redact(value: string | undefined): string {
  if (!value) return "(unset)";
  if (value.length < 8) return "(set, <8 chars)";
  return `(set, ${value.length} chars, prefix=${value.slice(0, 4)}…)`;
}
