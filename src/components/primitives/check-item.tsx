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
    <li className="flex gap-3 text-body leading-relaxed">
      <span
        aria-hidden="true"
        className={cn("shrink-0 select-none", checked ? "text-accent" : "text-faint")}
      >
        [{checked ? "x" : " "}]
      </span>
      <span className={checked ? "text-fg" : "text-dim"}>{children}</span>
      <span className="sr-only">{checked ? " (done)" : " (not done)"}</span>
    </li>
  );
}

/** Wrapper that lays out a group of CheckItems. */
export function CheckList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-2">{children}</ul>;
}
