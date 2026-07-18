import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import { SocialLinks } from "@/components/social-icons";

const year = new Date().getFullYear();

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Lookbook" },
  { href: "/services", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const { email, phone, location } = siteConfig.company;
  return (
    <footer className="relative z-20 bg-bg border-t border-border">
      <div className="container-wide py-16">
        <div
          className="font-display uppercase tracking-tight text-ink leading-[0.88]"
          style={{ fontSize: "clamp(56px, 13vw, 220px)", fontWeight: 500 }}
        >
          Lane Proof
        </div>
        <div
          className="font-display tracking-tight text-accent leading-[0.88] mt-1"
          style={{ fontSize: "clamp(40px, 9vw, 160px)", fontWeight: 400, fontStyle: "italic" }}
        >
          atelier
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-border pt-10">
          <div className="space-y-4">
            <h4 className="eyebrow">The atelier</h4>
            <p className="text-sm text-ink-soft leading-relaxed max-w-sm">
              {siteConfig.company.description}
            </p>
            <SocialLinks socials={siteConfig.socials} className="pt-2 gap-4 text-ink-soft hover:[&_svg]:text-accent" iconClassName="h-5 w-5" />
          </div>

          <div className="space-y-4">
            <h4 className="eyebrow">Wander</h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ink transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="eyebrow">Reach us</h4>
            <ul className="space-y-2 text-sm text-ink-soft">
              {email && (
                <li className="flex items-start gap-2">
                  <Mail size={14} className="mt-1 text-accent flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-ink">{email}</a>
                </li>
              )}
              {phone && (
                <li className="flex items-start gap-2">
                  <Phone size={14} className="mt-1 text-accent flex-shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-ink">{phone}</a>
                </li>
              )}
              {location && (
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="mt-1 text-accent flex-shrink-0" />
                  <span>{location}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row gap-4 text-xs text-ink-muted font-body">
          <div>© {year} {siteConfig.company.name}. All rights reserved.</div>
          <div className="flex gap-6">
            {siteConfig.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ink">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
