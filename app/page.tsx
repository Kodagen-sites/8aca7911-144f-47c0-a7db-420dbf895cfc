import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import { getSiteContent } from "@/lib/site-content";
import HeroSection from "@/components/sections/HeroSection";
import StorySection from "@/components/sections/StorySection";
import ServicesSection from "@/components/sections/ServicesSection";
import ManifestoSection from "@/components/sections/ManifestoSection";
import LookbookSection from "@/components/sections/LookbookSection";
import ProcessSection from "@/components/sections/ProcessSection";
import CtaSection from "@/components/sections/CtaSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [(assetManifest as { images?: Record<string, string> }).images?.["og-image"]].filter(Boolean) as string[],
  },
};

export default async function Home() {
  const cms = await getSiteContent();
  const heroHeadline = cms?.hero?.headline;
  const heroSubline = cms?.hero?.subheadline || siteConfig.hero.subhead;
  const heroEyebrow = siteConfig.hero.eyebrow;

  return (
    <>
      <HeroSection
        headlineOverride={heroHeadline}
        sublineOverride={heroSubline}
        eyebrowOverride={heroEyebrow}
      />
      <StorySection />
      <FeaturedProducts />
      <ServicesSection />
      <ManifestoSection />
      <LookbookSection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
