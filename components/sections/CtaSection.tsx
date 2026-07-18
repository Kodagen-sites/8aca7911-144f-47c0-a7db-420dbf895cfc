"use client";

import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import FadeUp from "@/components/motion/FadeUp";
import MagneticButton from "@/components/motion/MagneticButton";

/**
 * CTA1 magnetic button, over full-bleed CTA image.
 */
export default function CtaSection() {
  const bg = (assetManifest as any).images?.["section-cta"] || "";
  return (
    <section id="join" className="relative overflow-hidden">
      <div className="absolute inset-0">
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt="" className="w-full h-full object-cover" loading="lazy" />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(59,36,24,0.55) 0%, rgba(59,36,24,0.72) 60%, rgba(59,36,24,0.86) 100%)",
          }}
        />
      </div>

      <div className="relative section-pad container-narrow text-center">
        <FadeUp>
          <div className="eyebrow text-[#E5C9A8] mb-6">{siteConfig.cta.eyebrow}</div>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h2 className="h-display text-[#F5EDE3] mb-6" style={{ fontSize: "clamp(44px, 7vw, 96px)" }}>
            {siteConfig.cta.heading}
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="text-lg text-[#F5EDE3]/80 leading-relaxed max-w-xl mx-auto mb-10">
            {siteConfig.cta.body}
          </p>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              as="a"
              href={siteConfig.cta.ctaPrimary.href}
              className="btn-primary"
            >
              {siteConfig.cta.ctaPrimary.label}
              <span aria-hidden>→</span>
            </MagneticButton>
            <Link
              href={siteConfig.cta.ctaSecondary.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#F5EDE3]/40 text-[#F5EDE3] hover:bg-[#F5EDE3]/10 transition-all text-sm"
            >
              {siteConfig.cta.ctaSecondary.label}
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
