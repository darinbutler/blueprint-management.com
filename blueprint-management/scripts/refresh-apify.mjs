#!/usr/bin/env node
/**
 * Manual Apify refresh runner.
 *
 * Uses Authorization: Bearer header so the token never ends up in URL
 * access logs or shell history (beyond the env var itself).
 *
 * Usage:
 *   ADMIN_REFRESH_TOKEN=... SITE_URL=https://blueprint-management.com \
 *     node scripts/refresh-apify.mjs
 */
const base = process.env.SITE_URL ?? "http://localhost:3000";
const token = process.env.ADMIN_REFRESH_TOKEN;
if (!token) {
  console.error("Set ADMIN_REFRESH_TOKEN in env.");
  process.exit(1);
}

async function run(path) {
  console.log(`→ POST ${path}`);
  const res = await fetch(`${base}${path}`, {
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
  // Never echo the token or Authorization header. Only surface the result.
  console.log(`  status: ${res.status}`);
  if (typeof body === "object") {
    console.log(`  ${JSON.stringify(body, null, 2)}`);
  } else {
    console.log(`  ${body}`);
  }
  if (!res.ok) process.exitCode = 1;
}

await run("/api/apify/feeds");
await run("/api/apify/competitors");
