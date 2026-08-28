/**
 * The four "+" glyphs inset 24px from each corner of a section.
 * Purely decorative — hidden from assistive tech.
 */
export function CornerMarks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      <span className="absolute top-gutter left-gutter text-label leading-none text-faint">
        +
      </span>
      <span className="absolute top-gutter right-gutter text-label leading-none text-faint">
        +
      </span>
      <span className="absolute bottom-gutter left-gutter text-label leading-none text-faint">
        +
      </span>
      <span className="absolute right-gutter bottom-gutter text-label leading-none text-faint">
        +
      </span>
    </div>
  );
}
