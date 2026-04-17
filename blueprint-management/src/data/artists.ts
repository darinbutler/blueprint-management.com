export type Artist = {
  slug: string;
  name: string;
  billing: string;
  tagline: string;
  bio: string;
  bioLong: string;
  hometown?: string;
  activeSince?: number;
  genres: string[];
  highlights: string[];
  officialUrl: string;
  socials: { platform: string; url: string }[];
  heroPrompt: string;
  portraitPrompt: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export const artists: Artist[] = [
  {
    slug: "tony-hadley",
    name: "Tony Hadley",
    billing: "Tony Hadley",
    tagline: "The voice of a generation. Ex-Spandau Ballet frontman on a landmark solo chapter.",
    bio: "Tony Hadley — the unmistakable baritone behind Spandau Ballet's most enduring anthems — continues to pack arenas worldwide as a solo artist, symphonic headliner and collaborator with some of the world's finest orchestras.",
    bioLong:
      "From the opening phrase of 'True' to sold-out symphonic tours across Europe, Tony Hadley remains one of British music's most distinctive voices. After leading Spandau Ballet through an era-defining run of global hits, Tony's solo career has taken him from the Royal Albert Hall to arenas across Italy, Australia and the UK, earning critical acclaim for performances that marry pop craftsmanship with theatrical showmanship. Blueprint Management oversees Tony's touring, brand partnerships and long-form strategy as he moves into the next chapter of a four-decade career.",
    hometown: "Islington, London",
    activeSince: 1976,
    genres: ["Pop", "New Wave", "Soul", "Symphonic"],
    highlights: [
      "Former lead vocalist of Spandau Ballet",
      "Over 25 million records sold globally",
      "Headline symphonic tours across Europe & Australia",
      "'True', 'Gold', 'Through the Barricades' — era-defining vocals"
    ],
    officialUrl: "https://tonyhadley.com",
    socials: [
      { platform: "Instagram", url: "https://instagram.com/tonyhadleyofficial" },
      { platform: "Facebook", url: "https://facebook.com/tonyhadleyofficial" },
      { platform: "X", url: "https://x.com/tonyhadley" }
    ],
    heroPrompt:
      "Cinematic wide shot of a sold-out European arena, smoke-lit stage, a single silhouetted vocalist in a tailored suit bathed in deep blue and amber spotlights, audience hands raised, shot on 35mm film, editorial music photography, high contrast, moody, aspirational.",
    portraitPrompt:
      "Editorial black-and-white portrait of a distinguished British male vocalist in a tailored dark suit, strong jawline, silver-streaked hair, soft rim light, shallow depth of field, shot on medium format film, magazine cover quality.",
    seo: {
      title: "Tony Hadley — Official Management | Blueprint",
      description:
        "Blueprint Management represents Tony Hadley — former Spandau Ballet frontman — for worldwide touring, symphonic shows and strategic career partnerships.",
      keywords: ["Tony Hadley management", "Spandau Ballet", "Tony Hadley tour", "Tony Hadley booking"]
    }
  },
  {
    slug: "abc",
    name: "ABC",
    billing: "ABC",
    tagline: "Martin Fry's era-defining art-pop. Lexicon of Love still in full cinemascope.",
    bio: "Fronted by Martin Fry, ABC delivered one of the most celebrated debut albums in British pop history — The Lexicon of Love — and continue to tour a repertoire of gold-lamé anthems with orchestras and festivals around the world.",
    bioLong:
      "ABC arrived in 1982 with 'The Lexicon of Love' — a record that redefined what pop production could be and minted Martin Fry as one of the great British frontmen. Four decades on, ABC's symphonic tours, new studio work and festival headline slots continue to find new audiences while serving a passionately loyal one. Blueprint Management partners with ABC on worldwide touring strategy, label relationships and brand collaborations.",
    hometown: "Sheffield, UK",
    activeSince: 1980,
    genres: ["Art Pop", "New Romantic", "Soul", "Orchestral"],
    highlights: [
      "'The Lexicon of Love' — No.1 UK debut, Trevor Horn-produced",
      "'Poison Arrow', 'The Look of Love', 'All of My Heart'",
      "Symphonic tours with the BBC Concert Orchestra & Southbank Sinfonia",
      "4+ decades of studio and live output"
    ],
    officialUrl: "https://abcmartinfry.com",
    socials: [
      { platform: "Instagram", url: "https://instagram.com/abc_martinfry" },
      { platform: "Facebook", url: "https://facebook.com/ABCMartinFry" },
      { platform: "X", url: "https://x.com/abcfry" }
    ],
    heroPrompt:
      "Cinematic, editorial concert photograph of an orchestra and pop band on a gold-lit proscenium stage, velvet curtains, conductor silhouette, ornate theatre architecture, warm brass tones over deep navy blue shadows, shot on 65mm, aspirational art-pop aesthetic.",
    portraitPrompt:
      "Editorial portrait of a stylish British frontman in a gold lamé suit jacket, confident posture, soft directional lighting against a deep indigo backdrop, magazine cover treatment, shot on medium format.",
    seo: {
      title: "ABC — Official Management | Blueprint",
      description:
        "Blueprint Management represents ABC, fronted by Martin Fry, for worldwide touring, symphonic engagements and creative partnerships.",
      keywords: ["ABC band management", "Martin Fry", "Lexicon of Love", "ABC tour booking"]
    }
  },
  {
    slug: "go-west",
    name: "Go West",
    billing: "Go West",
    tagline: "Peter Cox & Richard Drummie. Blue-eyed soul architects, forty years on.",
    bio: "Peter Cox and Richard Drummie — the songwriting partnership behind 'We Close Our Eyes', 'Call Me' and 'The King of Wishful Thinking' — remain one of British pop's most enduring duos, touring worldwide and continuing to write.",
    bioLong:
      "Since their 1985 debut, Go West have delivered a catalogue of blue-eyed soul classics that have become the soundtrack to a generation — from 'We Close Our Eyes' through to the Pretty Woman smash 'The King of Wishful Thinking'. Peter Cox and Richard Drummie continue to sell out theatre and festival shows across the UK, Europe and Asia, with new material and re-issues regularly finding fresh audiences. Blueprint oversees touring, publishing strategy and brand collaborations.",
    hometown: "London, UK",
    activeSince: 1982,
    genres: ["Pop", "Blue-Eyed Soul", "Rock"],
    highlights: [
      "'We Close Our Eyes' — BRIT Award for Best British Newcomer",
      "'The King of Wishful Thinking' — Pretty Woman soundtrack, global smash",
      "'Call Me', 'Don't Look Down', 'Faithful'",
      "Sold-out theatre tours across UK, Europe & Asia"
    ],
    officialUrl: "https://gowestofficial.com",
    socials: [
      { platform: "Instagram", url: "https://instagram.com/gowestofficial" },
      { platform: "Facebook", url: "https://facebook.com/gowestofficial" },
      { platform: "X", url: "https://x.com/gowestofficial" }
    ],
    heroPrompt:
      "Two musicians silhouetted on a smoke-filled stage at a twilight open-air festival, mountains in the distance, cinematic blue-hour lighting, cool tones with soft warm highlights, 50mm lens, editorial music photography, aspirational.",
    portraitPrompt:
      "Editorial duo portrait of two British pop musicians in modern tailoring, one holding a vintage Gibson, against a muted navy backdrop, cinematic side light, shot on medium format, magazine cover composition.",
    seo: {
      title: "Go West — Official Management | Blueprint",
      description:
        "Blueprint Management represents Go West (Peter Cox & Richard Drummie) for worldwide touring, publishing and brand partnerships.",
      keywords: ["Go West management", "Peter Cox", "Richard Drummie", "Go West tour", "King of Wishful Thinking"]
    }
  },
  {
    slug: "peter-cox",
    name: "Peter Cox",
    billing: "Peter Cox",
    tagline: "One of Britain's finest voices — solo performance, songwriting and collaboration.",
    bio: "Alongside his work with Go West, Peter Cox tours as a solo artist, celebrated for an intimate acoustic show and a voice frequently cited as one of the finest in British pop.",
    bioLong:
      "Peter Cox's solo work sits alongside his long-running duo Go West as a showcase for one of British pop's most distinctive voices. His 'Peter Cox — Unplugged & Personal' tours take the songbook of Go West and his solo albums to theatre audiences across the UK and Europe, with support from a tight band of long-term collaborators. Blueprint Management works across Peter's solo touring, studio projects and collaborative writing work.",
    hometown: "London, UK",
    activeSince: 1982,
    genres: ["Pop", "Soul", "Acoustic", "Singer-Songwriter"],
    highlights: [
      "One half of Go West",
      "Celebrated 'Unplugged & Personal' solo tours",
      "Multiple solo studio albums",
      "In-demand vocal collaborator"
    ],
    officialUrl: "https://petercoxonline.com",
    socials: [
      { platform: "Instagram", url: "https://instagram.com/petercoxofficial" },
      { platform: "Facebook", url: "https://facebook.com/petercoxofficial" }
    ],
    heroPrompt:
      "Intimate theatre stage with a single acoustic guitarist seated on a stool under a warm gold spotlight, deep navy auditorium in soft focus, editorial concert photography, cinematic depth, shot on 85mm.",
    portraitPrompt:
      "Editorial close-up of a seasoned British male singer, silver hair, gentle expression, in a charcoal roll-neck, natural window light, shallow depth of field, magazine portrait aesthetic.",
    seo: {
      title: "Peter Cox — Official Management | Blueprint",
      description:
        "Blueprint Management represents Peter Cox for solo touring, studio work and collaborative projects alongside Go West.",
      keywords: ["Peter Cox management", "Peter Cox solo", "Go West", "Peter Cox unplugged"]
    }
  },
  {
    slug: "alison-limerick",
    name: "Alison Limerick",
    billing: "Alison Limerick",
    tagline: "The voice of UK dance music royalty. 'Where Love Lives' — and always will.",
    bio: "A defining voice of the UK dance music movement, Alison Limerick's 'Where Love Lives' remains one of the most sampled, covered and celebrated records in club history — and she continues to headline festivals and house nights worldwide.",
    bioLong:
      "Few voices are as instantly recognisable to club audiences as Alison Limerick's. 'Where Love Lives' — originally produced by Frankie Knuckles & David Morales — has become a generational anthem, covered, remixed and sampled continuously since its 1991 release. Alison continues to headline dance festivals, Ibiza residencies and house music events worldwide, while working on new material with a cast of producers and collaborators. Blueprint Management oversees touring, sync rights and brand strategy.",
    hometown: "London, UK",
    activeSince: 1988,
    genres: ["House", "Dance", "Soul", "Garage"],
    highlights: [
      "'Where Love Lives' — club anthem and generational classic",
      "Produced by Frankie Knuckles & David Morales",
      "Headline sets at Glastonbury, Ibiza Rocks, Defected",
      "One of the most sampled vocalists in dance music"
    ],
    officialUrl: "https://alisonlimerick.com",
    socials: [
      { platform: "Instagram", url: "https://instagram.com/alisonlimerick" },
      { platform: "Facebook", url: "https://facebook.com/alisonlimerickofficial" }
    ],
    heroPrompt:
      "Cinematic wide shot of a packed outdoor dance festival at sunset, stage rigging and lasers, euphoric crowd silhouettes with hands in the air, deep magenta and electric blue lighting, haze, 35mm film aesthetic, editorial music photography.",
    portraitPrompt:
      "Editorial portrait of a confident Black British female vocalist, natural afro, bold eye makeup, wearing a structured navy blazer, strong magazine cover lighting, shot on medium format, aspirational and iconic.",
    seo: {
      title: "Alison Limerick — Official Management | Blueprint",
      description:
        "Blueprint Management represents Alison Limerick for worldwide touring, festival headline bookings, sync rights and new music projects.",
      keywords: ["Alison Limerick management", "Where Love Lives", "house music vocalist", "Alison Limerick booking"]
    }
  }
];

export const getArtistBySlug = (slug: string) =>
  artists.find((a) => a.slug === slug);
