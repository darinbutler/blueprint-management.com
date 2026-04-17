import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/data/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Boutique Artist Management. 50+ Years.`,
    template: `%s — ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    "artist management UK",
    "boutique music management",
    "band management agency",
    "emerging artist management",
    "music industry management",
    "Tony Hadley management",
    "ABC band management",
    "Go West management",
    "Alison Limerick management",
    "Peter Cox management"
  ],
  authors: [{ name: "Blueprint Management" }],
  creator: "Blueprint Management",
  publisher: "Blueprint Management",
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Boutique Artist Management`,
    description: siteConfig.description,
    images: [
      {
        url: "/og/default.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Boutique Artist Management`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Boutique Artist Management`,
    description: siteConfig.description,
    images: ["/og/default.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }
    ],
    apple: "/apple-touch-icon.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#143db8",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: siteConfig.description,
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB"
    },
    founder: { "@type": "Person", name: "Matt Glover" }
  };

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
