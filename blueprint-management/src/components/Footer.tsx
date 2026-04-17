import Link from "next/link";
import Logo from "./Logo";
import { siteConfig } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const { footerLinks } = siteConfig;

  return (
    <footer className="relative bg-ink text-white mt-24">
      <div className="absolute inset-0 bg-radial-brand opacity-80 pointer-events-none" />
      <div className="container-editorial relative py-20 md:py-24 grid grid-cols-2 md:grid-cols-6 gap-10">
        <div className="col-span-2 md:col-span-2 flex flex-col gap-6">
          <Logo variant="light" />
          <p className="text-sm text-white/70 max-w-sm">
            Boutique artist management. Over 50 years of building careers, not
            campaigns. Based in the United Kingdom, representing artists
            worldwide.
          </p>
          <Link
            href="/contact"
            className="btn-primary self-start text-sm"
          >
            Enquire with Blueprint
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <FooterColumn title="Company" items={footerLinks.company} />
        <FooterColumn title="For Artists" items={footerLinks.resources} />
        <FooterColumn
          title="Industry"
          items={footerLinks.industry}
          rel="nofollow"
        />
        <FooterColumn title="Legal" items={footerLinks.legal} />
      </div>

      <div className="container-editorial relative border-t border-white/10 py-8 flex flex-col gap-5 text-xs text-white/50">
        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          <p className="leading-relaxed max-w-3xl">
            {siteConfig.name} is a boutique artist management company based at
            71&ndash;75 Shelton Street, Covent Garden, London WC2H 9JQ.
            Registered in England &amp; Wales. All artist names, logos and
            trademarks referenced on this site remain the property of their
            respective owners. Blueprint receives a high volume of unsolicited
            material &mdash; we listen to everything submitted but cannot
            guarantee a response to every enquiry. Submission of any material
            does not create a management, agency or representation agreement;
            representation is only established in writing. Nothing on this site
            constitutes legal, financial or investment advice.
          </p>
          <p className="md:text-right">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <span className="mx-2">&middot;</span>
            <Link href="/cookies" className="hover:text-white">
              Cookies
            </Link>
            <span className="mx-2">&middot;</span>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <span className="mx-2">&middot;</span>
            <Link href="/sitemap.xml" className="hover:text-white">
              Sitemap
            </Link>
          </p>
        </div>
        <p>
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  rel
}: {
  title: string;
  items: { label: string; href: string; external?: boolean }[];
  rel?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-wider2 text-white/40">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel={`noopener ${rel ?? ""}`.trim()}
                className="text-sm text-white/80 hover:text-white"
              >
                {item.label} ↗
              </a>
            ) : (
              <Link
                href={item.href}
                className="text-sm text-white/80 hover:text-white"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
