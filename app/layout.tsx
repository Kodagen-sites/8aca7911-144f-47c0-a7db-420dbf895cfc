import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import EditorBridge from "@/components/__kodagen/EditorBridge";
import { CookieConsent } from "@/components/CookieConsent";
import Header from "@/components/headers/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/motion/FilmGrain";
import Vignette from "@/components/motion/Vignette";
import { CartProvider } from "@/components/cart/CartContext";
import { CartFlow } from "@/components/cart/CartFlow";
import { siteConfig } from "@/content/site-config";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.siteUrl),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: `%s · ${siteConfig.company.name}`,
  },
  description: siteConfig.seo.defaultDescription,
  openGraph: {
    type: "website",
    locale: siteConfig.seo.locale,
    url: siteConfig.seo.siteUrl,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    siteName: siteConfig.company.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <CartProvider brandSlug="lane-proof-atelier" currency="NGN">
          <Header />
          <main>{children}</main>
          <Footer />
          <CartFlow />
          <FilmGrain opacity={0.045} />
          <Vignette color="#3B2418" strength={0.35} />
          <CookieConsent />
          <EditorBridge />
        </CartProvider>
      </body>
    </html>
  );
}
