/**
 * The hero's embedding field: a drift of points, and a pointer that queries it.
 *
 * The page belongs to someone who builds retrieval systems, so it shows
 * retrieval rather than describing it. The pointer is the query vector; each
 * frame the nearest handful of points light up and connect to it, and every
 * other point keeps drifting untouched. **That contrast is the whole idea.** If
 * the entire field reacted it would read as a screensaver; a lit neighbourhood
 * in an indifferent field reads as nearest-neighbour search, which is what it
 * is.
 *
 * ## There is always a query
 *
 * When the pointer is away the query does not switch off — it eases back to the
 * middle of the panel and keeps returning results. That is a stage-18 change and
 * it is the difference between a picture of retrieval and a scattering of dots:
 * as a full-bleed hero backdrop the resting state was *supposed* to be inert
 * texture, but in `FieldExhibit`, captioned and framed, a resting state with no
 * query showed nothing of what the caption claims. It also means the live canvas
 * and the still SVG underneath it draw the same picture, so the swap between
 * them is invisible.
 *
 * ## Plain 2D canvas, deliberately
 *
 * No Three.js, no react-three-fiber, no OGL. r3f is roughly 90KB gzipped and
 * would blow the 120KB first-load gate on its own, and a field of points with
 * straight lines has no use for a scene graph, a camera or a material system.
 * The measured precedent on this project is that the library gets weighed
 * against the budget before it is adopted, not after — see docs/DECISIONS.md.
 *
 * ## No colour value appears in this file
 *
 * Every colour *and every opacity* is read from the CSS custom properties at
 * start and re-read when `data-theme` changes on `<html>`. Opacity is applied
 * through `globalAlpha` rather than mixed into a colour string, which is what
 * lets the field take a raw token value it never has to parse — and what lets
 * the dark theme lift the drift alpha, since the same value that reads as faint
 * texture on white is nearly invisible on the dark ground. The field follows both themes without
 * knowing either exists — the same trick `--hero-image-filter` used to keep
 * `HeroBackdrop` theme-blind.
 *
 * Callers get a teardown function, or `null` if the canvas cannot be used —
 * which is two of the five kill switches (no 2D context, and a canvas that
 * never gets a size). The other three are in `hero-field.tsx`, because they can
 * be answered before a canvas is created at all.
 */

/** One point per this many CSS pixels of hero. */
const AREA_PER_POINT = 2200;
/** Ceiling on a wide screen, and a third of it below `sm`. */
const MAX_POINTS = 900;
const MAX_POINTS_SM = MAX_POINTS / 3;
/** Matches the `sm` breakpoint. */
const SM = 640;

/** How many points the query lights. Small on purpose: see the doc block. */
const NEIGHBOURS = 8;
/** Past this the pointer is not near anything and no line is drawn. */
const REACH = 260;

/** CSS px per second. Slow enough to read as drift rather than motion. */
const SPEED = 7;

/** How fast the query catches up, per second. Eased, never snapped. */
const QUERY_EASE = 4.5;

/** Radius of the open ring drawn at the query. Matches the still SVG's. */
const QUERY_RING = 4;

const DOT = 0.9;
const DOT_LIT = 2.1;

/** Retina without paying for a 3x phone. */
const MAX_DPR = 2;

type Point = { x: number; y: number; vx: number; vy: number };

