import { cn, pad } from "@/lib/utils";

/** Section eyebrow, e.g. "00 — INTRO". */
export function Eyebrow({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <span className="label text-dim">
      {pad(index)} — {children}
    </span>
  );
}

/** Section counter, e.g. "01 / 06". */
export function Counter({ current, total }: { current: number; total: number }) {
  return (
    <span className="label tabular-nums text-dim">
      {pad(current)} / {pad(total)}
    </span>
  );
}

/** Small uppercase caption used in section footers. */
export function MicroLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-micro tracking-label uppercase text-faint", className)}>
      {children}
    </span>
  );
}

/** The 2–3 letter sigil pinned to the bottom-right of every section. */
export function Sigil({ children }: { children: React.ReactNode }) {
  return <span className="label text-faint">{children}</span>;
}
