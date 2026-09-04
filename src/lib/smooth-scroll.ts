import Lenis from "lenis";
import { loadMotionModules } from "./gsap-motion";

/**
 * Start momentum scrolling. Returns the teardown.
 *
 * A plain loader rather than a component, following `gsap-motion.ts`: it
 * renders nothing, so making it a component would only mean paying for
 * `next/dynamic`'s machinery — measured at 1.1KB gzipped of app code that
 * survives dead-code elimination even with the flag off. As a bare `import()`
 * inside a branch the compiler can prove is dead, the disabled build carries
 * nothing at all.
 *
 * ## Why this is wired to GSAP
 *
 * Two things on this page read scroll position through ScrollTrigger — the
 * pinned `01 / 06` counter and the RESULTS count-up. Left alone, Lenis animates
 * `window.scrollY` on its own rAF loop while ScrollTrigger samples on another,
 * and the two drift: the counter changes a section late and the numbers start
 * counting after the band has gone past. Driving `lenis.raf` **from the GSAP
 * ticker** and calling `ScrollTrigger.update` on every Lenis scroll puts both
 * on one clock. That is the only reason Lenis touches GSAP at all.
 *
 * `lagSmoothing(0)` is required, not tuning. GSAP's default pauses its clock
 * after a long frame so animations resume where they left off; Lenis would be
 * stranded mid-scroll by that, because its position is a function of elapsed
 * time rather than of progress. It is restored on teardown so nothing else on
 * the page inherits the change.
 *
 * `anchors: true` hands in-page links back to Lenis so `#main` and the section
 * anchors still land — without it Lenis and the browser animate the same scroll
 * and the page ends up somewhere neither intended. Verified: the skip link
 * moves the sequential focus point into `<main>` identically with it on and
 * off, `#skills` lands at exactly 0px, `focus()` scrolls the element into view,
 * the counter reads `05 / 06` at `#projects`, and the back button restores
 * scroll position to the pixel.
 */
export function startSmoothScroll(): () => void {
  const lenis = new Lenis({ autoRaf: false, anchors: true });
  let cancelled = false;
  let detach: (() => void) | undefined;

  loadMotionModules().then(({ gsap, ScrollTrigger }) => {
    // The import is async, so this can have been torn down before it lands.
    if (cancelled) return;

    // gsap.ticker reports seconds; lenis.raf expects milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000);
    const update = () => ScrollTrigger.update();

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", update);

    detach = () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", update);
    };
  });

  return () => {
    cancelled = true;
    detach?.();
    lenis.destroy();
  };
}
