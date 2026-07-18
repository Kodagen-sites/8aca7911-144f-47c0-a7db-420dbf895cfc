import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import assetManifest from "@/content/asset-manifest.json";
import HeroSection from "@/components/sections/HeroSection";
import StorySection from "@/components/sections/StorySection";
import ServicesSection from "@/components/sections/ServicesSection";
import ManifestoSection from "@/components/sections/ManifestoSection";
import LookbookSection from "@/components/sections/LookbookSection";
import ProcessSection from "@/components/sections/ProcessSection";
import CtaSection from "@/components/sections/CtaSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [(assetManifest as any).images?.["og-image"]].filter(Boolean),
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
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
