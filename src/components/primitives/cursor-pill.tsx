"use client";

import { useEffect, useRef, useState } from "react";

/** The opt-in. Its value is the text the pill shows. */
const LABEL_ATTR = "data-cursor-label";
const LABEL_SELECTOR = `[${LABEL_ATTR}]`;

/** Per-frame approach to the pointer. 0.2 ≈ 90% closed in twelve frames. */
const LERP = 0.2;

/** Below this, the remaining distance is not worth another frame. */
const EPSILON = 0.25;

/**
 * A dot that follows the pointer and grows into a labelled pill over anything
 * worth naming.
 *
 * This replaces the bracket reticle, which replaced a full-viewport crosshair.
 * Both of those only *framed* what was under the pointer; they said nothing.
 * This one carries a word: the project's index, the locale you would switch to,
 * the theme you would get. The cursor stops being decoration and starts being a
 * readout — which is the only justification for a custom cursor at all.
 *
 * ## Three gates, all of which must pass before anything renders
 *
 * - **`pointer: fine`.** Never on touch; there is no hovering cursor to track.
 * - **Not `prefers-reduced-motion`.** This is the one element on the page that
 *   moves continuously, which is precisely what that preference is about.
 * - **The pointer has actually moved.** Otherwise the dot paints in the
 *   top-left corner on load, which looks like a bug rather than an effect.
 *
 * Both media queries are *watched* rather than sampled once: a hybrid laptop
 * can gain or lose a fine pointer, and reduced-motion can be toggled with the
 * page already open.
 *
 * ## One listener, one frame, for the whole document
 *
 * Hover detection is delegated — a single `pointermove` on `window` plus
 * `event.target.closest()`. The alternative is a client component wrapped
 * around every card, link and button on the page, which is exactly what
 * CLAUDE.md rule 7 exists to prevent. Nothing that carries a label becomes a
 * client component; a label is an attribute on server-rendered markup.
 *
 * `pointermove` fires far more often than the display refreshes, so the handler
 * only records the position. A single frame callback interpolates and writes,
 * **and it parks itself** once the pill has caught up rather than spinning at
 * 60fps behind a still pointer.
 *
 * ## Why the label is measured rather than guessed
 *
 * `width: auto` cannot be transitioned, so the pill needs an explicit pixel
 * width to ease toward. The label span is `max-content` and `shrink-0`, so its
 * own `offsetWidth` *is* that number — measured from the rendered text in the
 * real font at the real size, which is the only way a pill fits both `002` and
 * `送信する`. `contain: layout size style` keeps that measurement inside this
 * element: reading `offsetWidth` here cannot invalidate document layout.
 *
 * Shrinking back is `removeProperty("width")`, which hands the element to its
 * resting `w-cursor-dot` class and transitions to it. That is why nothing here
 * knows how big the dot is — see the token block in globals.css.
 *
 * The old text is deliberately *not* cleared on exit. Clearing it would snap
 * the label away while the shape was still easing; leaving it to fade under the
 * same duration is what makes this one motion instead of two.
 *
 * Transform only, never `top`/`left`. The `translate(-50%, -50%)` composes with
 * the `translate3d` and resolves against the element's *current* animated size,
 * so the pill stays centred on the pointer all the way through the morph.
 */
export function CursorPill() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

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
    const el = root.current;
    const text = label.current;
    if (!el || !text) return;

    const pointer = { x: 0, y: 0 };
    const at = { x: 0, y: 0 };
    let current: string | null = null;
    let raf = 0;
    let shown = false;

    const draw = () => {
      raf = 0;
      const dx = pointer.x - at.x;
      const dy = pointer.y - at.y;
      const settled = Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON;

      if (settled) {
        at.x = pointer.x;
        at.y = pointer.y;
      } else {
        at.x += dx * LERP;
        at.y += dy * LERP;
      }

      el.style.transform = `translate3d(${at.x}px, ${at.y}px, 0) translate(-50%, -50%)`;
      if (!settled) raf = requestAnimationFrame(draw);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const morph = (next: string | null) => {
      if (next === current) return;
      current = next;

      if (next === null) {
        el.style.removeProperty("width");
        el.style.removeProperty("height");
        el.dataset.cursorPill = "dot";
        return;
      }

      text.textContent = next;
      el.style.width = `${text.offsetWidth}px`;
      el.style.height = `${text.offsetHeight}px`;
      el.dataset.cursorPill = "pill";
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (!shown) {
        shown = true;
        // Start where the pointer already is rather than sliding in from the
        // corner on the first move.
        at.x = pointer.x;
        at.y = pointer.y;
        el.style.opacity = "1";
      }

      const node = event.target instanceof Element ? event.target : null;
      morph(node?.closest(LABEL_SELECTOR)?.getAttribute(LABEL_ATTR) || null);
      schedule();
    };

    // Without this the pill hangs at the edge of the window after the pointer
    // has left it.
    const onLeave = () => {
      shown = false;
      el.style.opacity = "0";
      morph(null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-cursor-pill="dot"
      className="pointer-events-none fixed top-0 left-0 z-10 flex h-cursor-dot w-cursor-dot items-center justify-center overflow-hidden rounded-cursor bg-accent"
      style={{ opacity: 0, contain: "layout size style", willChange: "transform" }}
    >
      {/* `w-max` and `shrink-0` are what make `offsetWidth` the label's natural
          width rather than whatever the container has eased to this frame. */}
      <span
        ref={label}
        className="w-max shrink-0 whitespace-nowrap px-3 py-1.5 font-mono text-eyebrow font-bold tracking-label text-bg"
      />
    </div>
  );
}
