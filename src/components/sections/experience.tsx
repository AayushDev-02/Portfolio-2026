import {
  CheckItem,
  SectionHead,
  SectionShell,
  TimelineCard,
  TimelineGrid,
} from "@/components/primitives";
import type { SiteContent } from "@/content";

export function ExperienceSection({ content }: { content: SiteContent }) {
  const { experience } = content;

  return (
    <SectionShell
      index={2}
      eyebrow={experience.eyebrow}
      position={3}
      total={6}
      id="experience"
      caption={experience.caption}
      sigil={experience.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={experience.heading} lede={experience.lead} />

        <TimelineGrid>
          {experience.entries.map((entry, i) => (
            <TimelineCard
              key={entry.title}
              index={i + 1}
              status={entry.status}
              title={entry.title}
              period={entry.period}
            >
              {entry.items?.map((item) => (
                <CheckItem key={item.label} checked={item.checked}>
                  {item.label}
                </CheckItem>
              ))}
            </TimelineCard>
          ))}
        </TimelineGrid>
      </div>
    </SectionShell>
  );
}
