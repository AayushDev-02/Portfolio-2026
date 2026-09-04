"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Item } from "./project-hover-media";

/** The row opt-in. Its value is the ordinal that selects a cover. */
const ROW_ATTR = "data-project-row";
const ROW_SELECTOR = `[${ROW_ATTR}]`;

/** Per-frame approach to the pointer. Slower than the cursor pill's, on purpose:
 *  the lag IS the effect. A preview that keeps up with the pointer is a
 *  tooltip. */
const LERP = 0.14;
const EPSILON = 0.3;

/** Degrees of tilt per pixel of that frame's travel. */
const TILT_PER_PX = 0.5;
/** Past this the tilt reads as a glitch rather than momentum. */
const MAX_TILT = 6;
/** How fast the tilt eases back to level once the pointer stops. */
const TILT_LERP = 0.1;

/** Covers arrive slightly small and settle, so appearing reads as arriving. */
const ENTER_SCALE = 0.96;
const SCALE_LERP = 0.14;

/**
 * The cover art that trails the pointer across the PROJECTS rows.
 *
 * **This module is loaded on demand and never on a touch device.** It is behind
 * a `next/dynamic` boundary in `project-hover-media.tsx`, which only reaches for
 * it once a fine pointer is confirmed — the same deferred-activation pattern
 * `lib/gsap-motion.ts` uses, and for the same reason: it kept 51.5KB of motion
 * code out of the initial route in stage 12. A phone downloads neither the
 * covers nor the code that would show them.
 *
 * Mounted **once** for the whole section, never once per row. Every cover is
 * rendered into a single fixed layer at `opacity: 0` and only the hovered one
 * is raised, so the swap is a compositor property change on a decoded image
 * rather than a fetch nobody waited for.
 *
 * ## Two modes, both of which show the art
 *
 * - **`full`** — the following layer.
 * - **`reduced`** — the visitor asked for less motion, so there is no layer; a
 *   static thumbnail is portalled into each row's slot instead. Removing the
 *   effect must not remove the content, and this is the only picture of the
 *   work on the page.
 *
 * The portal is what keeps every decision about whether an `<img>` exists
 * inside this one module. `display: none` does not cancel a fetch — not
 * rendering does — so the rows carry an empty slot rather than a hidden image.
 *
 * ## Why it lags, and why it tilts
 *
 * The rotation is proportional to how far the layer moved *this frame*, clamped
 * and eased back to level when the pointer stops. Together with the slow lerp
 * that is the whole effect — a card being dragged through the page rather than
 * a box pinned to the cursor. Without it this is a tooltip.
 *
 * ## Why this does not share the cursor pill's loop
 *
 * The brief allows sharing "if cheaper". It is not. Both loops park when their
 * work is done — measured at zero scheduled callbacks behind a still pointer —
 * so an idle second loop costs nothing, while a shared one would tie the
 * cursor's lifetime to whether the PROJECTS section happens to be mounted.
 *
 * The layer is `aria-hidden` and its images carry empty alt: the row it shadows
 * already has the project's name, and announcing it twice is worse than not at
 * all. The inline thumbnail is real content and carries the real alt text.
 *
 * `position: fixed` and nothing reserved in the flow, so this contributes
 * exactly zero to CLS.
 */
