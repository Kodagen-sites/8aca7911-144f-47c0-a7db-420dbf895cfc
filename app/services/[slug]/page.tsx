import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import PageHero from "@/components/PageHero";
import FadeUp from "@/components/motion/FadeUp";
import ProductGrid from "@/components/ProductGrid";

const SLOT_BY_SLUG: Record<string, string> = {
  "dresses": "service-dresses",
  "two-piece-sets": "service-two-piece-sets",
  "headwraps-accessories": "service-headwraps-accessories",
  "limited-drops": "service-limited-drops",
};

const CATEGORY_BY_SLUG: Record<string, string> = {
  "dresses": "Dresses",
  "two-piece-sets": "Two-piece sets",
  "headwraps-accessories": "Headwraps & accessories",
  "limited-drops": "Limited seasonal drops",
};

export async function generateStaticParams() {
  return siteConfig.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const service = siteConfig.services.find((s) => s.slug === slug);
  if (!service) return { title: "Not found" };
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServiceDetail(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = siteConfig.services.find((s) => s.slug === slug);
  if (!service) notFound();

  const category = CATEGORY_BY_SLUG[slug];
  const products = siteConfig.products.filter((p) => p.category === category);
  const heroImage = (assetManifest as any).images?.[SLOT_BY_SLUG[slug]] || "";

  const others = siteConfig.services.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHero
        eyebrow={`Category · ${service.name}`}
        title={`${service.name}.`}
        intro={service.long}
        image={heroImage}
      />

      <section className="section-pad bg-bg">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-8 space-y-6">
              <FadeUp>
                <div className="eyebrow mb-4">What&rsquo;s in this drawer</div>
              </FadeUp>
              <FadeUp delay={0.05}>
                <h2 className="h-display text-ink mb-6" style={{ fontSize: "clamp(30px, 4.5vw, 52px)" }}>
                  Small runs, hand-finished.
                </h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="text-lg text-ink-soft leading-relaxed">
                  {service.description}
                </p>
              </FadeUp>
              <FadeUp delay={0.15}>
                <ul className="space-y-4 mt-6">
                  {service.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-3 text-ink-soft">
                      <span className="mt-2 h-px w-6 bg-accent flex-shrink-0" />
                      <span className="text-base">{cap}</span>
                    </li>
                  ))}
                </ul>
              </FadeUp>
            </div>
            <aside className="lg:col-span-4">
              <div className="sticky top-32 bg-card border border-border rounded-sm p-6">
                <div className="eyebrow mb-3">Also in the atelier</div>
                <ul className="space-y-3">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/services/${o.slug}`}
                        className="group flex items-center justify-between text-ink hover:text-accent transition-colors"
                      >
                        <span className="font-display text-lg">{o.name}</span>
                        <span aria-hidden className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="section-pad bg-[#EDE0CD]">
          <div className="container-wide">
            <div className="mb-12">
              <FadeUp>
                <div className="eyebrow mb-3">In this category</div>
              </FadeUp>
              <FadeUp delay={0.05}>
                <h2 className="h-display text-ink" style={{ fontSize: "clamp(32px, 5vw, 60px)" }}>
                  Currently in the run.
                </h2>
              </FadeUp>
            </div>
            <ProductGrid products={products} />
          </div>
        </section>
      )}

      <section className="section-pad bg-bg">
        <div className="container-narrow text-center">
          <FadeUp>
            <div className="eyebrow mb-4">Next in the atelier</div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="h-display text-ink mb-8" style={{ fontSize: "clamp(32px, 5vw, 60px)" }}>
              Get first look at the next drop.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link href="/contact" className="btn-primary">
              Join the list
              <span aria-hidden>→</span>
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
