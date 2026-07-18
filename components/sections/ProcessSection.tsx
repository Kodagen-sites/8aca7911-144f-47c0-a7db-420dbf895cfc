"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import FadeUp from "@/components/motion/FadeUp";

/**
 * T15-inspired split — image left with sticky, steps right stacking.
 */
export default function ProcessSection() {
  const image = (assetManifest as any).images?.["section-founder"] || "";
  return (
    <section id="process" className="relative section-pad bg-[#EDE0CD]">
      <div className="container-wide grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <FadeUp>
              <div className="eyebrow mb-4">How we work</div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="h-display text-ink mb-8" style={{ fontSize: "clamp(38px, 5.5vw, 72px)" }}>
                {siteConfig.whyUs.heading}
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-ink-soft leading-relaxed mb-8 max-w-md">
                {siteConfig.whyUs.body}
              </p>
            </FadeUp>
            <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="The atelier at work"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          {siteConfig.process.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="relative bg-card border border-border rounded-sm p-8 md:p-10 hover:border-accent transition-colors duration-500"
            >
              <div className="flex items-baseline gap-6 mb-4">
                <span
                  className="font-display text-accent"
                  style={{ fontSize: "clamp(56px, 7vw, 96px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1 }}
                >
                  {step.step}
                </span>
                <h3 className="h-display text-ink" style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}>
                  {step.title}.
                </h3>
              </div>
              <p className="text-ink-soft leading-relaxed max-w-xl">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