export default function ProjectHoverLayer({
  items,
  mode,
}: {
  items: Item[];
  mode: "full" | "reduced";
}) {
  const layer = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<{ ordinal: string; node: HTMLElement }[]>([]);

  // The rows are server-rendered and carry an empty slot each; under reduced
  // motion the thumbnails are portalled into them.
  useEffect(() => {
    if (mode !== "reduced") {
      setSlots([]);
      return;
    }
    const found: { ordinal: string; node: HTMLElement }[] = [];
    for (const item of items) {
      const node = document.querySelector<HTMLElement>(
        `[data-project-thumb="${item.ordinal}"]`,
      );
      if (node) found.push({ ordinal: item.ordinal, node });
    }
    setSlots(found);
  }, [mode, items]);

  useEffect(() => {
    if (mode !== "full") return;
    const el = layer.current;
    if (!el) return;

    const covers = new Map<string, HTMLElement>();
    for (const node of el.querySelectorAll<HTMLElement>("[data-project-media]")) {
      const key = node.dataset.projectMedia;
      if (key) covers.set(key, node);
    }

    const pointer = { x: 0, y: 0 };
    const at = { x: 0, y: 0 };
    let tilt = 0;
    let scale = ENTER_SCALE;
    let active: string | null = null;
    let raf = 0;

    const draw = () => {
      raf = 0;
      // Nothing is showing, so nothing needs a frame. This is the park.
      if (!active) return;

      const dx = pointer.x - at.x;
      const dy = pointer.y - at.y;
      const stepX = dx * LERP;
      at.x += stepX;
      at.y += dy * LERP;

      const wantTilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, stepX * TILT_PER_PX));
      tilt += (wantTilt - tilt) * TILT_LERP;
      scale += (1 - scale) * SCALE_LERP;

      el.style.transform = `translate3d(${at.x}px, ${at.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg) scale(${scale})`;

      const settled =
        Math.abs(dx) < EPSILON &&
        Math.abs(dy) < EPSILON &&
        Math.abs(tilt) < 0.05 &&
        Math.abs(1 - scale) < 0.004;

      if (settled) {
        tilt = 0;
        scale = 1;
        el.style.transform = `translate3d(${at.x}px, ${at.y}px, 0) translate(-50%, -50%)`;
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const show = (next: string | null) => {
      if (next === active) return;
      if (active) covers.get(active)?.style.removeProperty("opacity");

      if (!next) {
        active = null;
        el.style.opacity = "0";
        return;
      }

      const cover = covers.get(next);
      if (!cover) {
        // A row with no art. Hide rather than leave the last one hanging.
        active = null;
        el.style.opacity = "0";
        return;
      }

      // Arriving from nothing: start at the pointer rather than sliding in from
      // wherever the last cover happened to stop.
      if (!active) {
        at.x = pointer.x;
        at.y = pointer.y;
        tilt = 0;
        scale = ENTER_SCALE;
      }
      active = next;
      cover.style.opacity = "1";
      el.style.opacity = "1";
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      const node = event.target instanceof Element ? event.target : null;
      show(node?.closest(ROW_SELECTOR)?.getAttribute(ROW_ATTR) || null);
      schedule();
    };

    const onLeave = () => show(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode]);

  if (mode === "reduced") {
    return (
      <>
        {slots.map(({ ordinal, node }) => {
          const item = items.find((candidate) => candidate.ordinal === ordinal);
          if (!item) return null;
          return createPortal(
            /* next/image ships ~5KB of client runtime and was removed from the
               hero for exactly that reason (see hero-backdrop.tsx). These are
               fixed-size local assets declaring their own intrinsic dimensions,
               which is all next/image would have added. */
            // biome-ignore lint/performance/noImgElement: see above — next/image costs 5KB of runtime for nothing these need.
            <img
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
              loading="lazy"
              decoding="async"
              className="h-full w-full border border-rule object-cover"
            />,
            node,
            ordinal,
          );
        })}
      </>
    );
  }

  return (
    <div
      ref={layer}
      aria-hidden="true"
      data-project-layer=""
      className="pointer-events-none fixed top-0 left-0 z-10 aspect-project-media w-project-media"
      style={{ opacity: 0, willChange: "transform" }}
    >
      {items.map((item) => (
        /* As above, and this layer needs every cover fetched and decoded up
           front — which next/image's lazy default actively works against. */
        // biome-ignore lint/performance/noImgElement: see above — eager decode is the whole mechanism here.
        <img
          key={item.ordinal}
          data-project-media={item.ordinal}
          src={item.image.src}
          alt=""
          width={item.image.width}
          height={item.image.height}
          decoding="async"
          className="absolute inset-0 h-full w-full border border-rule object-cover"
        />
      ))}
    </div>
  );
}
