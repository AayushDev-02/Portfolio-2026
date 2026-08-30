import { Reveal } from "./reveal";
import { ScrambleText } from "./scramble-text";

/**
 * The centred heading + lede that opens every section below the hero.
 *
 * Wrapping the reveal here rather than at each call site means one change
 * covers all five sections, and no section component learns that motion
 * exists — the same reason the sections do not know about themes.
 *
 * The lede is sans, not mono: at mono's width the reference's 576px measure
 * would run past 1300px, which was the largest readability gap in the v2 build.
 */
export function SectionHead({ heading, lede }: { heading: string; lede: string }) {
  return (
    <Reveal className="flex flex-col items-center gap-4">
      <h2 className="font-display text-head sm:text-head-lg font-bold uppercase leading-none tracking-tight text-ink text-balance text-center">
        <ScrambleText text={heading} />
      </h2>
      <p className="max-w-xl font-sans text-lede sm:text-lede-lg leading-6 text-prose text-balance text-center">
        {lede}
      </p>
    </Reveal>
  );
}
