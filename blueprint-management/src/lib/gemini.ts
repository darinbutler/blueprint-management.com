/**
 * Thin server-side helper around Google Gemini / Imagen for image generation.
 *
 * Two modes:
 *   1. Text generation (gemini-1.5-flash) — used sparingly for copy suggestions
 *   2. Image generation (Imagen 3) — used for hero and section imagery
 *
 * ENV required:
 *   GEMINI_API_KEY
 *   GEMINI_IMAGE_MODEL (default: imagen-3.0-generate-002)
 *   GEMINI_TEXT_MODEL  (default: gemini-1.5-flash-latest)
 */

import { requireSecret } from "./env";

const IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL ?? "imagen-3.0-generate-002";
const TEXT_MODEL =
  process.env.GEMINI_TEXT_MODEL ?? "gemini-1.5-flash-latest";

export type GeminiImageResult = {
  mimeType: string;
  base64: string;
};

export async function generateImage({
  prompt,
  aspectRatio = "16:9"
}: {
  prompt: string;
  aspectRatio?: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
}): Promise<GeminiImageResult> {
  const apiKey = requireSecret("GEMINI_API_KEY");
  // Note: Gemini requires the key in the URL. It stays server-side (Node
  // runtime, no public export), and we never log this URL.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:predict?key=${apiKey}`;

  const body = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio,
      personGeneration: "ALLOW_ADULT",
      safetyFilterLevel: "BLOCK_ONLY_HIGH"
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (!res.ok) {
    const errText = await res.text();
    // Scrub any accidental API-key echoes from the error body before
    // surfacing. Google error responses don't normally contain the key, but
    // belt & braces.
    const safe = errText.replace(apiKey, "***");
    throw new Error(`Gemini image generation failed: ${res.status} ${safe}`);
  }

  const json = (await res.json()) as {
    predictions?: Array<{
      bytesBase64Encoded?: string;
      mimeType?: string;
    }>;
  };

  const pred = json.predictions?.[0];
  if (!pred?.bytesBase64Encoded) {
    throw new Error("Gemini returned no image data");
  }

  return {
    base64: pred.bytesBase64Encoded,
    mimeType: pred.mimeType ?? "image/png"
  };
}

export async function generateText(prompt: string): Promise<string> {
  const apiKey = requireSecret("GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`Gemini text generation failed: ${res.status}`);
  }
  const json = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}
