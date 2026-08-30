import { cn, pad } from "@/lib/utils";

type Tone = "accent" | "ink";

const tones: Record<Tone, string> = {
  accent: "text-accent",
  ink: "text-ink",
};

/** Section eyebrow, e.g. "00 — INTRO". */
export function Eyebrow({
  index,
  tone = "accent",
  children,
}: {
  index: number;
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("label", tones[tone])}>
      {pad(index)} — {children}
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
    <span className={cn("text-micro tracking-label uppercase text-prose", className)}>
      {children}
    </span>
  );
}

/** The 2–3 letter sigil pinned to the bottom-right of every section. */
export function Sigil({ children }: { children: React.ReactNode }) {
  return <span className="label text-prose">{children}</span>;
}
