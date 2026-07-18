"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import MagneticButton from "@/components/motion/MagneticButton";

const heroVideoSlot = "scene-1";
const heroPosterSlot = "section-services-hero";

export default function HeroSection({
  headlineOverride,
  sublineOverride,
  eyebrowOverride,
}: {
  headlineOverride?: string;
  sublineOverride?: string;
  eyebrowOverride?: string;
} = {}) {
  const videoUrl = (assetManifest as any).videos?.[heroVideoSlot] || "";
  const posterUrl = (assetManifest as any).images?.[heroPosterSlot] || "";
  const eyebrowText = eyebrowOverride || siteConfig.hero.eyebrow;
  const sublineText = sublineOverride || siteConfig.hero.subhead;
  // headlineOverride, if provided from CMS, replaces the multi-line H1 with a single line
  const headlineLinesOverride = headlineOverride ? [headlineOverride] : null;

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-bg">
      {/* Video / poster — right two-thirds respected via composition; full-bleed cover */}
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={posterUrl}
            className="w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt="Lane Proof Atelier — Lagos womenswear studio"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#E5C9A8] via-[#F5EDE3] to-[#B3542D]" />
        )}
      </div>

      {/* Warm cream scrim from top-left so H1 sits on legible cream, not on the image */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(245,237,227,0.94) 0%, rgba(245,237,227,0.86) 32%, rgba(245,237,227,0.42) 52%, rgba(59,36,24,0.05) 100%)",
        }}
      />

      {/* HO5 big-stack — H1 owns top-left, subject respected in right two-thirds by prompt */}
      <div className="relative z-10 h-full container-wide flex flex-col justify-between py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12 md:pt-16"
        >
          <div className="eyebrow mb-6">{eyebrowText}</div>

          <h1
            className="h-display text-ink"
            style={{ fontSize: "clamp(64px, 11vw, 180px)" }}
          >
            {(headlineLinesOverride ?? siteConfig.hero.h1Lines).map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block"
                style={i === 2 ? { fontStyle: "italic", color: "var(--color-accent)", fontWeight: 400 } : undefined}
              >
                {line}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 max-w-6xl"
        >
          <p className="max-w-md text-base md:text-lg text-ink-soft leading-relaxed">
            {sublineText}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <MagneticButton
              as="a"
              href={siteConfig.hero.ctaPrimary.href}
              className="btn-primary"
            >
              {siteConfig.hero.ctaPrimary.label}
              <span aria-hidden>→</span>
            </MagneticButton>
            <Link href={siteConfig.hero.ctaSecondary.href} className="btn-secondary">
              {siteConfig.hero.ctaSecondary.label}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
