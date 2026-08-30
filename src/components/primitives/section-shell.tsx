import { CornerMarks } from "./corner-marks";
import { Eyebrow, MicroLabel, Sigil } from "./labels";

type SectionShellProps = {
  /** Zero-based section number used in the eyebrow: 0 -> "00". */
  index: number;
  /** Eyebrow text, e.g. "INTRO". */
  eyebrow: string;
  /**
   * One-based position in the page. Exposed as `data-section-index` and read by
   * the pinned `SectionCounter`; the section no longer paints its own counter.
   */
  position: number;
  /** Anchor id for in-page navigation. */
  id: string;
  /** Caption shown bottom-left. */
  caption?: string;
  /** 2–3 letter sigil shown bottom-right. */
  sigil: string;
  /** Eyebrow/counter colour. Accent everywhere except the intro. */
  tone?: "accent" | "ink";
  /** Full-bleed layer behind the content — the hero photograph. */
  backdrop?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * The frame every section on the page shares.
 *
 * 100dvh, not 100vh: iOS Safari's dynamic toolbar makes vh taller than the
 * visible area, which cuts the footer row off. See docs/PLAN.md stage 9.
 */
export function SectionShell({
  index,
  eyebrow,
  position,
  id,
  caption,
  sigil,
  tone = "accent",
  backdrop,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-eyebrow`}
      data-section-index={position}
      className="relative flex min-h-dvh w-full flex-col border-b border-rule px-gutter py-10 sm:px-gutter-lg sm:py-14"
    >
      {backdrop}
      <CornerMarks />

      <header className="relative flex shrink-0 items-baseline justify-between gap-4">
        <span id={`${id}-eyebrow`}>
          <Eyebrow index={index} tone={tone}>
            {eyebrow}
          </Eyebrow>
        </span>
      </header>

      <div className="relative flex flex-1 flex-col justify-center py-12">{children}</div>

      <footer className="relative flex shrink-0 items-baseline justify-between gap-4">
        <MicroLabel>{caption ?? ""}</MicroLabel>
        <Sigil>{sigil}</Sigil>
      </footer>
    </section>
  );
}
