import { cn, pad } from "@/lib/utils";
import { CheckList } from "./check-item";
import { HairlineGrid } from "./hairline-grid";
import { type Status, StatusBadge } from "./status-badge";

type Props = {
  /** One-based card index, rendered as "001". */
  index: number;
  status: Status;
  title: string;
  /** Date range shown bottom-right, e.g. "AUG 17–23". */
  period: string;
  children?: React.ReactNode;
};

/** A numbered milestone card: "001  [DONE]  IDEA VALIDATED". */
export function TimelineCard({ index, status, title, period, children }: Props) {
  const active = status === "current";

  return (
    <article className="flex flex-col gap-4 bg-bg p-gutter">
      <header className="flex items-baseline justify-between gap-4">
        <span
          className={cn(
            "font-display text-index sm:text-index-lg font-bold tabular-nums",
            active ? "text-accent" : "text-ink-deep",
          )}
        >
          {pad(index, 3)}
        </span>
        <StatusBadge status={status} />
      </header>

      <h3 className="text-ui font-bold text-ink">{title}</h3>

      {children ? <CheckList>{children}</CheckList> : null}

      <p className="mt-auto pt-2 text-micro tracking-label text-prose">{period}</p>
    </article>
  );
}

/** Kept as a named alias so EXPERIENCE reads in its own vocabulary. */
export function TimelineGrid({ children }: { children: React.ReactNode }) {
  return <HairlineGrid>{children}</HairlineGrid>;
}
