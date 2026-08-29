/**
 * Hero backdrop. Placeholder art — swapped later, so it is referenced through
 * these constants rather than inline at each use site.
 *
 * AVIF is the source next/image reads; it re-encodes per request and per
 * breakpoint, and negotiates the delivered format from the Accept header, so
 * one source covers every browser. The .webp siblings are kept as a decode
 * fallback for tooling that cannot read AVIF — stage 8's OG image generation
 * is the near-term consumer.
 *
 * The 1.7MB / 558KB PNG originals were dropped: this is the LCP element, and
 * they were ~9x the 200KB budget.
 */
export const heroImage = {
  desktop: { src: "/images/hero-bg.avif", width: 1600, height: 1000 },
  mobile: { src: "/images/hero-bg-mobile.avif", width: 828, height: 1100 },
  alt: "",
} as const;
