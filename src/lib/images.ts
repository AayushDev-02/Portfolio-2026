/**
 * Hero backdrop candidates.
 *
 * Placeholder art — swapped later, so it is referenced through these constants
 * rather than inline at each use site. Compare them in the real composition at
 * /dev/hero; judging a hero as a bare image file tells you very little about
 * how the wordmark sits on it.
 */

export type HeroImage = {
  desktop: { src: string; width: number; height: number };
  mobile: { src: string; width: number; height: number };
  alt: string;
};

export const heroCandidates = {
  /**
   * Abstract placeholder shipped with stage 2R — the one currently live.
   * Points at hero-bg.png, not the hero-bg-abstract.png copy, so the live
   * page requests exactly the file it did before. 1600x1000 + 828x1100 crop.
   */
  abstract: {
    desktop: { src: "/images/hero-bg.png", width: 1600, height: 1000 },
    mobile: { src: "/images/hero-bg-mobile.png", width: 828, height: 1100 },
    alt: "",
  },
  /** Portrait candidate. Same 1600x1000 + 828x1100 pair as the abstract one. */
  face: {
    desktop: { src: "/images/hero-face.png", width: 1600, height: 1000 },
    mobile: { src: "/images/hero-face-mobile.png", width: 828, height: 1100 },
    alt: "",
  },
} as const satisfies Record<string, HeroImage>;

export type HeroCandidateKey = keyof typeof heroCandidates;

/**
 * The one the live site uses. Swapping the hero is a one-word change here —
 * nothing else in the app references a candidate by name.
 */
export const heroImage: HeroImage = heroCandidates.abstract;
