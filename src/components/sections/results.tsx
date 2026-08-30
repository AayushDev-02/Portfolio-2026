import { MicroLabel, Reveal } from "@/components/primitives";
import type { SiteContent } from "@/content";

/**
 * The numbers band. Stage 13 §C.
 *
 * All four figures already existed, buried in PROJECTS body text where a
 * recruiter skimming for fifteen seconds would never reach them. Pulled out
 * into the pixel display face, which is the most legitimate use of the
 * reference's strongest weapon on content that is actually his.
 *
 * **This section does not use `SectionShell`, and that is the whole point of
 * §A.** Every other section is `min-h-dvh` with its content centred; six
 * identical frames is the monotony the brief diagnoses. This one is roughly
 * half that height, so after a full-height section it lands as a jolt rather
 * than as more of the same. It keeps the eyebrow, the caption and the sigil so
 * it still belongs to the page — it is a different tempo, not a different site.
 *
 * It is also unnumbered: no counter, and it does not advance the "01 / 06"
 * sequence, because it is a band between sections rather than a seventh one.
 */
export function ResultsSection({ content }: { content: SiteContent }) {
  const { results } = content;

  return (
    <section
      id="results"
      aria-labelledby="results-eyebrow"
      className="relative flex w-full flex-col border-b border-rule px-gutter py-10 sm:px-gutter-lg sm:py-14"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <span id="results-eyebrow" className="label text-accent">
          — {results.eyebrow}
        </span>
        <MicroLabel>{results.note}</MicroLabel>
      </header>

      {/* gap-px over a rule background: neighbours share one hairline instead
          of doubling it, the same device the timeline grid uses. */}
      <Reveal stagger className="mt-8">
        <dl className="grid w-full grid-cols-1 gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {results.figures.map((figure) => (
            <div
              key={figure.unit}
              className="flex flex-col gap-3 bg-bg px-0 py-8 sm:px-6 lg:first:pl-0 lg:last:pr-0"
            >
              <dt className="sr-only">{figure.unit}</dt>
              <dd className="flex flex-col gap-3">
                <span className="font-display text-index sm:text-index-lg font-bold leading-none text-accent">
                  {figure.value}
                </span>
                <span className="label font-bold uppercase text-ink-deep">
                  {figure.unit}
                </span>
                <span className="font-sans text-ui leading-6 text-prose">
                  {figure.caption}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <footer className="mt-8 flex items-baseline justify-between">
        <MicroLabel>{results.caption}</MicroLabel>
        <span className="label text-prose">{results.sigil}</span>
      </footer>
    </section>
  );
}
