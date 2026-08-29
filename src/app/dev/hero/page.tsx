import type { Metadata } from "next";
import { IntroSection } from "@/components/sections";
import { type HeroCandidateKey, heroCandidates, heroImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Hero candidates",
  robots: { index: false, follow: false },
};

/**
 * Side-by-side of the hero backdrop candidates, each in the real composition —
 * wordmark, terminal panel, gradient fade, corner marks, eyebrow and counter.
 *
 * The point is to judge the type over the image. A hero read as a bare image
 * file tells you nothing about whether the wordmark survives on top of it.
 *
 * Temporary, noindexed, and deleted once a candidate is chosen.
 */
export default function HeroCandidates() {
  const keys = Object.keys(heroCandidates) as HeroCandidateKey[];

  return (
    <>
      {keys.map((key) => {
        const candidate = heroCandidates[key];
        const isLive = candidate.desktop.src === heroImage.desktop.src;

        return (
          <div key={key} className="relative">
            <p className="absolute top-2 left-1/2 z-10 -translate-x-1/2 bg-bg/90 px-3 py-1 text-micro tracking-label uppercase text-prose">
              {key}
              {isLive ? " — live" : null}
            </p>
            <IntroSection image={candidate} id={`hero-${key}`} />
          </div>
        );
      })}
    </>
  );
}
