import { cn } from "@/lib/utils";

/** A checklist line: "[x] label" or "[ ] label". */
export function CheckItem({
  checked = true,
  children,
}: {
  checked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3 text-label sm:text-ui leading-relaxed">
      <span
        aria-hidden="true"
        className={cn("shrink-0 select-none", checked ? "text-accent" : "text-rule")}
      >
        [{checked ? "x" : " "}]
      </span>
      <span className={checked ? "text-ink" : "text-prose"}>{children}</span>
      <span className="sr-only">{checked ? " (done)" : " (not done)"}</span>
    </li>
  );
}

/**
 * Lays out a group of CheckItems. Two columns inside an accordion panel at sm;
 * one everywhere else, since the timeline cards are far too narrow to split.
 */
export function CheckList({
  columns = 1,
  children,
}: {
  columns?: 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-x-8 gap-y-4",
        columns === 2 && "sm:grid-cols-2",
      )}
    >
      {children}
    </ul>
  );
}
