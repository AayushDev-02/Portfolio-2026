import {
  MicroLabel,
  SectionHead,
  SectionShell,
  StackDiagram,
} from "@/components/primitives";
import type { SiteContent } from "@/content";

/**
 * SKILLS, as a drawing of the stack rather than nine bulleted lists.
 *
 * Two things the lists could not do. They were the tallest thing on the page —
 * about 1676px, against neighbours of 900 to 1400 — and they said nothing about
 * how the pieces relate: nine flat categories assume the reader already knows
 * which sit on top of which. Five bands in build order say it without a
 * sentence, and the AI band is drawn on the terminal ground because it is what
 * the rest of the page argues for.
 *
 * The reference's rank bars are still gone — see docs/DECISIONS.md. Percentages
 * beside a skill are self-ratings, and read as padding to the engineers this
 * page is for. The diagram states the claim; PROJECTS carries the evidence.
 *
 * Certifications sit beneath the drawing rather than inside it. They are not a
 * layer of anything — nothing is built on top of a certificate — and putting
 * them in a band would have been the one place the diagram lied.
 */
export function SkillsSection({ content }: { content: SiteContent }) {
  const { skills } = content;

  return (
    <SectionShell
      index={3}
      eyebrow={skills.eyebrow}
      position={4}
      id="skills"
      caption={skills.caption}
      sigil={skills.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={skills.heading} lede={skills.lead} />

        <div className="w-full max-w-3xl">
          <StackDiagram layers={skills.layers} labels={skills.diagram} />
        </div>

        <div className="w-full max-w-3xl border-t border-rule pt-5">
          <MicroLabel>{skills.certificationsLabel}</MicroLabel>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {skills.certifications.map((item) => (
              <li key={item} className="text-label text-prose">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
