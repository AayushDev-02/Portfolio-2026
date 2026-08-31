"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { pad } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

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
    if (sections.length === 0) return;
    const triggers = Array.from(sections).map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setCurrent(Number(section.dataset.sectionIndex ?? "1")),
        onEnterBack: () => setCurrent(Number(section.dataset.sectionIndex ?? "1")),
      }),
    );
    return () => {
      triggers.forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <span aria-hidden="true" className="label tabular-nums text-accent">
      {pad(current)} / {pad(total)}
    </span>
  );
}
