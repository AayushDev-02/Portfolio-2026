"use client";

import { useEffect, useRef, useState } from "react";
import { loadMotionModules } from "@/lib/gsap-motion";

/**
 * A faint full-width and full-height hairline pair tracking the cursor — a CAD
 * reticle, or the crosshair of a terminal. Stage 12 §D.
 *
 * Three gates, all of which must pass before anything renders:
 *
 * - **`pointer: fine`.** Never on touch. A touch device has no hovering cursor,
 *   so the lines would either sit frozen where the last tap landed or track
 *   nothing at all.
 * - **Not `prefers-reduced-motion`.** The brief says skip entirely, and it is
 *   right: this is the one effect on the page that moves continuously, and a
 *   constantly-moving element is exactly what that preference is about.
 * - **The pointer has actually moved.** Otherwise a crosshair paints at the
 *   top-left corner on load, which reads as a rendering artefact.
 *
 * Both media queries are watched, not merely sampled. A hybrid laptop can gain
 * or lose a fine pointer, and the reduced-motion preference can be toggled while
 * the page is open; a one-time read at mount would strand the crosshair on.
 *
 * **The listener never writes to the DOM.** `mousemove` fires far more often
 * than the display refreshes, so it only records coordinates and flags a frame;
 * a single `requestAnimationFrame` loop does the one `translate3d` per frame.
 * Writing on every event is how this effect usually ends up on the INP budget.
 * Transform only — never `top`/`left`, which would force layout each frame.
 */
export function CursorCrosshair() {
  const horizontal = useRef<HTMLDivElement>(null);
  const vertical = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia?.("(pointer: fine)");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!fine || !reduced) return;

    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let toX: ((value: number) => void) | undefined;
    let toY: ((value: number) => void) | undefined;
    const start = () => {
      loadMotionModules().then(({ gsap }) => {
        if (cancelled || !horizontal.current || !vertical.current) return;
        toX = gsap.quickTo(vertical.current, "x", { duration: 0.18, ease: "power3" });
        toY = gsap.quickTo(horizontal.current, "y", { duration: 0.18, ease: "power3" });
      });
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    const onMove = (event: MouseEvent) => {
      toX?.(event.clientX);
      toY?.(event.clientY);
      if (!visible) setVisible(true);
    };

    // Hide when the pointer leaves the window entirely, so the lines do not
    // hang at the edge while someone is in another application.
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelled = true;
      window.removeEventListener("load", start);
      loadMotionModules().then(({ gsap }) =>
        gsap.killTweensOf([horizontal.current, vertical.current]),
      );
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        ref={horizontal}
        className="absolute inset-x-0 top-0 h-px bg-rule will-change-transform"
      />
      <div
        ref={vertical}
        className="absolute inset-y-0 left-0 w-px bg-rule will-change-transform"
      />
    </div>
  );
}
