/**
 * Lane Proof Atelier — Site Configuration
 *
 * Variation Manifest:
 *   archetype: G (loop) | style: S6 fashion-editorial | color_variant: burnt-sienna
 *   header_variant: pill-floating | footer_variant: FT3 | card_variant: CV2
 *   hero_overlay_variant: HO5 (big-stack) | hero_text_pattern: H5 | hero_entrance: E3
 *   story_variant: SY4 (atelier-editorial) | services_variant: SV1 (alternating full-bleed)
 *   manifesto_variant: MV8 (luxury-retail) | cta_variant: CTA1
 *   voice_family: V1 (heritage-understated)
 *   industry: ecommerce (fashion / womenswear) | engine: catalog | payments: paystack
 */

export const siteConfig = {
  company: {
    name: "Lane Proof Atelier",
    tagline: "Small-batch womenswear, cut with intent.",
    description:
      "A Lagos studio designing contemporary African womenswear in limited seasonal runs. Dresses, sets, and accessories cut with restraint and finished by hand.",
    email: "hello@laneproofatelier.com",
    phone: "+234 (0) 812 000 0000",
    location: "Ikoyi, Lagos · Nigeria",
    address: {
      street: "12 Ilabere Avenue",
      city: "Ikoyi",
      state: "Lagos",
      postal: "101233",
      country: "NG",
    },
  },
  brand: {
    name: "Lane Proof Atelier",
    initial: "L",
    primary: "#B3542D",
    accent: "#B3542D",
    ink: "#3B2418",
    bg: "#F5EDE3",
    surface: "#E5C9A8",
    logo: {
      primary: "",
      dark: "",
    },
  },
  typography: {
    display: "Fraunces",
    body: "Inter",
  },
  headerVariant: "pill-floating",
  footerVariant: "FT3",
  cartVariant: "C1",
  engine: "catalog" as const,
  templateId: "catalog-v1",
  adminModule: "catalog" as const,
  industry: "ecommerce",
  currency: "NGN",
  currencySymbol: "₦",

  seo: {
    siteUrl: "https://laneproofatelier.com",
    defaultTitle: "Lane Proof Atelier — Small-batch Lagos Womenswear",
    defaultDescription:
      "Contemporary African womenswear designed and made in Lagos. Small-batch dresses, sets, and accessories in limited seasonal drops.",
    locale: "en_NG",
    twitterHandle: "@laneproofatelier",
  },

  socials: {
    instagram: "https://instagram.com/laneproofatelier",
    tiktok: "https://tiktok.com/@laneproofatelier",
    whatsapp: "https://wa.me/2348120000000",
  },

  nav: [
    { label: "Shop", href: "/services" },
    { label: "Lookbook", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],

  hero: {
    eyebrow: "Atelier · Lagos",
    h1Lines: [
      "Cloth,",
      "cut with",
      "restraint.",
    ],
    subhead:
      "Small-batch womenswear from a Lagos studio. Dresses, sets, and accessories in limited seasonal runs.",
    ctaPrimary: { label: "Shop the atelier", href: "/services" },
    ctaSecondary: { label: "See the lookbook", href: "/work" },
  },

  eyebrow: "Contemporary African womenswear",
  tagline: "Small-batch womenswear, cut with intent.",

  story: {
    eyebrow: "The atelier",
    heading: "A small studio in Ikoyi.",
    body:
      "Lane Proof began as a private workroom in Ikoyi — a place to answer a single question with each collection: what would make this piece worth keeping? The answer arrives in the cut, the weight of the cloth, and the hand of the finish. We produce in small batches so that every seam holds its intent.",
    ctaLabel: "Meet the atelier",
    ctaHref: "/about",
  },

  servicesHeading: "The collection",
  servicesEyebrow: "Small-batch, all year",
  services: [
    {
      name: "Dresses",
      slug: "dresses",
      description:
        "Long-line silhouettes cut in hand-loomed linen, aso oke blends, and lightweight cotton. Made to move, made to stay.",
      long:
        "Every dress is patterned in-house and cut individually. We favor natural fibers with weight — linen, aso oke, and organic cottons — so drape and hand feel considered rather than styled. Runs are limited: most silhouettes retire once the fabric run is finished.",
      capabilities: [
        "Hand-loomed West African linens",
        "Made in Lagos, patterned in-house",
        "Small-batch: typical run of 12-24 pieces",
      ],
    },
    {
      name: "Two-piece sets",
      slug: "two-piece-sets",
      description:
        "Tops and bottoms designed to travel together and separately. Structured tailoring in soft, breathable cloth.",
      long:
        "Cut as a set, worn as separates. Our two-piece sets pair a structured top or wrap with an ease-drape trouser or midi skirt. Every piece works with the rest of the wardrobe — nothing is orphaned.",
      capabilities: [
        "Interchangeable tops and bottoms",
        "Structured tailoring, soft finish",
        "Waist detail and hidden pockets",
      ],
    },
    {
      name: "Headwraps & accessories",
      slug: "headwraps-accessories",
      description:
        "Silk-blend gele, cotton wraps, and hand-worked accessories to finish a look with weight and intention.",
      long:
        "A quiet corner of the atelier. Every headwrap is finished by hand — folded, pressed, and packed in a numbered slip. Accessories are limited by nature: what our hands make in a week is what we ship that week.",
      capabilities: [
        "Silk-blend and pure cotton",
        "Numbered, hand-finished",
        "Ready to tie or pre-formed",
      ],
    },
    {
      name: "Limited seasonal drops",
      slug: "limited-drops",
      description:
        "Small numbered collections released a few times a year. Made in tiny runs, then retired.",
      long:
        "A few times a year we release a small numbered collection — usually 8 to 16 pieces total. Each drop leaves the studio as one; once the run finishes, the pattern is retired.",
      capabilities: [
        "Numbered releases",
        "Retired after each drop",
        "Waitlist for future drops",
      ],
    },
  ],

  products: [
    {
      slug: "ochre-drape-dress",
      name: "Ochre Drape Dress",
      category: "Dresses",
      price: 145000,
      priceDisplay: "₦145,000",
      description:
        "Long-line linen dress in warm ochre. Draped bodice, side pockets, ties at the waist. Cut once in a run of 18.",
      material: "Hand-loomed linen, 100% natural fiber",
      image: "section-showcase-1",
      images: ["section-showcase-1"],
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
    },
    {
      slug: "sand-two-piece",
      name: "Sand Two-Piece",
      category: "Two-piece sets",
      price: 168000,
      priceDisplay: "₦168,000",
      description:
        "Cropped structured top over an ease-drape trouser. Sand-cream cotton, hidden pockets, tie-back detail.",
      material: "Organic cotton blend",
      image: "section-showcase-3",
      images: ["section-showcase-3"],
      sizes: ["S", "M", "L"],
      inStock: true,
    },
    {
      slug: "gele-hand-tie",
      name: "Hand-Tied Gele",
      category: "Headwraps & accessories",
      price: 42000,
      priceDisplay: "₦42,000",
      description:
        "Silk-blend gele, folded and pressed by hand. Comes numbered in a slip. Pre-formed to keep its shape.",
      material: "Silk-cotton blend",
      image: "section-showcase-2",
      images: ["section-showcase-2"],
      sizes: ["One size"],
      inStock: true,
    },
    {
      slug: "burnt-sienna-wrap-dress",
      name: "Burnt Sienna Wrap",
      category: "Dresses",
      price: 158000,
      priceDisplay: "₦158,000",
      description:
        "Full wrap dress in a deep burnt sienna hand-loom. Long tie, adjustable neckline, cut in a run of 14.",
      material: "Aso oke blend",
      image: "section-showcase-4",
      images: ["section-showcase-4"],
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
    },
    {
      slug: "linen-set-clay",
      name: "Clay Linen Set",
      category: "Two-piece sets",
      price: 178000,
      priceDisplay: "₦178,000",
      description:
        "Structured wrap top and midi skirt in a warm clay linen. Sold as a set; both pieces work as separates.",
      material: "Hand-loomed linen",
      image: "section-showcase-1",
      images: ["section-showcase-1"],
      sizes: ["S", "M", "L"],
      inStock: true,
    },
    {
      slug: "cotton-wrap-earth",
      name: "Earth Cotton Wrap",
      category: "Headwraps & accessories",
      price: 32000,
      priceDisplay: "₦32,000",
      description:
        "Everyday cotton wrap in an earthy palette. Soft to the touch, holds its fold. Ready to tie.",
      material: "100% cotton",
      image: "section-showcase-2",
      images: ["section-showcase-2"],
      sizes: ["One size"],
      inStock: true,
    },
  ],

  whyUs: {
    eyebrow: "How we work",
    heading: "Made small, made well.",
    body:
      "We keep the atelier small on purpose. Every piece is patterned, cut, and finished within the same walls. Runs are limited because our hands are — and because that is the only way to keep the finish honest.",
    points: [
      { title: "Cut in Lagos", body: "Patterned, cut, and hand-finished in Ikoyi. Nothing outsourced." },
      { title: "Small runs", body: "Most silhouettes ship in a run of 12-24, then retire." },
      { title: "Natural fibers", body: "Linen, cotton, and aso oke — cloth that softens with wear." },
    ],
  },

  process: [
    { step: "01", title: "Sample", body: "Every piece begins as a single sample cut in-house and tested on the studio floor for a week." },
    { step: "02", title: "Refine", body: "Fit and finish are adjusted by hand — waist, hem, drape. Nothing leaves as a rough approximation." },
    { step: "03", title: "Small run", body: "We cut a run of 12-24. Each piece is numbered inside the label." },
    { step: "04", title: "Retire", body: "When the run is complete, the pattern is put away. No repeats, no restocks." },
  ],

  aboutHeading: "The atelier",
  aboutStory:
    "Lane Proof Atelier began as a workroom for the pieces its founder wanted to wear and could not find. In Ikoyi, a table, a small team, and a preference for cloth that holds its own weight. Every collection answers the same private question — what would make this worth keeping? The answer arrives in the cut, in the hand of the fabric, in the weight of the finish. We stay small so the work stays close to the hand.",

  manifesto: {
    eyebrow: "The atelier's line",
    lines: [
      "Cloth first.",
      "Fit is not a suggestion.",
      "The hand of the finish is the whole point.",
      "If it will not last, it will not leave the studio.",
    ],
  },

  work: [
    { slug: "spring-drop-2026", title: "The Cream Drop", season: "Spring 2026", cover: "section-showcase-1", body: "12 pieces cut in a run once. All retired." },
    { slug: "autumn-drop-2025", title: "Sienna Season", season: "Autumn 2025", cover: "section-showcase-4", body: "16 pieces in aso oke and hand-loomed linen." },
    { slug: "summer-drop-2025", title: "The Ochre Set", season: "Summer 2025", cover: "section-showcase-2", body: "A quiet run of eight two-piece sets, sold in a weekend." },
    { slug: "winter-drop-2024", title: "Cotton In Dust", season: "Winter 2024", cover: "section-showcase-3", body: "Everyday cotton for a Lagos harmattan." },
  ],

  cta: {
    eyebrow: "The list",
    heading: "First look at the next drop.",
    body: "Small-batch releases sell through quickly. Join the list to see the next collection before it goes public.",
    ctaPrimary: { label: "Join the list", href: "/contact" },
    ctaSecondary: { label: "Shop what's left", href: "/services" },
  },

  scrollHero: {
    assetMode: "live-generate",
    imageUrl: "",
    scrollDistance: 3,
  },

  motion: {
    intensity: "low",
    cursorFollower: true,
    scrollProgress: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
export default siteConfig;
