#!/usr/bin/env node
/**
 * Manual Gemini image-regeneration runner.
 * Uses Authorization: Bearer header. See refresh-apify.mjs for rationale.
 *
 * Usage:
 *   ADMIN_REFRESH_TOKEN=... SITE_URL=https://blueprint-management.com \
 *     node scripts/refresh-gemini.mjs
 */
const base = process.env.SITE_URL ?? "http://localhost:3000";
const token = process.env.ADMIN_REFRESH_TOKEN;
if (!token) {
  console.error("Set ADMIN_REFRESH_TOKEN in env.");
  process.exit(1);
}
const res = await fetch(`${base}/api/gemini`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` }
});
const text = await res.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  body = text;
}
console.log(`status: ${res.status}`);
console.log(typeof body === "object" ? JSON.stringify(body, null, 2) : body);
if (!res.ok) process.exitCode = 1;
