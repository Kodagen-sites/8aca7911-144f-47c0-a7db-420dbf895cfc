"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import FadeUp from "@/components/motion/FadeUp";

/**
 * Image mosaic lookbook — T5 with editorial cropping.
 */
export default function LookbookSection() {
  const tiles = siteConfig.work.slice(0, 4);
  return (
    <section id="lookbook" className="relative section-pad bg-bg">
      <div className="container-wide">
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <FadeUp>
              <div className="eyebrow mb-4">The lookbook</div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="h-display text-ink" style={{ fontSize: "clamp(42px, 6vw, 88px)" }}>
                Small drops,<br />
                <span className="italic text-accent" style={{ fontWeight: 400 }}>bigger stories.</span>
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.1}>
            <Link href="/work" className="btn-secondary self-start lg:self-end">
              See every drop
              <span aria-hidden>→</span>
            </Link>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {tiles.map((tile, i) => {
            const image = (assetManifest as any).images?.[tile.cover] || "";
            const layouts = [
              "md:col-span-7 aspect-[16/11]",
              "md:col-span-5 aspect-[4/5]",
              "md:col-span-5 aspect-[4/5]",
              "md:col-span-7 aspect-[16/11]",
            ];
            return (
              <motion.div
                key={tile.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden rounded-sm group ${layouts[i]}`}
              >
                <Link href={`/work#${tile.slug}`} className="block absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={tile.title}
                    className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-ink/10 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-ink/85 via-ink/50 to-transparent text-[#F5EDE3]">
                    <div className="text-[10px] tracking-[0.24em] uppercase text-[#E5C9A8] mb-1">
                      {tile.season}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl" style={{ fontWeight: 500 }}>
                      {tile.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
