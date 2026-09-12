"use client";

import { useId, useRef, useState } from "react";
import type { TimelineEntry } from "@/content";
import { layOutRail } from "@/lib/timeline";
import { pad } from "@/lib/utils";
import { CheckItem, CheckList } from "./check-item";
import { StatusBadge } from "./status-badge";

/**
 * EXPERIENCE as a dated rail. `sm` and up; below that `TimelineSpine` takes
 * over, because a 32-month axis squeezed into 312px is not a timeline.
 *
 * Five stacked checklist cards were an accurate list and a useless one: the
 * dates were strings in a corner, so nothing showed that the language study ran
 * *in parallel* with the Human Resocia internship, or how little gap there was
 * between roles. Placing the bars by date makes both visible without a
 * sentence, and makes the overlap impossible to draw wrongly — positions come
 * from `start` and `end` via `lib/timeline.ts` and are never hand-placed.
 *
 * The language-study entry is therefore **a span, not a gap**. It is a year of
 * the timeline that was spent on something, drawn the same way every other year
 * is.
 *
 * ## Everything stays readable without clicking
 *
 * Every role's title, period and status are on the rail itself. Only the
 * checklist moves into the panel, and the panel opens on the **current** role.
 * Content behind a disclosure is content a fifteen-second skim never sees —
 * that is why the accordion came out of PROJECTS, and it applies here.
 *
 * ## Keyboard
 *
 * The APG tablist pattern, which is what this is: one Tab stop for the whole
 * rail via roving `tabIndex`, then Left/Right (and Up/Down) to move between
 * roles, Home/End to jump to either end. `aria-selected` and `aria-controls`
 * point at the panel, which is a real `tabpanel` and is itself focusable, so
 * Tab moves rail -> panel -> on, and nothing is reachable only by mouse.
 */
export function TimelineRail({ entries }: { entries: TimelineEntry[] }) {
  const { placed, ticks, currentIndex } = layOutRail(entries);
  const [selected, setSelected] = useState(currentIndex);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = (i: number) => `${base}-panel-${i}`;

  const move = (next: number) => {
    const index = (next + placed.length) % placed.length;
    setSelected(index);
    tabs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowDown: selected + 1,
      ArrowLeft: selected - 1,
      ArrowUp: selected - 1,
      Home: 0,
      End: placed.length - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    move(next);
  };

  return (
    <div className="hidden w-full flex-col gap-8 sm:flex">
      <div className="relative">
        {/* The one rule the whole section is built on, and the year ticks that
            make it a scale rather than a decoration. */}
        <div className="relative mb-3 h-4">
          {ticks.map((tick) => (
            <div
              key={tick.year}
              className="absolute top-0 -translate-x-1/2"
              style={{ left: `${tick.at}%` }}
            >
              <span className="text-badge tabular-nums text-prose">{tick.year}</span>
            </div>
          ))}
        </div>
        <div className="relative h-px w-full bg-rule">
          {ticks.map((tick) => (
            <span
              key={tick.year}
              aria-hidden="true"
              className="absolute top-0 h-1.5 w-px bg-rule"
              style={{ left: `${tick.at}%` }}
            />
          ))}
        </div>

        {/* The roving tabIndex lives on the tabs, which is what the APG
            tablist pattern specifies; the list itself is a container, not a
            stop. */}
        <div
          role="tablist"
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="mt-2 flex flex-col"
        >
          {placed.map((item, i) => (
            /* The whole row is the control, not just the bar.

               Floating the title beside its bar was tried and overflowed the
               page at 768: a label anchored to a date position has whatever
               width is left over, and "Japanese language training → relocation
               to Japan" does not fit in it. A full-width row cannot overflow by
               construction, gives the tab a 56px target on a touch laptop, and
               makes the title itself clickable. The date position is carried by
               the bar underneath, which is where it belongs. */
            <button
              key={item.entry.title}
              type="button"
              role="tab"
              id={tabId(i)}
              ref={(node) => {
                tabs.current[i] = node;
              }}
              aria-selected={selected === i}
              aria-controls={panelId(i)}
              tabIndex={selected === i ? 0 : -1}
              onClick={() => setSelected(i)}
              data-cursor-label={pad(i + 1, 3)}
              className="relative block h-14 w-full text-left"
            >
              <span className="flex items-baseline gap-3">
                <span
                  className={`shrink-0 text-badge tabular-nums ${
                    item.current ? "text-accent" : "text-prose"
                  }`}
                >
                  {pad(i + 1, 3)}
                </span>
                <span
                  className={`min-w-0 truncate text-label font-bold transition-colors duration-150 ${
                    item.current
                      ? "text-accent"
                      : selected === i
                        ? "text-ink"
                        : "text-prose"
                  }`}
                >
                  {item.entry.title}
                </span>
                <span className="ml-auto shrink-0 text-badge tabular-nums text-prose">
                  {item.entry.period}
                </span>
              </span>

              {/* The marker. Placed by date, never by hand. */}
              <span
                aria-hidden="true"
                data-timeline-current={item.current ? "" : undefined}
                className={`absolute bottom-3 flex h-2 items-center border transition-colors duration-150 ${
                  item.current
                    ? "border-accent bg-accent"
                    : selected === i
                      ? "border-ink bg-ink"
                      : "border-rule bg-rule"
                }`}
                style={{
                  left: `${item.left}%`,
                  // An open bar leaves room for its own arrowhead rather than
                  // running into the edge of the row.
                  width: item.current
                    ? `calc(${item.width}% - 0.9rem)`
                    : `${item.width}%`,
                }}
              />
              {/* How an open-ended role says so on the rail. */}
              {item.current ? (
                <span
                  aria-hidden="true"
                  className="absolute right-0 bottom-0.5 text-badge leading-none text-accent"
                >
                  →
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {placed.map((item, i) => (
        <div
          key={item.entry.title}
          role="tabpanel"
          id={panelId(i)}
          aria-labelledby={tabId(i)}
          hidden={selected !== i}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the APG tabs pattern requires a tabpanel to be focusable when it contains no focusable content of its own, which this one does not. Without it a keyboard user tabs straight past the detail they just selected.
          tabIndex={0}
          data-timeline-panel=""
          className="border-t border-rule pt-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="text-ui font-bold text-ink">{item.entry.title}</h3>
            <div className="flex items-center gap-4">
              <span className="text-micro tracking-label text-prose">
                {item.entry.period}
              </span>
              <StatusBadge status={item.entry.status} />
            </div>
          </div>
          {item.entry.items ? (
            <div className="mt-4">
              <CheckList columns={2}>
                {item.entry.items.map((entry) => (
                  <CheckItem key={entry.label} checked={entry.checked}>
                    {entry.label}
                  </CheckItem>
                ))}
              </CheckList>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
