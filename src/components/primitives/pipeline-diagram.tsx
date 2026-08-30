import type { PipelineDiagram as Labels } from "@/content";

/**
 * The retrieval pipeline, drawn.
 *
 * Stage 13 §B: the highest-value item on the brief was evidence, because this
 * is a portfolio for someone who builds retrieval systems and it contained not
 * one diagram. A drawing of how the system fits together says more about
 * engineering level than any adjective in the body copy.
 *
 * Inline SVG, hand-authored in the site's own hairline-and-mono idiom. No
 * charting library: stage 7's budget binds here, and a generic boxes-and-arrows
 * import would look like clip art next to the rest of the page.
 *
 * Everything is token-driven — `currentColor` and the CSS variables — so the
 * whole drawing follows the theme without this component knowing one exists.
 * Every label comes from `content/*.ts`, so the diagram translates; a diagram
 * that stays English on the Japanese page reads as an oversight rather than a
 * choice.
 *
 * Accessibility: `<title>` and `<desc>` are what a screen reader reads *instead
 * of* the drawing, so they carry the actual argument, not a caption.
 */
export function PipelineDiagram({ labels }: { labels: Labels }) {
  // Fixed ids rather than useId: this is a Server Component — no hooks — and
  // exactly one project is featured, so the diagram renders once per page.
  // Rendering two would collide; that is a compile-time-visible constraint,
  // not a lurking bug, since `featured` marks a single entry.
  const titleId = "pipeline-title";
  const descId = "pipeline-desc";
  const arrow = "pipeline-arrow";
  const arrowAccent = "pipeline-arrow-accent";

  const box = "fill-none stroke-rule";
  const boxAccent = "fill-none stroke-accent/50";
  const line = "stroke-rule";
  const lineAccent = "stroke-accent";

  return (
    <svg
      viewBox="0 0 660 262"
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      className="block h-auto w-full"
    >
      <title id={titleId}>{labels.title}</title>
      <desc id={descId}>{labels.desc}</desc>

      <defs>
        <marker
          id={arrow}
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" className="fill-rule" />
        </marker>
        <marker
          id={arrowAccent}
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" className="fill-accent" />
        </marker>
      </defs>

      {/* ---- ingest: what happens once, offline ---- */}
      <text x="0" y="12" className="fill-prose font-mono text-badge tracking-label">
        {labels.ingestRow}
      </text>

      <rect x="0" y="24" width="120" height="42" className={box} />
      <text x="60" y="43" textAnchor="middle" className="fill-ink font-mono text-micro">
        {labels.documents}
      </text>
      <text x="60" y="56" textAnchor="middle" className="fill-prose font-mono text-badge">
        {labels.documentsSub}
      </text>

      <line
        x1="120"
        y1="45"
        x2="163"
        y2="45"
        className={line}
        markerEnd={`url(#${arrow})`}
      />

      <rect x="168" y="24" width="104" height="42" className={box} />
      <text x="220" y="43" textAnchor="middle" className="fill-ink font-mono text-micro">
        {labels.chunker}
      </text>
      <text
        x="220"
        y="56"
        textAnchor="middle"
        className="fill-prose font-mono text-badge"
      >
        {labels.chunkerSub}
      </text>

      <line
        x1="272"
        y1="45"
        x2="315"
        y2="45"
        className={line}
        markerEnd={`url(#${arrow})`}
      />

      <rect x="320" y="24" width="104" height="42" className={box} />
      <text x="372" y="43" textAnchor="middle" className="fill-ink font-mono text-micro">
        {labels.embeddings}
      </text>
      <text
        x="372"
        y="56"
        textAnchor="middle"
        className="fill-prose font-mono text-badge"
      >
        {labels.embeddingsSub}
      </text>

      <line
        x1="424"
        y1="45"
        x2="467"
        y2="45"
        className={line}
        markerEnd={`url(#${arrow})`}
      />

      <rect x="472" y="24" width="118" height="42" className={box} />
      <text x="531" y="43" textAnchor="middle" className="fill-ink font-mono text-micro">
        {labels.index}
      </text>
      <text
        x="531"
        y="56"
        textAnchor="middle"
        className="fill-prose font-mono text-badge"
      >
        {labels.indexSub}
      </text>

      {/* the index is the only thing the two halves share */}
      <path
        d="M531 66 L531 150"
        fill="none"
        className={line}
        markerEnd={`url(#${arrow})`}
      />

      <line x1="0" y1="104" x2="660" y2="104" className={line} strokeDasharray="3 4" />

      {/* ---- query: what happens per question, live ---- */}
      <text x="0" y="130" className="fill-accent font-mono text-badge tracking-label">
        {labels.queryRow}
      </text>
      <text x="660" y="12" textAnchor="end" className="fill-prose font-mono text-badge">
        {labels.scale}
      </text>

      <rect x="0" y="142" width="120" height="42" className={boxAccent} />
      <text
        x="60"
        y="167"
        textAnchor="middle"
        className="fill-accent font-mono text-micro"
      >
        {labels.question}
      </text>

      <line
        x1="120"
        y1="163"
        x2="163"
        y2="163"
        className={lineAccent}
        markerEnd={`url(#${arrowAccent})`}
      />

      <rect x="168" y="142" width="104" height="42" className={boxAccent} />
      <text
        x="220"
        y="167"
        textAnchor="middle"
        className="fill-accent font-mono text-badge"
      >
        {labels.embedQuery}
      </text>

      <line
        x1="272"
        y1="163"
        x2="424"
        y2="163"
        className={lineAccent}
        markerEnd={`url(#${arrowAccent})`}
      />

      <rect x="429" y="142" width="204" height="42" className={boxAccent} />
      <text
        x="531"
        y="161"
        textAnchor="middle"
        className="fill-accent font-mono text-badge"
      >
        {labels.retriever}
      </text>
      <text
        x="531"
        y="175"
        textAnchor="middle"
        className="fill-prose font-mono text-badge"
      >
        {labels.retrieverSub}
      </text>

      <path
        d="M531 184 L531 212"
        fill="none"
        className={lineAccent}
        markerEnd={`url(#${arrowAccent})`}
      />

      {/* the model sits on the terminal panel's ground — the one dark element,
          used here to mark where the answer is actually produced */}
      <rect x="429" y="214" width="204" height="40" className="fill-terminal-bg" />
      <text
        x="531"
        y="232"
        textAnchor="middle"
        className="fill-terminal-fg font-mono text-micro"
      >
        {labels.answer}
      </text>
      <text
        x="531"
        y="246"
        textAnchor="middle"
        className="fill-terminal-fg/60 font-mono text-badge"
      >
        {labels.answerSub}
      </text>

      <path
        d="M429 234 L128 234"
        fill="none"
        className={line}
        markerEnd={`url(#${arrow})`}
      />
      <text x="126" y="231" textAnchor="end" className="fill-prose font-mono text-badge">
        {labels.returnLabel}
      </text>
    </svg>
  );
}