export function startEmbeddingField(canvas: HTMLCanvasElement): (() => void) | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const root = document.documentElement;
  let ink = "";
  let accent = "";
  let alphaDrift = 0;
  let alphaLit = 0;
  let alphaLine = 0;

  const readTheme = () => {
    const style = getComputedStyle(root);
    ink = style.getPropertyValue("--color-ink").trim();
    accent = style.getPropertyValue("--color-accent").trim();
    // Opacity is a token too, because the alpha that reads as faint texture on
    // white is nearly invisible on the dark ground. Reading it keeps every
    // theme-dependent value out of this file.
    alphaDrift = Number(style.getPropertyValue("--field-drift-alpha")) || 0.3;
    alphaLit = Number(style.getPropertyValue("--field-lit-alpha")) || 0.95;
    alphaLine = Number(style.getPropertyValue("--field-line-alpha")) || 0.5;
  };
  readTheme();

  let width = 0;
  let height = 0;
  let points: Point[] = [];
  /**
   * Where the query is, and where it is heading. Separate because the query
   * eases: snapping a lit neighbourhood to the cursor reads as a hover effect,
   * and lagging it by a few frames reads as a lookup.
   */
  const query = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0, on: false };
  let raf = 0;
  let last = 0;
  let visible = true;
  let onScreen = true;

  const seed = () => {
    const target = Math.min(
      width < SM ? MAX_POINTS_SM : MAX_POINTS,
      Math.round((width * height) / AREA_PER_POINT),
    );
    const next: Point[] = [];
    for (let i = 0; i < target; i++) {
      // Existing points keep their position through a resize, so a window drag
      // does not reshuffle the whole field.
      const kept = points[i];
      next.push(
        kept && kept.x <= width && kept.y <= height
          ? kept
          : {
              x: Math.random() * width,
              y: Math.random() * height,
              // Direction is uniform on the circle; speed is not, so the field
              // does not look like it is expanding from a point.
              vx: (Math.random() * 2 - 1) * SPEED,
              vy: (Math.random() * 2 - 1) * SPEED,
            },
      );
    }
    points = next;
  };

  const size = () => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;
    const first = width === 0;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    // Draw in CSS pixels; the transform absorbs the device ratio.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // The resting query sits in the middle, so the very first frame already
    // shows a result rather than waiting for a pointer that may never arrive.
    if (first) {
      query.x = width / 2;
      query.y = height / 2;
    }
    seed();
    return true;
  };

  if (!size()) return null;

  /**
   * The query. Selection-sorts the `NEIGHBOURS` closest points into a small
   * fixed array rather than sorting all of them — one pass, no allocation per
   * frame, and the array is eight long.
   */
  const nearest: { point: Point; d: number }[] = [];

  const draw = (now: number) => {
    raf = requestAnimationFrame(draw);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    ctx.clearRect(0, 0, width, height);

    // Toward the pointer while it is over the canvas, back to the middle when
    // it is not. Exponential easing, so it is frame-rate independent.
    const toX = pointer.on ? pointer.x : width / 2;
    const toY = pointer.on ? pointer.y : height / 2;
    const k = 1 - Math.exp(-QUERY_EASE * dt);
    query.x += (toX - query.x) * k;
    query.y += (toY - query.y) * k;

    nearest.length = 0;
    for (const p of points) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      // Wrap rather than bounce: a bounce draws the edge of the box, and there
      // is no box.
      if (p.x < 0) p.x += width;
      else if (p.x > width) p.x -= width;
      if (p.y < 0) p.y += height;
      else if (p.y > height) p.y -= height;

      const dx = p.x - query.x;
      const dy = p.y - query.y;
      const d = Math.hypot(dx, dy);
      if (d > REACH) continue;
      if (nearest.length < NEIGHBOURS) {
        nearest.push({ point: p, d });
        nearest.sort((a, b) => a.d - b.d);
      } else if (d < (nearest[NEIGHBOURS - 1]?.d ?? Infinity)) {
        nearest[NEIGHBOURS - 1] = { point: p, d };
        nearest.sort((a, b) => a.d - b.d);
      }
    }

    // The indifferent field.
    ctx.globalAlpha = alphaDrift;
    ctx.fillStyle = ink;
    ctx.beginPath();
    for (const p of points) {
      ctx.moveTo(p.x + DOT, p.y);
      ctx.arc(p.x, p.y, DOT, 0, Math.PI * 2);
    }
    ctx.fill();

    // The neighbourhood the query found. `nearest` is empty only when every
    // point has drifted further away than REACH, which the ring below still
    // has to survive — so this is a branch, not an early return.

    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    for (const hit of nearest) {
      const fade = 1 - hit.d / REACH;
      ctx.globalAlpha = alphaLine * fade;
      ctx.beginPath();
      ctx.moveTo(query.x, query.y);
      ctx.lineTo(hit.point.x, hit.point.y);
      ctx.stroke();
    }

    ctx.fillStyle = accent;
    for (const hit of nearest) {
      const fade = 1 - hit.d / REACH;
      ctx.globalAlpha = alphaLit * fade;
      ctx.beginPath();
      ctx.arc(hit.point.x, hit.point.y, DOT + (DOT_LIT - DOT) * fade, 0, Math.PI * 2);
      ctx.fill();
    }

    // The query itself: an open ring, so it reads as the thing asking rather
    // than as the strongest result. The still SVG in `FieldExhibit` draws the
    // same mark, which is what makes the canvas fading in over it invisible.
    ctx.globalAlpha = alphaLit;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(query.x, query.y, QUERY_RING, 0, Math.PI * 2);
    ctx.stroke();
  };

  const run = () => {
    // A background tab, or a hero scrolled past, must not run this.
    const should = visible && onScreen;
    if (should && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(draw);
    } else if (!should && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const onMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    // Outside the hero there is no query, and the field simply drifts.
    pointer.on =
      pointer.x >= 0 && pointer.y >= 0 && pointer.x <= width && pointer.y <= height;
  };

  const onLeave = () => {
    pointer.on = false;
  };

  const onVisibility = () => {
    visible = document.visibilityState === "visible";
    run();
  };

  const resizeObserver = new ResizeObserver(() => {
    size();
  });
  resizeObserver.observe(canvas);

  const intersectionObserver = new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    run();
  });
  intersectionObserver.observe(canvas);

  const themeObserver = new MutationObserver(readTheme);
  themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("mouseleave", onLeave);
  document.addEventListener("visibilitychange", onVisibility);
  run();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    themeObserver.disconnect();
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("mouseleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
