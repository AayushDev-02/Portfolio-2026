import { cn } from "@/lib/utils";

/**
 * The shared hairline grid.
 *
 * Cards are not individually bordered — this grid's own background shows
 * through its 1px gaps, so neighbours share one hairline instead of doubling
 * it. Every child must paint `bg-bg` or the gaps swallow the card.
 */
export function HairlineGrid({
  columns = 3,
  className,
  children,
}: {
  columns?: 2 | 3;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-px border-x border-rule bg-rule",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
