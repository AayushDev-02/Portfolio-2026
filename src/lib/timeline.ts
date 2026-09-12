import type { TimelineEntry } from "@/content";

/**
 * Where each role sits on the EXPERIENCE rail.
 *
 * Positions are computed from `start` and `end`, never hand-placed, so adding a
 * role next year moves everything else correctly on its own and the two locales
 * are pixel-identical.
 *
 * Shared by `TimelineRail` (client, `sm` and up) and `TimelineSpine` (server,
 * below `sm`) so the two renderings cannot disagree about which role is current
 * or how long anything ran.
 */

/** Months a still-running role is drawn for past its start. */
const ONGOING_MONTHS = 12;

/** "2025-06" -> a comparable integer. */
function monthIndex(iso: string): number {
  const [year = "0", month = "1"] = iso.split("-");
  return Number(year) * 12 + (Number(month) - 1);
}

export type Placed = {
  entry: TimelineEntry;
  /** Percentages along the rail, ready for `left` / `width`. */
  left: number;
  width: number;
  current: boolean;
};

export type RailLayout = {
  placed: Placed[];
  /** One tick per January inside the domain, as a percentage and a year. */
  ticks: { at: number; year: number }[];
  /** Index of the current role, or the last one if none is marked current. */
  currentIndex: number;
};

export function layOutRail(entries: TimelineEntry[]): RailLayout {
  const starts = entries.map((entry) => monthIndex(entry.start));
  const ends = entries.map((entry) => monthIndex(entry.end ?? entry.start));

  const domainStart = Math.min(...starts);

  // An open-ended role has no end to measure, and using the render date would
  // either bake the build date into a static page or disagree between the
  // server and the client after hydration. A fixed run past its start is
  // deterministic, and the fact that the role is still running is carried by
  // the arrow at the end of its bar and by `period`, which already says so in
  // both languages.
  const openStarts = entries
    .map((entry, i) => (entry.end === null ? (starts[i] as number) : -1))
    .filter((value) => value >= 0);
  const domainEnd = Math.max(
    ...ends,
    ...openStarts.map((value) => value + ONGOING_MONTHS),
  );
  const span = Math.max(domainEnd - domainStart, 1);

  const pct = (month: number) => ((month - domainStart) / span) * 100;

  const placed = entries.map((entry, i) => {
    const from = starts[i] as number;
    const to = entry.end === null ? domainEnd : (ends[i] as number);
    return {
      entry,
      left: pct(from),
      // A role that started and ended in the same month would otherwise be
      // invisible.
      width: Math.max(pct(to) - pct(from), 1.5),
      current: entry.end === null,
    };
  });

  const ticks: { at: number; year: number }[] = [];
  const firstYear = Math.ceil(domainStart / 12);
  for (let year = firstYear; year * 12 <= domainEnd; year++) {
    ticks.push({ at: pct(year * 12), year });
  }

  const currentIndex = Math.max(
    placed.findIndex((item) => item.current),
    0,
  );

  return { placed, ticks, currentIndex };
}
