"use client";

import { motion } from "framer-motion";
import assetManifest from "@/content/asset-manifest.json";
import CardTiltLayer from "@/components/motion/CardTiltLayer";
import { AddToCart } from "@/components/cart/AddToCart";

type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  priceDisplay: string;
  description: string;
  material: string;
  image: string;
  sizes: readonly string[] | string[];
  inStock: boolean;
};

export default function ProductGrid({ products }: { products: readonly Product[] | Product[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
    >
      {products.map((product) => {
        const image = (assetManifest as any).images?.[product.image] || "";
        return (
          <motion.article
            key={product.slug}
            variants={{
              hidden: { opacity: 0, y: 32 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="group"
          >
            <CardTiltLayer intensity={4}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-ink/10 pointer-events-none" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-bg/85 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-ink">
                  {product.category.split(" ")[0]}
                </div>
              </div>
            </CardTiltLayer>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-lg md:text-xl text-ink truncate" style={{ fontWeight: 500 }}>
                  {product.name}
                </h3>
                <p className="text-xs text-ink-muted">{product.material}</p>
              </div>
              <span className="font-body text-sm text-accent font-medium whitespace-nowrap">
                {product.priceDisplay}
              </span>
            </div>
            <p className="text-sm text-ink-soft leading-relaxed mt-2 line-clamp-2">
              {product.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <AddToCart
                product={{
                  id: product.slug,
                  name: product.name,
                  priceCents: product.price * 100,
                  imageUrl: image,
                }}
                className="flex-1 text-xs uppercase tracking-[0.18em] py-2.5 rounded-full border border-border-strong text-ink hover:bg-ink hover:text-card transition-all"
              >
                Add to cart
              </AddToCart>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
