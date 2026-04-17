#!/usr/bin/env node
/**
 * Pre-commit secret scanner.
 * Blocks a commit if staged files contain known secret patterns.
 *
 * Wire up:
 *   chmod +x scripts/scan-secrets.mjs
 *   ln -s ../../scripts/scan-secrets.mjs .git/hooks/pre-commit
 *
 * Or install via husky (recommended in CI):
 *   npx husky add .husky/pre-commit "node scripts/scan-secrets.mjs"
 *
 * Patterns covered (non-exhaustive):
 *   Resend:  re_[A-Za-z0-9]{24,}
 *   Google:  AIza[0-9A-Za-z\\-_]{35}
 *   Apify:   apify_api_[A-Za-z0-9]{20,}
 *   Generic: private key PEM blocks, 40+ char hex tokens in .env files
 */

import { execSync } from "node:child_process";
import fs from "node:fs";

const patterns = [
  { name: "Resend API key", re: /re_[A-Za-z0-9]{24,}/ },
  { name: "Google API key", re: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: "Apify token", re: /apify_api_[A-Za-z0-9]{20,}/ },
  { name: "Private key PEM", re: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "AWS access key id", re: /AKIA[0-9A-Z]{16}/ },
  {
    name: "Generic secret in .env",
    re: /^(?!.*example)(?:RESEND|GEMINI|APIFY|ADMIN|CRON|SECRET|TOKEN|KEY|PASSWORD)[A-Z_]*\s*=\s*[^#\s]{12,}/m,
    onlyInEnv: true
  }
];

// List staged files (or all tracked if run outside a hook context).
let files;
try {
  files = execSync("git diff --cached --name-only --diff-filter=ACM", {
    encoding: "utf8"
  })
    .split("\n")
    .filter(Boolean);
} catch {
  console.error("scan-secrets: not a git repo, nothing to scan.");
  process.exit(0);
}

// Never scan node_modules or lockfiles.
files = files.filter(
  (f) =>
    !f.startsWith("node_modules/") &&
    !/package-lock\.json$|yarn\.lock$|pnpm-lock\.yaml$/.test(f) &&
    !f.endsWith(".example")
);

const findings = [];
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, "utf8");
  const isEnv = /\.env(\.|$)/.test(file) || file.endsWith(".env");
  for (const p of patterns) {
    if (p.onlyInEnv && !isEnv) continue;
    const m = content.match(p.re);
    if (m) {
      findings.push({ file, name: p.name, hit: m[0].slice(0, 12) + "…" });
    }
  }
}

if (findings.length) {
  console.error("\n  ✗ scan-secrets: potential secrets found in staged files:");
  for (const f of findings) {
    console.error(`    · ${f.file}  [${f.name}]  near: ${f.hit}`);
  }
  console.error(
    "\n  If these are placeholders, mark the file as an example (*.example).\n" +
      "  If they are real, remove them and rotate the credential immediately.\n"
  );
  process.exit(1);
}

console.log("  ✓ scan-secrets: no secrets detected in staged files");
