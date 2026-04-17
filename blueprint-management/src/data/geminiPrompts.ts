/**
 * Gemini image-generation prompt templates, one per site section.
 * The prompts aim for a consistent editorial, cinematic, music-industry aesthetic
 * with the Blueprint Management brand palette (deep blue, warm stage gold, ink black).
 */

export const geminiPrompts = {
  homeHero: {
    id: "home-hero",
    aspect: "16:9",
    prompt:
      "Cinematic wide-angle concert photography: the back of a silhouetted artist stepping onto a sold-out stadium stage, sea of raised hands and phone lights, smoke haze, columns of deep blue and warm amber spotlights piercing the atmosphere, shot on 35mm film, editorial magazine quality, aspirational, high dynamic range, no text, no logos."
  },
  homeLegacy: {
    id: "home-legacy",
    aspect: "3:2",
    prompt:
      "Editorial still life of a vintage leather-bound artist management ledger, a brass-rimmed fountain pen, a vinyl LP sleeve in muted blues, and a stack of backstage lanyards on a dark walnut desk under soft north light, warm-cool colour grade, luxury magazine aesthetic, no text."
  },
  homeRosterBanner: {
    id: "home-roster-banner",
    aspect: "16:9",
    prompt:
      "Cinematic montage of five live-music moments: a symphonic pop show in a velvet theatre, a festival main-stage sunset, an intimate acoustic theatre show, a sweat-drenched dance festival crowd, a new-romantic era stadium gig — each frame tonally consistent in deep blues and warm golds, editorial photography, no text, seamless horizontal composition."
  },
  aboutHero: {
    id: "about-hero",
    aspect: "16:9",
    prompt:
      "Cinematic wide shot of an iconic European stadium at golden hour, empty stage with rigging being set, a single person in a wool overcoat stands downstage centre with their back to camera surveying the empty seats, moody cinematic lighting with deep blue skies, editorial aesthetic, no text."
  },
  aboutStory: {
    id: "about-story",
    aspect: "3:2",
    prompt:
      "Black-and-white archival-feeling photograph of a London recording studio circa late 1970s — SSL console, tape machine, acoustic guitar on a stand, warm tungsten light — shot on medium format film with a modern documentary colour grade, editorial magazine quality."
  },
  rosterHero: {
    id: "roster-hero",
    aspect: "21:9",
    prompt:
      "Cinematic panoramic photograph of a backstage corridor with a row of closed dressing room doors, each labelled with an artist name placard (blank), soft tungsten wall sconces, deep blue painted walls, concrete floor, mood-lit, 35mm, editorial music photography, no text."
  },
  emergingArtists: {
    id: "emerging-artists",
    aspect: "3:2",
    prompt:
      "Editorial documentary photograph of a young emerging musician rehearsing alone in a sun-drenched white studio, vintage guitar on a stand, notebook on the floor, morning window light, aspirational and cinematic, shot on medium format film, no text."
  },
  contactHero: {
    id: "contact-hero",
    aspect: "16:9",
    prompt:
      "Architectural interior photograph of a minimalist London office with large steel-framed windows overlooking a rooftop skyline at dusk, deep blue velvet sofa, mid-century walnut desk with a single lamp, cinematic, editorial, warm-cool contrast, no text, no people."
  },
  blogHero: {
    id: "blog-hero",
    aspect: "16:9",
    prompt:
      "Overhead editorial still life: a leather-bound notebook, a gold Pilot fountain pen, a stack of music industry trade magazines and a coffee cup on a dark concrete desktop, shot with cinematic side light, navy-gold colour grade, luxury magazine aesthetic, no text."
  },
  journalArticleFallback: {
    id: "journal-article-fallback",
    aspect: "16:9",
    prompt:
      "Editorial cinematic still life representing the modern music industry — a microphone, a stack of vinyl records in muted blues, a pair of headphones on a walnut desk under soft directional light, aspirational, no text, magazine cover quality."
  }
} as const;

export type GeminiPromptKey = keyof typeof geminiPrompts;
