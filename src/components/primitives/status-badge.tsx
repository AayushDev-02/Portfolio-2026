import { cn } from "@/lib/utils";

export type Status = "done" | "current" | "upcoming";

const LABEL: Record<Status, string> = {
  done: "DONE",
  current: "IN PROGRESS",
  upcoming: "UPCOMING",
};

/** Bracketed status marker: [DONE] / [IN PROGRESS] / [UPCOMING]. */
export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "label whitespace-nowrap",
        status === "current" ? "text-accent" : "text-dim",
        status === "upcoming" && "text-faint",
      )}
    >
      [{LABEL[status]}]
    </span>
  );
}
