import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import PageHero from "@/components/PageHero";
import FadeUp from "@/components/motion/FadeUp";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the atelier — for shop questions, custom fits, or a first look at the next drop.",
};

export default function ContactPage() {
  const heroImage = (assetManifest as any).images?.["section-contact-hero"] || "";
  return (
    <>
      <PageHero
        eyebrow="Reach the atelier"
        title="Say hello."
        intro="For a fit question, a custom brief, or the next-drop list — write to us."
        image={heroImage}
      />

      <section className="section-pad bg-bg">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <FadeUp>
              <div className="eyebrow mb-4">Write to us</div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="h-display text-ink mb-8" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
                Send a note.
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <ContactForm />
            </FadeUp>
          </div>

          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-card border border-border rounded-sm p-8">
              <div className="eyebrow mb-4">Where we are</div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-1 text-accent flex-shrink-0" />
                  <div>
                    <div className="text-ink font-medium">Ikoyi, Lagos</div>
                    <div className="text-sm text-ink-muted">12 Ilabere Avenue · Ikoyi · Nigeria</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={16} className="mt-1 text-accent flex-shrink-0" />
                  <a href={`mailto:${siteConfig.company.email}`} className="text-ink hover:text-accent">
                    {siteConfig.company.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={16} className="mt-1 text-accent flex-shrink-0" />
                  <a href={`tel:${siteConfig.company.phone}`} className="text-ink hover:text-accent">
                    {siteConfig.company.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={16} className="mt-1 text-accent flex-shrink-0" />
                  <div>
                    <div className="text-ink font-medium">By appointment</div>
                    <div className="text-sm text-ink-muted">Tue &ndash; Sat · 11am to 5pm WAT</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <iframe
                title="Lane Proof Atelier location"
                src="https://www.google.com/maps?q=Ikoyi+Lagos+Nigeria&output=embed"
                className="w-full h-full grayscale-[0.1] contrast-[0.9]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/15 pointer-events-none" />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
