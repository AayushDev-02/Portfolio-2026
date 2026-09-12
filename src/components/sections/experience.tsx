import {
  SectionHead,
  SectionShell,
  TimelineRail,
  TimelineSpine,
} from "@/components/primitives";
import type { SiteContent } from "@/content";

/**
 * EXPERIENCE, rebuilt in stage 17 as a dated rail.
 *
 * Five stacked checklist cards were accurate and useless: the dates were
 * strings in a corner, so nothing showed that the language study ran *in
 * parallel* with the Human Resocia internship, or how little gap there was
 * between roles. Placing the bars by date shows both without a sentence.
 *
 * Two renderings from one source, chosen by CSS rather than by JavaScript, so
 * exactly one is ever in the accessibility tree. `TimelineRail` is a client
 * component because it is a real tablist; `TimelineSpine` is a Server Component
 * and costs nothing.
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

        <TimelineRail entries={experience.entries} />
        <TimelineSpine entries={experience.entries} />
      </div>
    </SectionShell>
  );
}
