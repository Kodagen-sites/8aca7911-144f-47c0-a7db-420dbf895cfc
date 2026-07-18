import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import PageHero from "@/components/PageHero";
import FadeUp from "@/components/motion/FadeUp";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "A rolling archive of Lane Proof Atelier drops — small collections cut in Lagos, then retired.",
};

export default function WorkPage() {
  const heroImage = (assetManifest as any).images?.["section-work-hero"] || "";

  return (
    <>
      <PageHero
        eyebrow="The lookbook"
        title="Every drop we've cut."
        intro="A rolling archive of small runs — most retired, some available while pieces remain."
        image={heroImage}
      />

      <section className="section-pad bg-bg">
        <div className="container-wide space-y-24 md:space-y-40">
          {siteConfig.work.map((drop, i) => {
            const image = (assetManifest as any).images?.[drop.cover] || "";
            const flip = i % 2 === 1;
            return (
              <article
                key={drop.slug}
                id={drop.slug}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center ${
                  flip ? "" : ""
                }`}
              >
                <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  <FadeUp>
                    <div className="relative aspect-[16/11] overflow-hidden rounded-sm group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={drop.title}
                        className="w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-ink/10 pointer-events-none" />
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-bg/90 backdrop-blur-md text-[10px] uppercase tracking-[0.22em] text-ink">
                        Drop · 0{i + 1}
                      </div>
                    </div>
                  </FadeUp>
                </div>
                <div className={`lg:col-span-5 ${flip ? "lg:order-1 lg:pr-4" : "lg:pl-4"}`}>
                  <FadeUp>
                    <div className="eyebrow mb-4">{drop.season}</div>
                  </FadeUp>
                  <FadeUp delay={0.05}>
                    <h2 className="h-display text-ink mb-6" style={{ fontSize: "clamp(36px, 5vw, 68px)" }}>
                      {drop.title}.
                    </h2>
                  </FadeUp>
                  <FadeUp delay={0.1}>
                    <p className="text-lg text-ink-soft leading-relaxed mb-6">
                      {drop.body}
                    </p>
                  </FadeUp>
                  <FadeUp delay={0.15}>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-2 text-ink-muted">
                        <span className="h-px w-6 bg-accent" />
                        Small run, retired
                      </span>
                      {i === 0 && (
                        <Link
                          href="/services"
                          className="inline-flex items-center gap-1.5 text-accent font-medium hover:text-accent-dark"
                        >
                          Shop remainders <span aria-hidden>→</span>
                        </Link>
                      )}
                    </div>
                  </FadeUp>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-pad bg-[#EDE0CD]">
        <div className="container-narrow text-center">
          <FadeUp>
            <div className="eyebrow mb-4">Coming next</div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="h-display text-ink mb-8" style={{ fontSize: "clamp(38px, 6vw, 80px)" }}>
              First look at the next drop.
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
