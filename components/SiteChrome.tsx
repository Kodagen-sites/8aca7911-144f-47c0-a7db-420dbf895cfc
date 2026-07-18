"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/headers/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/motion/FilmGrain";
import Vignette from "@/components/motion/Vignette";
import { CartProvider } from "@/components/cart/CartContext";
import { CartFlow } from "@/components/cart/CartFlow";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <CartProvider brandSlug="lane-proof-atelier" currency="NGN">
      <Header />
      <main>{children}</main>
      <Footer />
      <CartFlow />
      <FilmGrain opacity={0.045} />
      <Vignette color="#3B2418" strength={0.35} />
    </CartProvider>
  );
}
