import { cn, pad } from "@/lib/utils";

/** A plain ranked line: "01. label" — no fill bar, unlike RankBar. */
export function NumberedItem({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3 text-label sm:text-ui">
      <span className="shrink-0 tabular-nums text-accent">{pad(index)}.</span>
      <span className="text-ink">{children}</span>
    </li>
  );
}

/** Wrapper that lays out a group of NumberedItems. */
export function NumberedList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <ol className={cn("flex w-full flex-col gap-2", className)}>{children}</ol>;
}
