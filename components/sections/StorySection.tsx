"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import FadeUp from "@/components/motion/FadeUp";
import ImageRevealMask from "@/components/motion/ImageRevealMask";

/**
 * SY4 — Atelier editorial. Text left, image right, warm cream backdrop.
 */
export default function StorySection() {
  const image = (assetManifest as any).images?.["section-about-hero"] || "";
  return (
    <section id="atelier" className="relative section-pad bg-bg">
      <div className="container-wide grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <FadeUp>
            <div className="eyebrow mb-4">{siteConfig.story.eyebrow}</div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="h-display text-ink mb-8" style={{ fontSize: "clamp(40px, 6vw, 84px)" }}>
              {siteConfig.story.heading}
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-lg text-ink-soft leading-relaxed max-w-lg mb-10">
              {siteConfig.story.body}
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <Link href={siteConfig.story.ctaHref} className="btn-secondary">
              {siteConfig.story.ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </FadeUp>
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2">
          <ImageRevealMask
            src={image}
            alt="Inside the Lane Proof Atelier workroom in Lagos"
            aspectClass="aspect-[4/5]"
            direction="bottom"
            duration={1.2}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mt-6 flex items-center gap-4 text-sm text-ink-muted"
          >
            <span className="h-px w-10 bg-accent" />
            <span className="tracking-[0.24em] uppercase">Ikoyi, Lagos</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
