import { pad } from "@/lib/utils";
import { CheckList } from "./check-item";
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
  return (
    <article className="flex flex-col gap-4 border border-rule p-gutter">
      <header className="flex items-baseline justify-between gap-4">
        <span className="label tabular-nums text-faint">{pad(index, 3)}</span>
        <StatusBadge status={status} />
      </header>

      <h3 className="label text-fg">{title}</h3>

      {children ? <CheckList>{children}</CheckList> : null}

      <p className="label mt-auto pt-2 text-faint">{period}</p>
    </article>
  );
}

/** Responsive grid the timeline cards sit in. */
export function TimelineGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
