"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/content/site-config";
import FadeUp from "@/components/motion/FadeUp";

/**
 * MV8 — Luxury retail. Big display statement lines with hairline dividers.
 */
export default function ManifestoSection() {
  return (
    <section className="relative section-pad bg-ink text-[#F5EDE3] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-transparent to-accent" />
      </div>

      <div className="relative container-wide">
        <FadeUp>
          <div className="eyebrow text-accent mb-10">{siteConfig.manifesto.eyebrow}</div>
        </FadeUp>

        <div className="max-w-6xl">
          {siteConfig.manifesto.lines.map((line, i) => (
            <div key={i} className="border-b border-white/12 py-6 md:py-10 first:border-t">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="h-display leading-[0.98] text-[#F5EDE3]"
                style={{
                  fontSize: "clamp(38px, 6.5vw, 90px)",
                  fontWeight: i % 2 === 0 ? 500 : 400,
                  fontStyle: i % 2 === 0 ? "normal" : "italic",
                }}
              >
                <span className="text-accent mr-3 md:mr-6 font-body text-[0.28em] tracking-[0.24em] uppercase align-middle inline-block">
                  0{i + 1}
                </span>
                {line}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
