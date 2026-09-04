"use client";

import { useEffect, useRef, useState } from "react";
import { usePointerMode } from "@/lib/pointer-mode";

/**
 * The hero backdrop: a drifting field of points that the pointer queries.
 *
 * This file is the gate. The field itself is `lib/embedding-field.ts`, reached
 * by a bare `import()` after the `load` event — the same seam
 * `lib/smooth-scroll.ts` uses, for the measured reason in docs/DECISIONS.md:
 * `next/dynamic` costs about 1KB gzipped of app code per usage while a plain
 * `import()` costs nothing. Nothing here needs to be a component; the only
 * markup is one `<canvas>`, and the field measures 1.26KB gzipped in its own
 * chunk against a 3KB budget.
 *
 * ## Five kill switches, each rendering nothing
 *
 * Three are answered here, before a canvas exists:
 *
 * - **No fine pointer, or `prefers-reduced-motion`** — both through
 *   `usePointerMode`, which watches the two queries rather than sampling them.
 *   Continuous ambient motion is exactly what the motion preference is about,
 *   and on touch there is no query to run: the pointer *is* the interaction, so
 *   without one this would be a battery cost with a decorative return.
 * - **`navigator.connection.saveData`.** Someone who has asked their browser to
 *   spend less should not be spending it on a background.
 * - **`hardwareConcurrency <= 4`.** A few hundred points per frame is cheap on
 *   a laptop and is not cheap on a low-end machine.
 *
 * Two more are answered by the field itself, which returns `null` when there is
 * no 2D context or the canvas never gets a size. Either way this takes the
 * canvas back out rather than leaving a dead element in the hero.
 *
 * ## After `load`, never before
 *
 * The hero is above the fold and contains the LCP element. Starting a rAF loop
 * and several hundred points before the page has finished loading competes with
 * exactly the paint being measured. Waiting costs the visitor nothing — the
 * field is ambient, and nobody is looking for it in the first 200ms.
 *
 * `aria-hidden`, `absolute inset-0`, no pointer events: it sits behind the hero
 * content and is invisible to assistive technology, which is correct — it is an
 * illustration of an idea the copy already states.
 */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mode = usePointerMode();
  const [loaded, setLoaded] = useState(false);
  const [capable, setCapable] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // `connection` is not in every browser's lib.dom, and its absence is not a
    // reason to skip the field.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (connection?.saveData) return;
    if ((navigator.hardwareConcurrency ?? 8) <= 4) return;
    setCapable(true);
  }, []);

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoaded(true);
      return;
    }
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const alive = mode === "full" && loaded && capable && !failed;

  useEffect(() => {
    const canvas = ref.current;
    if (!alive || !canvas) return;

    let cancelled = false;
    let stop: (() => void) | undefined;

    import("@/lib/embedding-field").then(({ startEmbeddingField }) => {
      if (cancelled) return;
      stop = startEmbeddingField(canvas) ?? undefined;
      // No 2D context, or a canvas that never got a size.
      if (!stop) setFailed(true);
    });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, [alive]);

  if (!alive) return null;

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a <canvas> is not in the tab order without a tabindex, and this one has none. The rule treats every canvas as interactive; this one takes no pointer events either.
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
