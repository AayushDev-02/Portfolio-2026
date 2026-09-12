import type { TimelineEntry } from "@/content";
import { layOutRail } from "@/lib/timeline";
import { pad } from "@/lib/utils";
import { CheckItem, CheckList } from "./check-item";
import { StatusBadge } from "./status-badge";

/**
 * EXPERIENCE below `sm`: a vertical spine with **every entry expanded**.
 *
 * A 32-month axis squeezed into 312px is not a timeline, so the horizontal rail
 * is not scaled down — it is replaced. What survives the change is the part that
 * matters: the order, the dates, and all five checklists visible at once.
 *
 * Nothing is behind a tap. The rail above `sm` can afford a panel because the
 * whole history is already legible beside it; on a phone there is no room for
 * both, and the choice between hiding the detail and hiding the drawing is not
 * close. A recruiter skimming on a train sees everything.
 *
 * A **Server Component**, deliberately. It renders at every width in the markup
 * and `sm:hidden` removes it above the breakpoint, so it costs zero client
 * JavaScript and exactly one of the two renderings is ever in the accessibility
 * tree. It shares `lib/timeline.ts` with the rail so the two cannot disagree
 * about which role is current.
 */
export function TimelineSpine({ entries }: { entries: TimelineEntry[] }) {
  const { placed } = layOutRail(entries);

  return (
    <ol className="relative w-full sm:hidden">
      {/* The spine itself. Inset to sit under the markers, and stopping at the
          last entry rather than running past it. */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[3px] w-px bg-rule"
      />

      {placed.map((item, i) => (
        <li key={item.entry.title} className="relative flex gap-4 pb-8 last:pb-0">
          <span
            aria-hidden="true"
            className={`relative z-10 mt-1.5 h-[7px] w-[7px] shrink-0 ${
              item.current ? "bg-accent" : "bg-rule"
            }`}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-baseline gap-3">
              <span
                className={`text-badge tabular-nums ${
                  item.current ? "text-accent" : "text-prose"
                }`}
              >
                {pad(i + 1, 3)}
              </span>
              <StatusBadge status={item.entry.status} />
            </div>
            <h3
              className={`text-ui font-bold ${item.current ? "text-accent" : "text-ink"}`}
            >
              {item.entry.title}
            </h3>
            <p className="text-micro tracking-label text-prose">{item.entry.period}</p>
            {item.entry.items ? (
              <CheckList>
                {item.entry.items.map((entry) => (
                  <CheckItem key={entry.label} checked={entry.checked}>
                    {entry.label}
                  </CheckItem>
                ))}
              </CheckList>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
