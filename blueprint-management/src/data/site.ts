export const siteConfig = {
  name: "Blueprint Management",
  shortName: "Blueprint",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blueprint-management.com",
  description:
    "Blueprint is a UK-based boutique artist management company with over 50 years of experience, building careers — not headlines — for a select roster of world-class recording artists.",
  tagline: "Careers, not campaigns.",
  foundedYear: 1974,
  founderName: "John Glover",
  contact: {
    email: "butlerdarin@gmail.com",
    // Update in production
    phone: "+44 (0)20 0000 0000",
    address: "71\u201375 Shelton Street, Covent Garden, London WC2H 9JQ"
  },
  nav: [
    { label: "Roster", href: "/roster" },
    { label: "About", href: "/about" },
    { label: "Legacy", href: "/legacy" },
    { label: "Contact", href: "/contact" }
  ],
  footerLinks: {
    company: [
      { label: "About Blueprint", href: "/about" },
      { label: "Our Roster", href: "/roster" },
      { label: "Legacy", href: "/legacy" },
      { label: "Contact", href: "/contact" }
    ],
    resources: [
      { label: "For Emerging Artists", href: "/for-emerging-artists" },
      { label: "Artist Development", href: "/services/artist-development" },
      { label: "Touring & Agency", href: "/services/touring-agency" },
      { label: "Career Management", href: "/services/career-management" }
    ],
    industry: [
      { label: "MMF — Music Managers Forum", href: "https://themmf.net/", external: true },
      { label: "IMMF — International Music Managers Forum", href: "https://immf.com/", external: true },
      { label: "Featured Artists Coalition", href: "https://www.thefac.org/", external: true },
      { label: "UK Music", href: "https://www.ukmusic.org/", external: true }
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Sitemap", href: "/sitemap.xml" }
    ]
  }
};

export type SiteConfig = typeof siteConfig;
