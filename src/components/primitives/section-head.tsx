/**
 * The centred heading + lede that opens every section below the hero.
 *
 * The lede is sans, not mono: at mono's width the reference's 576px measure
 * would run past 1300px, which was the largest readability gap in the v2 build.
 */
export function SectionHead({ heading, lede }: { heading: string; lede: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="font-display text-head sm:text-head-lg font-bold uppercase leading-none tracking-tight text-ink text-balance text-center">
        {heading}
      </h2>
      <p className="max-w-xl font-sans text-lede sm:text-lede-lg leading-6 text-prose text-balance text-center">
        {lede}
      </p>
    </div>
  );
}
