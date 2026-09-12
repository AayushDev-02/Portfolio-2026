import type { HeroAction, HeroFact } from "@/content";
import { BracketButton } from "./bracket-button";

type Props = {
  /** The wordmark, in the pixel display face. Still the LCP element. */
  title: string;
  /** The role line, directly under it. */
  status: string;
  /** One sentence on what he builds and for whom. */
  statement: string;
  /** Four scannable facts. See `HeroFact` for why four. */
  facts: HeroFact[];
  /** In-page anchors. Two. */
  actions: HeroAction[];
};

/**
 * The hero, rebuilt in stage 18.
 *
 * ## What was here before, and why it went
 *
 * A dark terminal panel — the only dark box on the site — typing out "What have
 * you actually shipped?" at a `>` prompt. It was the most striking element on
 * the page and it was working against it in three ways.
 *
 * It **asked the reader a rhetorical question** on a page whose whole purpose
 * is answering it, which reads as a challenge to the person doing the hiring.
 * It **spent the hero's one paragraph of attention saying nothing** — after
 * reading it you knew his name, his job title and his city, all of which were
 * already on screen. And the answer it teased was five sections further down,
 * so the fifteen-second skim the rest of this project is built around ended
 * with the question and never reached the answer.
 *
 * A recruiter's first pass is around seven seconds and decides whether there is
 * a second one. What replaces the panel is the four things that pass is looking
 * for, in the order it looks for them.
 *
 * ## The shape
 *
 * Wordmark, role, one sentence, a hairline strip of four facts, two calls to
 * action. Nothing is typed, nothing is revealed on a timer and nothing is
 * behind a click, because every one of those is a way of making a reader wait
 * for text that is already written.
 *
 * The facts sit between two hairlines, four across above `sm` and two below.
 * Nothing in the block has a fill, so the moving gradient behind it shows
 * through — see the comment on the strip itself for why that rules out the
 * `gap-px` device the RESULTS band uses.
 *
 * ## No dark panel
 *
 * `--color-terminal-*` still exists and is still used, by the pipeline diagram
 * and by the emphasised band of the stack diagram. What changed is that the
 * darkest element on the page is now a thing that carries information, rather
 * than a box in the hero whose darkness *was* the information.
 *
 * A Server Component, and now there is no client leaf here at all — the
 * typewriter that used to be one is gone with the panel.
 */
export function HeroIntro({ title, status, statement, facts, actions }: Props) {
  return (
    <div className="relative flex w-full flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-display text-hero sm:text-hero-lg font-bold uppercase leading-none tracking-tight text-accent text-balance text-center">
          {title}
        </h1>
        <p className="text-micro tracking-label uppercase text-ink">{status}</p>
      </div>

      <p className="max-w-xl font-sans text-lede sm:text-lede-lg leading-7 text-ink text-balance text-center">
        {statement}
      </p>

      {/* The scan strip.

          Every cell is TRANSPARENT and the separators are real borders, which
          is the one place this differs from the RESULTS band and the timeline
          grid. Those use `gap-px` over a rule background, and that trick needs
          opaque cells — four opaque white boxes would print a white bar across
          a gradient that is only page-coloured at its centre. Borders cost one
          more class and let the ground show through.

          Vertical rules only from `sm`, where it is one row of four. Below
          that it wraps to a 2x2 and a left border would land inside the grid
          rather than between columns. */}
      <div className="w-full max-w-3xl">
        <div aria-hidden="true" className="h-px w-full bg-rule" />
        <dl className="grid grid-cols-2 gap-y-5 py-5 sm:grid-cols-4 sm:gap-y-0">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-1.5 px-4 text-center sm:border-l sm:border-rule sm:first:border-l-0"
            >
              <dt className="text-badge tracking-label uppercase text-prose">
                {fact.label}
              </dt>
              <dd className="text-label font-bold text-ink-deep">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div aria-hidden="true" className="h-px w-full bg-rule" />
      </div>

      {/* Stacked on a phone, side by side from `sm`. Not a taste call: at 390px
          the two labels fit on one line in Geist Mono and do not in the system
          fallback, so `flex-wrap` reflowed from two rows to one the moment the
          webfont arrived and took 52px out of the hero. A layout that cannot
          wrap cannot shift. Two full-width targets is also the better phone
          layout, which is why this is the fix rather than a reserved height. */}
      <div className="flex flex-col items-center gap-y-1 sm:flex-row sm:justify-center sm:gap-x-8">
        {actions.map((action, i) => (
          <BracketButton
            key={action.href}
            href={action.href}
            // `external` renders a plain <a>. The locale-aware Link would turn
            // "#projects" into "/en#projects" and navigate to reach an element
            // that is already on the page.
            external
            // The second action is the quieter one. A tone rather than an
            // override class: `cn` joins in source order but Tailwind emits
            // utilities in its own, so `text-prose` after `text-accent` is not
            // reliably the winner.
            variant={i === 0 ? "bare" : "bare-muted"}
          >
            {action.label}
          </BracketButton>
        ))}
      </div>
    </div>
  );
}
