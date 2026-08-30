/**
 * Hero backdrop. Placeholder art — swapped later, so it is referenced through
 * these constants rather than inline at each use site.
 *
 * Both formats are served directly through a <picture> element rather than
 * through next/image. The two crops are genuinely different art — landscape
 * for desktop, portrait for mobile — and next/image cannot art-direct, so the
 * previous markup rendered both and hid one with CSS. `display: none` does not
 * cancel an image fetch, and `priority` preloaded both regardless, so every
 * phone downloaded 264KB to show 80KB of it. <picture> makes the browser pick
 * exactly one before it fetches anything. See docs/DECISIONS.md.
 *
 * The 1.7MB / 558KB PNG originals were dropped: this is the LCP element, and
 * they were ~9x the 200KB budget.
 */
export const heroImage = {
  desktop: {
    avif: "/images/hero-bg.avif",
    webp: "/images/hero-bg.webp",
    width: 1600,
    height: 1000,
  },
  mobile: {
    avif: "/images/hero-bg-mobile.avif",
    webp: "/images/hero-bg-mobile.webp",
    width: 828,
    height: 1100,
  },
  /** Matches the `sm` breakpoint. Kept here so markup and tokens cannot drift. */
  desktopMedia: "(min-width: 640px)",
  alt: "",
} as const;
