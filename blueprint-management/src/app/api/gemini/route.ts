import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { generateImage } from "@/lib/gemini";
import { geminiPrompts, type GeminiPromptKey } from "@/data/geminiPrompts";
import { requireAdminToken } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only endpoint: regenerates hero/section imagery via Gemini Imagen
 * and writes files to /public/generated/<id>.jpg so the rest of the site
 * can reference them as static assets.
 *
 * Usage (preferred — header never hits access logs):
 *   curl -X POST https://.../api/gemini \
 *     -H "Authorization: Bearer $ADMIN_REFRESH_TOKEN"
 *
 *   # one prompt only
 *   curl -X POST "https://.../api/gemini?key=homeHero" \
 *     -H "Authorization: Bearer $ADMIN_REFRESH_TOKEN"
 *
 * Query-string `?token=...` is still accepted for local dev but should not
 * be used in production (it appears in Vercel access logs).
 */
export async function POST(request: Request) {
  try {
    requireAdminToken(request);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unauthorized" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const only = url.searchParams.get("key") as GeminiPromptKey | null;
  const keys = (only ? [only] : Object.keys(geminiPrompts)) as GeminiPromptKey[];
  const outDir = path.join(process.cwd(), "public", "generated");
  await fs.mkdir(outDir, { recursive: true });

  const results: { key: string; path: string; ok: boolean; error?: string }[] =
    [];

  for (const key of keys) {
    const entry = geminiPrompts[key];
    if (!entry) {
      results.push({ key, path: "", ok: false, error: "unknown prompt key" });
      continue;
    }
    try {
      const img = await generateImage({
        prompt: entry.prompt,
        aspectRatio: entry.aspect as "16:9"
      });
      const ext = img.mimeType.includes("png") ? "png" : "jpg";
      const fileName = `${entry.id}.${ext}`;
      await fs.writeFile(
        path.join(outDir, fileName),
        Buffer.from(img.base64, "base64")
      );
      results.push({
        key,
        path: `/generated/${fileName}`,
        ok: true
      });
    } catch (err: unknown) {
      results.push({
        key,
        path: "",
        ok: false,
        error: err instanceof Error ? err.message : "unknown error"
      });
    }
  }

  return NextResponse.json({ results, generatedAt: new Date().toISOString() });
}
