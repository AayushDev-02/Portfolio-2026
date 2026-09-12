import { MicroLabel } from "./labels";
import { PointField } from "./point-field";

/**
 * The nearest-neighbour exhibit: a bordered panel that draws a point cloud, a
 * query, and the handful of points the query found.
 *
 * ## Why it is here and not in the hero
 *
 * Stage 17 put this behind the hero wordmark as a full-bleed backdrop. At 1400
 * by 900 the lit neighbourhood was a few hundred pixels of detail in a field
 * nobody was reading, so the effect that was supposed to say "this person
 * builds retrieval systems" said "there is some texture on this page". It was
 * decoration standing where evidence should be.
 *
 * In a 400px panel next to the retrieval pipeline diagram, with a caption
 * naming what it is, the query is the largest thing in frame and the panel is
 * adjacent to the step of the pipeline it illustrates. Same code, same idea,
 * doing the job it was written for.
 *
 * ## The still picture is the real one
 *
 * The SVG below is **always rendered, server-side**, and it is what a phone, a
 * reduced-motion visitor, a save-data visitor and a low-core machine see: forty
 * points, one query, and the five nearest joined to it. The live canvas is laid
 * over the top only when `PointField`'s five gates all open.
 *
 * That ordering matters for two separate reasons. The panel's box is reserved
 * by the SVG's own aspect ratio, so the canvas arriving after `load` moves
 * nothing and costs no CLS — the previous version rendered `null` until it was
 * ready, which is a layout shift waiting for a wide screen. And the exhibit
 * makes its point without JavaScript at all, which a decorative backdrop never
 * had to.
 *
 * Positions come from a fixed seed, so the still frame is identical in every
 * build and in both locales, and the picture is a real nearest-neighbour
 * result rather than a drawing of one: the five highlighted points are the five
 * closest to the query, found the same way `lib/embedding-field.ts` finds them.
 */

/** Drawing units. The panel scales this; nothing here is pixels. */
const W = 320;
/** 16:7. Wide and shallow, so the panel does not tower over the prose beside
 *  it — at 620px of column that is about 270px of drawing. */
const H = 140;
const COUNT = 40;
const NEIGHBOURS = 5;

/**
 * A linear congruential generator, seeded once.
 *
 * `Math.random` would give a different still frame on every build, and this
 * component renders on the server into statically prerendered HTML — so the
 * page would change for no reason on each deploy and diff noisily. Determinism
 * is the whole requirement; the quality of the distribution is not.
 */
function scatter() {
  let seed = 20260912;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < COUNT; i++) {
    points.push({
      x: 10 + next() * (W - 20),
      y: 10 + next() * (H - 20),
    });
  }
  return points;
}

const points = scatter();
/** The query vector. Off-centre, so the result does not look symmetrical. */
const query = { x: W * 0.44, y: H * 0.5 };
const lit = points
  .map((point, i) => ({
    i,
    d: Math.hypot(point.x - query.x, point.y - query.y),
  }))
  .sort((a, b) => a.d - b.d)
  .slice(0, NEIGHBOURS);
const litSet = new Set(lit.map((hit) => hit.i));

export function FieldExhibit({
  label,
  caption,
  title,
  desc,
}: {
  /** Micro-label above the panel, e.g. "NEAREST-NEIGHBOUR SEARCH". */
  label: string;
  /** One line under it saying what the pointer does. */
  caption: string;
  /** Accessible name for the drawing. */
  title: string;
  /** Accessible description — what a screen reader gets instead of the SVG. */
  desc: string;
}) {
  // Fixed ids rather than useId: this is a Server Component — no hooks — and
  // the exhibit renders once per page, beside the one featured project. The
  // same constraint `PipelineDiagram` and `StackDiagram` document.
  const titleId = "field-title";
  const descId = "field-desc";

  return (
    <figure className="m-0 flex flex-col gap-3">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <MicroLabel>{label}</MicroLabel>
        <MicroLabel className="normal-case">{caption}</MicroLabel>
      </figcaption>

      <div className="relative w-full border border-rule">
        {/* The still frame. `viewBox` plus `w-full h-auto` reserves the box
            before anything else renders, which is what keeps the canvas
            arriving after `load` from shifting the page. */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          className="block h-auto w-full"
        >
          <title id={titleId}>{title}</title>
          <desc id={descId}>{desc}</desc>

          {lit.map((hit) => {
            const point = points[hit.i];
            if (!point) return null;
            return (
              <line
                key={`line-${hit.i}`}
                x1={query.x}
                y1={query.y}
                x2={point.x}
                y2={point.y}
                className="stroke-accent"
                strokeWidth={0.75}
                // The same falloff the canvas uses: a nearer neighbour is a
                // stronger match, and the drawing should not claim otherwise.
                opacity={0.85 - hit.d / 200}
              />
            );
          })}

          {points.map((point, i) => (
            <circle
              key={`point-${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r={litSet.has(i) ? 2.4 : 1.1}
              className={litSet.has(i) ? "fill-accent" : "fill-ink"}
              opacity={litSet.has(i) ? 0.95 : 0.3}
            />
          ))}

          {/* The query itself: an open ring, so it reads as the thing asking
              rather than as the biggest result. */}
          <circle
            cx={query.x}
            cy={query.y}
            r={4}
            className="fill-none stroke-accent"
            strokeWidth={1}
          />
        </svg>

        {/* Laid over the still frame, and absent entirely on anything that
            should not be running a rAF loop.

            `field-canvas` paints the page colour behind the canvas, which is
            what hides the SVG rather than drawing the same points twice, and
            fades the swap in globals.css so the still frame does not blink out.
            Covering rather than removing is deliberate: the SVG stays in the
            accessibility tree and keeps reserving the box, so nothing moves. */}
        <PointField className="field-canvas pointer-events-none absolute inset-0 h-full w-full" />
      </div>
    </figure>
  );
}
