"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import FadeUp from "@/components/motion/FadeUp";
import CardTiltLayer from "@/components/motion/CardTiltLayer";
import { AddToCart } from "@/components/cart/AddToCart";

/**
 * FP2 — Featured product grid on the home page.
 */
export default function FeaturedProducts() {
  const featured = siteConfig.products.slice(0, 4);
  return (
    <section id="featured" className="relative section-pad bg-bg">
      <div className="container-wide">
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <FadeUp>
              <div className="eyebrow mb-4">In the shop now</div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="h-display text-ink" style={{ fontSize: "clamp(38px, 6vw, 80px)" }}>
                Cloth,<br />
                <span className="italic text-accent" style={{ fontWeight: 400 }}>on the table.</span>
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.1}>
            <Link href="/services" className="btn-secondary self-start md:self-end">
              Shop everything
              <span aria-hidden>→</span>
            </Link>
          </FadeUp>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8"
        >
          {featured.map((product) => {
            const image = (assetManifest as any).images?.[product.image] || "";
            return (
              <motion.div
                key={product.slug}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <CardTiltLayer intensity={4}>
                  <article className="group">
                    <Link href={`/services/${slugFromCategory(product.category)}`} className="block relative aspect-[3/4] overflow-hidden rounded-sm bg-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-ink/10 pointer-events-none" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-bg/85 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-ink">
                        {product.category.split(" ")[0]}
                      </div>
                    </Link>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-lg md:text-xl text-ink truncate" style={{ fontWeight: 500 }}>
                          {product.name}
                        </h3>
                        <p className="text-sm text-ink-muted">{product.material}</p>
                      </div>
                      <span className="font-body text-sm text-accent font-medium whitespace-nowrap">
                        {product.priceDisplay}
                      </span>
                    </div>
                    <div className="mt-3">
                      <AddToCart
                        product={{
                          id: product.slug,
                          name: product.name,
                          priceCents: product.price * 100,
                          imageUrl: image,
                        }}
                        className="w-full text-xs uppercase tracking-[0.18em] py-2.5 rounded-full border border-border-strong text-ink hover:bg-ink hover:text-card transition-all"
                      >
                        Add to cart
                      </AddToCart>
                    </div>
                  </article>
                </CardTiltLayer>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function slugFromCategory(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "dresses";
}
