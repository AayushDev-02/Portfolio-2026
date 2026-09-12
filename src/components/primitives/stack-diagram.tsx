import type { StackDiagram as Labels, SkillLayer } from "@/content";

/**
 * The stack, drawn.
 *
 * SKILLS was nine bulleted lists and the tallest section on the page at about
 * 1676px. Nine flat categories also say nothing about how the pieces relate: a
 * reader had to already know which of them sit on top of which. Five bands in
 * build order say it without a sentence, and the AI band sits on the terminal
 * ground because that layer is what the whole page argues for — the same device
 * `pipeline-diagram.tsx` uses to mark where the answer is produced.
 *
 * Server component, hand-authored inline SVG, following `pipeline-diagram.tsx`:
 * no charting library (stage 7's budget binds, and a generic import would look
 * like clip art beside the rest of the page), every drawn string from the
 * content layer so the diagram translates, and every colour a token class so it
 * follows both themes without knowing either exists. `<title>` and `<desc>` are
 * what a screen reader is given *instead of* the drawing, so they carry the
 * argument rather than captioning it.
 *
 * ## Two renderings, one source
 *
 * SVG text does not wrap and it scales with the drawing, so a 720-unit viewBox
 * squeezed into a 312px phone renders 9px labels at under 4px. Scaling the
 * drawing down was explicitly not the answer, so below `sm` the same five bands
 * render as HTML — which wraps natively, handles Japanese correctly, and needs
 * no width arithmetic at all. Exactly one of the two is in the accessibility
 * tree at any viewport, because `display: none` removes the other.
 *
 * Zero client JavaScript either way.
 */

/** viewBox width. The drawing is authored at this size and scales as one. */
const W = 720;
/** Gutter strip on the left edge of each band — what makes it read as a stack. */
const SPINE = 6;
const PAD = 14;
/** Baseline of the layer name, from the band's top edge. */
const NAME_Y = 20;
/** Baseline of the first item line. */
const ITEMS_Y = 38;
const LINE_H = 14;
const BOTTOM_PAD = 12;

/** Matches --text-badge, in user units. Only the item lines need measuring. */
const ITEM_SIZE = 9;

const ITEMS_W = W - SPINE - PAD * 2;

/**
 * Full-width characters advance about one em; the mono face's Latin advances
 * about 0.6. Close enough to break lines with, and the only reason an estimate
 * is needed at all is that a Server Component cannot measure text.
 */
const FULL_WIDTH = /[⺀-鿿豈-﫿＀-￯　-〿]/;

function advance(text: string, size: number): number {
  let width = 0;
  for (const ch of text) width += FULL_WIDTH.test(ch) ? size : size * 0.6;
  return width;
}

const SEP = " · ";

/** Greedy line breaking at item boundaries. Never mid-item. */
function wrapItems(items: string[], maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const item of items) {
    const candidate = line ? line + SEP + item : item;
    if (line && advance(candidate, ITEM_SIZE) > maxWidth) {
      lines.push(line);
      line = item;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function bandHeight(lineCount: number): number {
  return ITEMS_Y + (lineCount - 1) * LINE_H + BOTTOM_PAD;
}

export function StackDiagram({
  layers,
  labels,
}: {
  layers: SkillLayer[];
  labels: Labels;
}) {
  // Fixed ids rather than useId: this is a Server Component, which has no
  // hooks, and the diagram renders once per page.
  const titleId = "stack-title";
  const descId = "stack-desc";

  const bands = layers.map((layer) => {
    const lines = wrapItems(layer.items, ITEMS_W);
    return { layer, lines, height: bandHeight(lines.length) };
  });

  let cursor = 0;
  const placed = bands.map((band) => {
    const y = cursor;
    cursor += band.height;
    return { ...band, y };
  });
  const total = cursor;

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${total}`}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className="hidden h-auto w-full sm:block"
      >
        <title id={titleId}>{labels.title}</title>
        <desc id={descId}>{labels.desc}</desc>

        {placed.map(({ layer, lines, height, y }) => (
          <g key={layer.name}>
            {/* The emphasised band takes the terminal ground — the page's one
                dark element — so the layer the site argues for is the layer you
                see first. */}
            <rect
              x="0"
              y={y}
              width={W}
              height={height}
              className={layer.emphasis ? "fill-terminal-bg" : "fill-none"}
            />
            <rect
              x="0.5"
              y={y + 0.5}
              width={W - 1}
              height={height - 1}
              className="fill-none stroke-rule"
            />
            <rect
              x="0"
              y={y}
              width={SPINE}
              height={height}
              className={layer.emphasis ? "fill-accent" : "fill-rule"}
            />

            <text
              x={SPINE + PAD}
              y={y + NAME_Y}
              className={`font-mono text-micro font-bold tracking-label ${
                layer.emphasis ? "fill-terminal-accent" : "fill-ink"
              }`}
            >
              {layer.name}
            </text>
            <text
              x={W - PAD}
              y={y + NAME_Y}
              textAnchor="end"
              className={`font-mono text-badge ${
                layer.emphasis ? "fill-terminal-fg/70" : "fill-prose"
              }`}
            >
              {layer.note}
            </text>

            {lines.map((line, i) => (
              <text
                key={line}
                x={SPINE + PAD}
                y={y + ITEMS_Y + i * LINE_H}
                className={`font-mono text-badge ${
                  layer.emphasis ? "fill-terminal-fg" : "fill-prose"
                }`}
              >
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>

      {/* Below sm. The same five bands, laid out by the browser rather than by
          arithmetic, so the text stays at its real size and Japanese wraps the
          way Japanese wraps. */}
      <ul aria-label={labels.title} className="border border-rule sm:hidden">
        {layers.map((layer) => (
          <li
            key={layer.name}
            className={`flex gap-3 border-b border-rule p-4 last:border-b-0 ${
              layer.emphasis ? "bg-terminal-bg" : ""
            }`}
          >
            <span
              aria-hidden="true"
              className={`w-1 shrink-0 ${layer.emphasis ? "bg-accent" : "bg-rule"}`}
            />
            <div className="flex min-w-0 flex-col gap-1">
              <h3
                className={`text-micro font-bold tracking-label ${
                  layer.emphasis ? "text-terminal-accent" : "text-ink"
                }`}
              >
                {layer.name}
              </h3>
              <p
                className={`text-badge ${
                  layer.emphasis ? "text-terminal-fg/70" : "text-prose"
                }`}
              >
                {layer.note}
              </p>
              <p
                className={`mt-1 text-badge leading-5 ${
                  layer.emphasis ? "text-terminal-fg" : "text-prose"
                }`}
              >
                {layer.items.join(SEP)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
