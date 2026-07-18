import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import PageHero from "@/components/PageHero";
import FadeUp from "@/components/motion/FadeUp";

export const metadata: Metadata = {
  title: "The atelier",
  description:
    "Lane Proof Atelier is a Lagos womenswear studio designing small-batch dresses and accessories in limited runs.",
};

export default function AboutPage() {
  const heroImage = (assetManifest as any).images?.["section-about-hero"] || "";
  const founderImage = (assetManifest as any).images?.["section-founder"] || "";

  return (
    <>
      <PageHero
        eyebrow="Our atelier"
        title={siteConfig.aboutHeading}
        intro="A Lagos studio designing contemporary African womenswear in limited seasonal runs."
        image={heroImage}
      />

      <section className="section-pad bg-bg">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 space-y-6">
              <FadeUp>
                <p className="text-xl md:text-2xl text-ink leading-relaxed font-display" style={{ fontWeight: 400 }}>
                  {siteConfig.aboutStory}
                </p>
              </FadeUp>
              <FadeUp delay={0.05}>
                <p className="text-base text-ink-soft leading-relaxed">
                  The pieces we make are built to be kept — worn, softened,
                  passed on. That is what a small batch buys the wearer: not
                  scarcity, but care. Every silhouette is patterned once, cut in
                  small runs, and retired when the run is finished.
                </p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="text-base text-ink-soft leading-relaxed">
                  Our fabrics come from West African hand-looms, organic
                  cotton fields, and silk blends we&rsquo;ve tested against
                  every Lagos season. If a fabric will not hold through five
                  years of wear, it does not leave the studio.
                </p>
              </FadeUp>
            </div>
            <aside className="lg:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={founderImage}
                  alt="Inside the atelier"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <div className="eyebrow mb-3">The values</div>
                <ul className="space-y-3 text-sm text-ink-soft">
                  {siteConfig.whyUs.points.map((v) => (
                    <li key={v.title}>
                      <span className="text-ink font-medium">{v.title}.</span>{" "}
                      {v.body}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-pad bg-[#EDE0CD]">
        <div className="container-wide">
          <FadeUp>
            <div className="eyebrow mb-6">The workroom</div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="h-display text-ink mb-10" style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}>
              Every seam is a decision.
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteConfig.process.map((step) => (
              <div key={step.step} className="bg-card border border-border p-8 rounded-sm">
                <div className="font-display text-accent text-4xl mb-3" style={{ fontStyle: "italic", fontWeight: 400 }}>
                  {step.step}
                </div>
                <h3 className="h-display text-ink text-xl mb-3">{step.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/services" className="btn-primary">
              Shop the atelier
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
