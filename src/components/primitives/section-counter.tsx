"use client";

import { useEffect, useState } from "react";
import { pad } from "@/lib/utils";

/**
 * The `01 / 06` readout, pinned to the corner and tracking the current section.
 * Stage 12 §E.
 *
 * Previously every section painted its own static counter, which was accurate
 * but inert: it scrolled away with the section that drew it. Pinning one and
 * driving it from scroll position turns it from decoration into information —
 * you can always see where in the page you are.
 *
 * One `IntersectionObserver` for every section, not one per section.
 * `rootMargin: "-50% 0px"` shrinks the viewport to a single line across its
 * middle, so a section becomes "current" exactly when it crosses the midpoint
 * rather than when its first pixel appears — which is what stops the number
 * flickering between two sections at every boundary.
 *
 * Only numbered sections are observed. The RESULTS band is deliberately
 * unnumbered (stage 13 §C), so it carries no `data-section-index` and the
 * readout simply holds its previous value while the band passes.
 *
 * Purely informational and duplicated by nothing: `aria-hidden`, so a screen
 * reader is not told the section number twice as it moves through the page.
 */
export function SectionCounter({ total }: { total: number }) {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-section-index]");
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.sectionIndex ?? "1");
          if (Number.isFinite(index)) setCurrent(index);
        }
      },
      // A one-pixel band across the middle of the viewport.
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <span aria-hidden="true" className="label tabular-nums text-accent">
      {pad(current)} / {pad(total)}
    </span>
  );
}
