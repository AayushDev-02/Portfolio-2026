import {
  CheckItem,
  SectionHead,
  SectionShell,
  TimelineCard,
  TimelineGrid,
} from "@/components/primitives";
import type { SiteContent } from "@/content";

export function StatusSection({ content }: { content: SiteContent }) {
  const { status } = content;
  return (
    <SectionShell
      index={2}
      eyebrow={status.eyebrow}
      position={3}
      total={6}
      id="status"
      caption={status.caption}
      sigil={status.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={status.heading} lede={status.lead} />

        <TimelineGrid>
          {status.entries.map((entry, i) => (
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
