import {
  HairlineGrid,
  SectionHead,
  SectionShell,
  SkillCard,
} from "@/components/primitives";
import type { SiteContent } from "@/content";

/**
 * The reference's rank bars are gone here — see docs/DECISIONS.md. Percentages
 * beside a skill are self-ratings, and read as padding to the engineers this
 * page is for. Categories state the claim; PROJECTS carries the evidence.
 */
export function SkillsSection({ content }: { content: SiteContent }) {
  const { skills } = content;

  return (
    <SectionShell
      index={3}
      eyebrow={skills.eyebrow}
      position={4}
      total={6}
      id="skills"
      caption={skills.caption}
      sigil={skills.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={skills.heading} lede={skills.lead} />

        <HairlineGrid>
          {skills.groups.map((group) => (
            <SkillCard key={group.name} name={group.name} items={group.items} />
          ))}
        </HairlineGrid>
      </div>
    </SectionShell>
  );
}
