import { pad } from "@/lib/utils";

/** A plain ranked line: "01. label" — no fill bar, unlike RankBar. */
export function NumberedItem({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3 text-body">
      <span className="shrink-0 tabular-nums text-faint">{pad(index)}.</span>
      <span className="text-fg">{children}</span>
    </li>
  );
}

/** Wrapper that lays out a group of NumberedItems. */
export function NumberedList({ children }: { children: React.ReactNode }) {
  return <ol className="flex flex-col gap-2">{children}</ol>;
}
