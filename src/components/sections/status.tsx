import {
  CheckItem,
  SectionShell,
  TimelineCard,
  TimelineGrid,
} from "@/components/primitives";
import { status } from "@/content/reference";

export function StatusSection() {
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
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-display leading-none tracking-display text-balance">
            {status.heading}
          </h2>
          <p className="max-w-prose text-body text-dim">{status.lead}</p>
        </div>

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
