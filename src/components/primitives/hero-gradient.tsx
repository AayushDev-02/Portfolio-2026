"use client";

import { useEffect, useRef, useState } from "react";
import { usePointerMode } from "@/lib/pointer-mode";

/**
 * The hero's ground: a still grainy gradient for everyone, and a moving one for
 * anyone whose machine should be spending the frames.
 *
 * ## The static layer is not a fallback
 *
 * `.hero-gradient-static` is a CSS radial gradient in the same two tokens the
 * shader reads, and it is **always rendered** — it is in the server markup, it
 * costs nothing, and it is what a phone, a reduced-motion visitor, a save-data
 * visitor, a low-core machine and a browser with no WebGL actually see. The
 * canvas fades in over the top of it when it earns its place.
 *
 * That is the difference between this and the point field it replaces. The
 * field rendered *nothing* when it was gated off, so a phone got a blank white
 * hero; here every gate closing still leaves a designed background. Which is
 * also why the gates can afford to be strict.
 *
 * ## Five kill switches, none of which take the background with them
 *
 * Three are answered here, before a canvas exists:
 *
 * - **No fine pointer, or `prefers-reduced-motion`** — both through
 *   `usePointerMode`, which watches the two queries rather than sampling them
 *   once. Continuous ambient motion is exactly what the motion preference is
 *   about. And on touch there is no pointer to bend the field with, so a
 *   fullscreen fragment shader plus ~40KB of Three.js would be battery and
 *   mobile data spent on a still image the CSS below already draws. This site
 *   assumes a recruiter on a phone on mobile data; that visitor downloads none
 *   of it.
 * - **`navigator.connection.saveData`.** Someone who asked their browser to
 *   spend less should not be spending it on a background.
 * - **`hardwareConcurrency <= 4`.** A proxy for the GPU, which nothing exposes.
 *
 * Two more are answered by the scene, which returns `null` when there is no
 * WebGL context or the canvas never gets a size. Either way the canvas comes
 * back out and the static layer is simply never covered.
 *
 * ## After `load`, never before
 *
 * The hero is above the fold and contains the LCP element, which is the
 * wordmark. Compiling a shader and starting a rAF loop before the page has
 * finished loading competes with exactly the paint being measured. Waiting
 * costs the visitor nothing — the still gradient is already on screen, and the
 * 600ms fade in globals.css means the swap is not a flash.
 *
 * `aria-hidden`, `absolute inset-0`, no pointer events: it sits behind the hero
 * content and is invisible to assistive technology, which is correct — it is a
 * background.
 */
export function HeroGradient() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mode = usePointerMode();
  const [loaded, setLoaded] = useState(false);
  const [capable, setCapable] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // `connection` is not in every browser's lib.dom, and its absence is not a
    // reason to skip the gradient.
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

    // A bare `import()`, not `next/dynamic`: this is the seam that keeps every
    // byte of Three.js out of the route manifest and off the first-load budget.
    // See docs/DECISIONS.md — `next/dynamic` was measured at ~1KB per usage and
    // dropped across the project for it.
    import("@/lib/hero-gradient").then(({ startHeroGradient }) => {
      if (cancelled) return;
      stop = startHeroGradient(canvas, () => setReady(true)) ?? undefined;
      // No WebGL context, or a canvas that never got a size.
      if (!stop) setFailed(true);
    });

    return () => {
      cancelled = true;
      setReady(false);
      stop?.();
    };
  }, [alive]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="hero-gradient-static absolute inset-0" />
      {alive ? (
        <canvas
          ref={ref}
          data-ready={ready ? "" : undefined}
          className="hero-gradient-canvas absolute inset-0 h-full w-full"
        />
      ) : null}
      {/* Both layers resolve to the page colour at the foot, so the border with
          ABOUT stays a hairline. The shader does this itself as well — this
          covers the static layer, and the seam while the canvas fades in. */}
      <div className="hero-gradient-fade absolute inset-x-0 bottom-0 h-[18%]" />
    </div>
  );
}
