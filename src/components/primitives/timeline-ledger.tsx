import type { TimelineEntry } from "@/content";
import { layOutRail } from "@/lib/timeline";
import { pad } from "@/lib/utils";
import { CheckItem, CheckList } from "./check-item";
import { StatusBadge } from "./status-badge";

/**
 * EXPERIENCE: one compact chart of when, then a clean list of what.
 *
 * ## The split is the whole design
 *
 * Every previous version tried to make one element do both jobs, and every one
 * of them was cluttered for the same reason.
 *
 * Stage 17's rail put a title at the left edge of a row and its bar at 62% of
 * the same row, with nothing between them, and hid four roles behind tabs. The
 * first stage-18 attempt fixed the hiding and the missing scale by giving every
 * row its own lane and running the year gridlines down the full height of the
 * list — which meant four vertical rules crossing every line of every
 * checklist. A gridline is only useful where something is measured against it;
 * everywhere else it is a line through text.
 *
 * So the two jobs are separated. **The chart** is five bars on one axis, about
 * 140px tall, and it is the only place gridlines appear — that is the one place
 * they mean anything. It answers "when, how long, and what overlapped" at a
 * glance. **The list** below has no gridlines, no bars and no axis, and answers
 * "what was the work". Neither is doing the other's job, so neither is dense.
 *
 * The chart carries the same ordinals as the list, so 003 in one is 003 in the
 * other and no legend is needed.
 *
 * ## The chart is `aria-hidden`, deliberately
 *
 * It contains no information the list does not state in words — every role's
 * period is printed under its title. Exposing it would make a screen reader
 * read five durations twice, the second time as unlabelled geometry. Marking a
 * *redundant* visual summary hidden is the correct call; the drawings in
 * PROJECTS and SKILLS are not hidden because they carry argument the prose does
 * not, which is why they have `<title>` and `<desc>` instead.
 *
 * ## One rendering, at every width
 *
 * Stage 17 needed a rail above `sm` and a vertical spine below it, because a
 * 32-month axis carrying year labels is unreadable in a 312px column. Here the
 * labels are drawn once, on the chart's own axis, and the bars carry no text at
 * all — so the same markup works at 360px and at 1920px. `TimelineRail`,
 * `TimelineSpine` and `TimelinePanel` all collapse into this file.
 *
 * A **Server Component**: no tabs, no state, no client JavaScript.
 *
 * ## Most recent first
 *
 * A first pass looks for the current role, so it is 001 and it is at the top of
 * both the chart and the list. Positions on the axis are untouched — they come
 * from `start` and `end` through `lib/timeline.ts` and are never hand-placed,
 * so the bars still run left to right in real time order.
 */

/** Shared by the chart and the list, so their ordinals line up in one column. */
const COLUMNS =
  "grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5";

export function TimelineLedger({ entries }: { entries: TimelineEntry[] }) {
  const { placed, ticks } = layOutRail(entries);
  // Display order only. `layOutRail` is untouched, so the chart and the list
  // share one set of positions and cannot disagree.
  const rows = [...placed].reverse();

  return (
    <div className="flex w-full flex-col gap-12 sm:gap-14">
      {/* ── THE CHART ──────────────────────────────────────────────
          Five bars, one axis, and the only gridlines in the section. */}
      <div aria-hidden="true" className="w-full">
        <div className={COLUMNS}>
          <span />
          <div className="relative h-4">
            {ticks.map((tick) => (
              <span
                key={tick.year}
                className="absolute top-0 -translate-x-1/2 text-badge tabular-nums text-prose"
                style={{ left: `${tick.at}%` }}
              >
                {tick.year}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-1">
          {/* The gridlines, as one absolutely positioned copy of the column
              template stretched over the bars. Sharing `COLUMNS` is what
              guarantees a line and a bar at the same percentage land on the
              same pixel. */}
          <div className={`${COLUMNS} pointer-events-none absolute inset-0`}>
            <span />
            <div className="relative">
              {ticks.map((tick) => (
                <span
                  key={tick.year}
                  className="absolute inset-y-0 w-px bg-rule"
                  style={{ left: `${tick.at}%` }}
                />
              ))}
            </div>
          </div>

          <div className="relative border-y border-rule py-1">
            {rows.map((item, i) => (
              <div key={item.entry.title} className={`${COLUMNS} h-6 items-center`}>
                <span
                  className={`text-badge tabular-nums ${
                    item.current ? "text-accent" : "text-prose"
                  }`}
                >
                  {pad(i + 1, 3)}
                </span>
                <div className="relative h-full">
                  <span
                    data-timeline-current={item.current ? "" : undefined}
                    className={`absolute top-1/2 h-[6px] -translate-y-1/2 ${
                      item.current ? "bg-accent" : "bg-prose"
                    }`}
                    style={{
                      left: `${item.left}%`,
                      // An open-ended bar leaves room for its own arrowhead
                      // rather than running into the edge of the chart.
                      width: item.current
                        ? `calc(${item.width}% - 0.7rem)`
                        : `${item.width}%`,
                    }}
                  />
                  {item.current ? (
                    <span className="absolute top-1/2 right-0 -translate-y-1/2 text-badge leading-none text-accent">
                      →
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── THE LIST ───────────────────────────────────────────────
          No axis, no bars, no gridlines. Just the work. */}
      <ol className="w-full border-t border-rule">
        {rows.map((item, i) => {
          const { entry, current } = item;
          return (
            <li key={entry.title} className="border-b border-rule">
              <div className={`${COLUMNS} py-7 sm:py-8`}>
                <span
                  className={`pt-1 text-badge tabular-nums sm:text-micro ${
                    current ? "text-accent" : "text-prose"
                  }`}
                >
                  {pad(i + 1, 3)}
                </span>

                <div className="flex min-w-0 flex-col gap-5">
                  {/* The title owns its line; the period and the badge share
                      the one below it. Putting the badge on the title's line
                      with `ml-auto` looked right at 1440 and wrapped to a lone
                      right-aligned tag under a two-line title at 390. */}
                  <div className="flex flex-col gap-2">
                    <h3
                      className={`text-ui font-bold sm:text-lede ${
                        current ? "text-accent" : "text-ink"
                      }`}
                    >
                      {entry.title}
                    </h3>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-badge tracking-label text-prose sm:text-micro">
                        {entry.period}
                      </span>
                      <StatusBadge status={entry.status} />
                    </div>
                  </div>

                  {entry.items ? (
                    <CheckList columns={2}>
                      {entry.items.map((check) => (
                        <CheckItem key={check.label} checked={check.checked}>
                          {check.label}
                        </CheckItem>
                      ))}
                    </CheckList>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
