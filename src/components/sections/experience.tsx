import { SectionHead, SectionShell, TimelineLedger } from "@/components/primitives";
import type { SiteContent } from "@/content";

/**
 * EXPERIENCE, rebuilt again in stage 18.
 *
 * Stage 17 replaced five stacked checklist cards with a dated horizontal rail,
 * for a reason that still holds: the dates were strings in a corner, so nothing
 * showed that the language study ran *in parallel* with the Human Resocia
 * internship. Placing roles by date shows it without a sentence.
 *
 * The rail kept that and lost on the execution — a title at the left edge and
 * its bar floating at 62% of the row, no gridlines for four of the five bars to
 * sit against, and four roles out of five behind a tab. `TimelineLedger` keeps
 * the date geometry and fixes all three; the argument is in that file.
 *
 * Three components collapse into one here: `TimelineRail` (client),
 * `TimelineSpine` (the phone rendering) and `TimelinePanel` (the tab body).
 * There is now a single rendering at every width and no client JavaScript in
 * this section at all.
 */
export function ExperienceSection({ content }: { content: SiteContent }) {
  const { experience } = content;

  return (
    <SectionShell
      index={2}
      eyebrow={experience.eyebrow}
      position={3}
      id="experience"
      caption={experience.caption}
      sigil={experience.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={experience.heading} lede={experience.lead} />
        <TimelineLedger entries={experience.entries} />
      </div>
    </SectionShell>
  );
}
