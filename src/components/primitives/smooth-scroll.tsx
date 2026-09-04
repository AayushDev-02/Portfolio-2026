"use client";

import { useEffect } from "react";

/**
 * Inlined at build time by Next. It is not "1" in any committed environment, so
 * the branch below is dead code and the Lenis chunk is never requested.
 */
const FLAGGED = process.env.NEXT_PUBLIC_SMOOTH_SCROLL === "1";

/**
 * Momentum scrolling, off unless `NEXT_PUBLIC_SMOOTH_SCROLL=1`.
 *
 * **This is a conditional reversal of CLAUDE.md rule 4** ("no scroll-jacking").
 * It ships disabled; see docs/DECISIONS.md for what the rule said and why it is
 * being softened rather than deleted.
 *
 * Two gates, and both must pass:
 *
 * - The build-time flag. With it unset this component compiles to `null` and
 *   the dynamic import is never reached, so a visitor pays nothing for a
 *   feature nobody switched on.
 * - **Not `prefers-reduced-motion`.** Retimed scrolling is precisely the kind of
 *   motion that preference is about, and unlike every other effect on this page
 *   it cannot be opted out of by not looking at it. Watched rather than sampled,
 *   so toggling the preference destroys the instance rather than leaving it
 *   running until a reload.
 *
 * The runtime is a plain `import()` into `lib/smooth-scroll.ts` rather than a
 * `next/dynamic` component, because it renders nothing and `next/dynamic`'s
 * machinery measured 1.1KB gzipped that survives dead-code elimination even
 * with the flag off. Deferred to an effect on purpose: nothing about scrolling
 * needs to happen before first paint, and it must not exist during SSR.
 */
export function SmoothScroll() {
  useEffect(() => {
    // `FLAGGED` is a build-time constant, so with the flag unset the compiler
    // proves everything below unreachable and the `import()` never makes it
    // into the output at all.
    if (!FLAGGED) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!reduced) return;

    let stop: (() => void) | undefined;
    let cancelled = false;

    const sync = () => {
      if (reduced.matches) {
        stop?.();
        stop = undefined;
        return;
      }
      if (stop) return;
      import("@/lib/smooth-scroll").then(({ startSmoothScroll }) => {
        if (cancelled || reduced.matches) return;
        stop = startSmoothScroll();
      });
    };

    sync();
    reduced.addEventListener("change", sync);
    return () => {
      cancelled = true;
      reduced.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return null;
}
