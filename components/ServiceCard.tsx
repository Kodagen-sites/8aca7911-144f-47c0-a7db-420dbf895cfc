import Link from "next/link";

/**
 * CV2 — Oversized Number Minimal
 *
 * No image. Large numbered prefix + serif heading + refined sans body.
 * Reads as "a list with presence". Premium, editorial.
 *
 * Use when:
 *   - Editorial / luxury / premium personalities
 *   - Styles: S2, S6, S11
 *   - Industries: architecture, real estate, law, private banking, art galleries, luxury hospitality
 *
 * Recommended grid: `grid grid-cols-1 md:grid-cols-2 gap-0` (border-t unifies)
 */

type Service = {
  slug: string;
  name: string;
  description: string;
};

type Props = {
  service: Service;
  index: number;
  imageSrc?: string;          // ignored by CV2
};

export default function ServiceCardV2({ service, index }: Props) {
  const num = String((index ?? 0) + 1).padStart(2, "0");

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block p-8 rounded-none border-t border-white/15 hover:border-primary transition-all h-full"
    >
      <div className="font-display text-6xl md:text-7xl font-light text-white/20 group-hover:text-primary/60 transition-colors duration-500 mb-6 leading-none">
        {num}
      </div>
      <h3 className="font-display text-2xl md:text-3xl text-white font-light leading-tight mb-4 group-hover:translate-x-1 transition-transform duration-300">
        {service.name}
      </h3>
      <p className="text-white/60 text-sm md:text-base leading-relaxed mb-6 max-w-sm">
        {service.description}
      </p>
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 group-hover:text-primary transition-colors">
        Read →
      </div>
    </Link>
  );
}
