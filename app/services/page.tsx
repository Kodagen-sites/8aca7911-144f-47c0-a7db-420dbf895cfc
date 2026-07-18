import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import PageHero from "@/components/PageHero";
import FadeUp from "@/components/motion/FadeUp";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Shop the atelier",
  description:
    "Small-batch dresses, two-piece sets, headwraps, and seasonal drops from Lane Proof Atelier in Lagos.",
};

const SLOT_BY_SLUG: Record<string, string> = {
  "dresses": "service-dresses",
  "two-piece-sets": "service-two-piece-sets",
  "headwraps-accessories": "service-headwraps-accessories",
  "limited-drops": "service-limited-drops",
};

export default function ServicesPage() {
  const heroImage = (assetManifest as any).images?.["section-services-hero"] || "";

  return (
    <>
      <PageHero
        eyebrow="The shop"
        title="Small-batch, all year."
        intro="Every piece is patterned, cut, and hand-finished in Ikoyi. Cloth first, restraint second, and never a restock."
        image={heroImage}
      />

      <section className="section-pad bg-bg">
        <div className="container-wide">
          <div className="mb-14">
            <FadeUp>
              <div className="eyebrow mb-3">The categories</div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="h-display text-ink" style={{ fontSize: "clamp(36px, 5vw, 68px)" }}>
                What we make.
              </h2>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteConfig.services.map((service, i) => {
              const slot = SLOT_BY_SLUG[service.slug] || "section-showcase-1";
              const image = (assetManifest as any).images?.[slot] || "";
              return (
                <FadeUp key={service.slug} delay={i * 0.06}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block bg-card border border-border rounded-sm overflow-hidden hover:border-accent transition-colors duration-500"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-ink/10 pointer-events-none" />
                    </div>
                    <div className="p-6">
                      <div className="eyebrow text-xs mb-2">Category · 0{i + 1}</div>
                      <h3 className="font-display text-ink text-2xl mb-2" style={{ fontWeight: 500 }}>
                        {service.name}
                      </h3>
                      <p className="text-sm text-ink-soft leading-relaxed">
                        {service.description}
                      </p>
                      <div className="mt-4 text-xs text-accent uppercase tracking-[0.18em] font-medium">
                        Shop &rarr;
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[#EDE0CD]">
        <div className="container-wide">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <FadeUp>
                <div className="eyebrow mb-3">All pieces</div>
              </FadeUp>
              <FadeUp delay={0.05}>
                <h2 className="h-display text-ink" style={{ fontSize: "clamp(34px, 5vw, 64px)" }}>
                  Everything in the shop.
                </h2>
              </FadeUp>
            </div>
            <FadeUp delay={0.1}>
              <p className="max-w-sm text-sm text-ink-soft leading-relaxed">
                Numbers are honest — most silhouettes ship in a run of 12&ndash;24 and are retired once the run finishes.
              </p>
            </FadeUp>
          </div>

          <ProductGrid products={siteConfig.products} />
        </div>
      </section>
    </>
  );
}
