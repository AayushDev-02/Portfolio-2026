import type { TimelineEntry } from "@/content";
import { CheckItem, CheckList } from "./check-item";
import { StatusBadge } from "./status-badge";

/**
 * The detail for one role, shown beneath the rail.
 *
 * A **Server Component**, passed into `TimelineRail` as a prop rather than
 * rendered by it. That is the same trick `Reveal` uses and for the same reason:
 * the rail has to be a client component because it is a real tablist, but
 * nothing inside a panel is interactive, so `CheckList`, `CheckItem` and
 * `StatusBadge` have no business being shipped to the browser. Rendering them
 * here keeps them server-side; the rail only ever owns the `tabpanel` wrapper,
 * whose `id`, `aria-labelledby` and `hidden` genuinely depend on state.
 */
export function TimelinePanel({ entry }: { entry: TimelineEntry }) {
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="text-ui font-bold text-ink">{entry.title}</h3>
        <div className="flex items-center gap-4">
          <span className="text-micro tracking-label text-prose">{entry.period}</span>
          <StatusBadge status={entry.status} />
        </div>
      </div>
      {entry.items ? (
        <div className="mt-4">
          <CheckList columns={2}>
            {entry.items.map((item) => (
              <CheckItem key={item.label} checked={item.checked}>
                {item.label}
              </CheckItem>
            ))}
          </CheckList>
        </div>
      ) : null}
    </>
  );
}
