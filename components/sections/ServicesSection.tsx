"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import FadeUp from "@/components/motion/FadeUp";

const SLOT_BY_SLUG: Record<string, string> = {
  "dresses": "service-dresses",
  "two-piece-sets": "service-two-piece-sets",
  "headwraps-accessories": "service-headwraps-accessories",
  "limited-drops": "service-limited-drops",
};

/**
 * SV1 — Alternating full-bleed. 2-column image + text, direction flips per row.
 */
export default function ServicesSection() {
  return (
    <section id="collection" className="relative section-pad bg-[#EDE0CD]">
      <div className="container-wide">
        <div className="mb-16 md:mb-24 max-w-3xl">
          <FadeUp>
            <div className="eyebrow mb-4">{siteConfig.servicesEyebrow}</div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="h-display text-ink" style={{ fontSize: "clamp(44px, 7vw, 96px)" }}>
              {siteConfig.servicesHeading}.
            </h2>
          </FadeUp>
        </div>

        <div className="space-y-24 md:space-y-32">
          {siteConfig.services.map((service, i) => {
            const slot = SLOT_BY_SLUG[service.slug] || "section-showcase-1";
            const image = (assetManifest as any).images?.[slot] || "";
            const flip = i % 2 === 1;
            return (
              <div
                key={service.slug}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center"
              >
                <motion.div
                  initial={{ opacity: 0, x: flip ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className={`lg:col-span-7 relative aspect-[4/5] md:aspect-[16/11] overflow-hidden rounded-sm group ${
                    flip ? "lg:order-2" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-ink/10 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-bg/85 backdrop-blur-md px-3 py-1.5 text-[10px] tracking-[0.22em] uppercase text-ink">
                    0{i + 1}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, delay: 0.15 }}
                  className={`lg:col-span-5 ${flip ? "lg:order-1 lg:pr-8" : "lg:pl-8"}`}
                >
                  <div className="eyebrow mb-4">Category · 0{i + 1}</div>
                  <h3
                    className="h-display text-ink mb-6"
                    style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
                  >
                    {service.name}.
                  </h3>
                  <p className="text-base md:text-lg text-ink-soft leading-relaxed mb-6">
                    {service.long}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {service.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-3 text-sm text-ink-soft">
                        <span className="mt-2 h-px w-4 bg-accent flex-shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                  >
                    <span>Shop {service.name.toLowerCase()}</span>
                    <span aria-hidden>→</span>
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
