# Stage 16 — Interaction pass

Paste everything below the line into Claude as a single instruction. It assumes
the repo is open and `docs/PROGRESS.md`, `docs/PLAN.md` and `CLAUDE.md` have
been read first.

---

You are working in the Portfolio 2026 repo (Next.js 15 App Router, React 19,
TypeScript strict, Tailwind v4, next-intl EN/JA, GSAP already installed, Biome,
pnpm). Read `CLAUDE.md`, `docs/PROGRESS.md` and `docs/DECISIONS.md` before you
start, and obey every rule in `CLAUDE.md` — in particular:

- No component owns a colour, font size or spacing value. Every token lives in
  the `@theme` block of `src/app/globals.css`. There is no `tailwind.config.js`.
- `src/components/sections/*` may only read `src/content/*` and render
  `src/components/primitives/*`.
- `min-h-dvh`, never `min-h-screen` or `100vh`.
- Every animation must be disabled under `prefers-reduced-motion`.
- Push interactivity to the smallest possible leaf component. Every
  `"use client"` is a byte on the critical path.
- Japanese: no negative letter-spacing, no per-character effects on CJK.
- No new dependency without a line in `docs/DECISIONS.md` explaining why.
- Budgets: app code < 15KB gz, first-load total < 120KB, LCP < 1.5s mobile,
  CLS < 0.05. Run `pnpm budget` before you claim you are done.

Do the four tasks below in order. Run `pnpm check` after each one. Commit each
task separately with the stage in the message (`stage16: morphing cursor`).

## Task 0 — remove the previous attempt

Delete `src/components/primitives/cursor-crosshair.tsx` and
`src/components/primitives/cursor-reticle.tsx`. Remove the `CursorReticle`
export from `src/components/primitives/index.ts` and its use in
`src/app/[locale]/layout.tsx`.

In `src/app/globals.css`, delete the entire `CURSOR-REACTIVE HOVER` block and
the `--hover-reach`, `--hover-strength` and `--hover-fade` tokens. Remove the
`data-hover` attributes from `skill-card.tsx`, `timeline-card.tsx` and the
project cards in `sections/projects.tsx`. The radial hover wash is being
replaced, not kept alongside.

## Task 1 — morphing pill cursor

New client leaf `src/components/primitives/cursor-pill.tsx`, mounted once in
`src/app/[locale]/layout.tsx` where `CursorReticle` was.

Behaviour:

- Resting state is a small filled dot, roughly 8px, in the accent colour.
- When the pointer is over an element carrying `data-cursor-label`, the dot
  grows into a pill sized to that label's text and shows it — accent
  background, page-background text.
- Leaving the element shrinks it back to the dot. The label fades, the shape
  eases; both should feel like one motion, not two.
- The pill trails the pointer with easing (lerp around 0.2), never rigidly.

Implementation constraints:

- One `position: fixed` element, `pointer-events: none`, below the header
  controls (`z-10` against their `z-20`), `aria-hidden="true"`.
- Position with `transform: translate3d()` only. Never `top`/`left`.
- `width: auto` cannot be transitioned, so measure the label with a hidden
  `max-content` span and set an explicit pixel width; transition `width` and
  `height` with a 220ms ease. Add `contain: layout size style` so that
  measurement never touches document layout.
- One `requestAnimationFrame` loop for the whole page, and it must park itself
  when the pill has caught up rather than spinning behind a still pointer.
  Record pointer position in the event handler; interpolate and write in the
  frame.
- Delegate hover detection with a single `pointermove` listener and
  `event.target.closest("[data-cursor-label]")`. Do not attach listeners per
  element and do not make any card a client component.
- Three gates, all of which must pass before anything renders: `pointer: fine`,
  not `prefers-reduced-motion`, and the pointer has actually moved. Watch both
  media queries with `addEventListener("change")` rather than sampling once — a
  hybrid laptop can gain or lose a fine pointer mid-session.
- Hide on `mouseleave` of the document so it does not hang at the edge.

Labels to add, as `data-cursor-label` attributes:

- Each project row: its zero-padded index (`002`, `003`, …).
- `LocaleSwitcher`: `EN/JA`. `ThemeToggle`: `LT/DK`.
- The contact submit button: the existing submit copy.
- Any external link: `↗`.

Prefer numeric and symbolic labels so the pill needs no translation. If a label
must be a word, it goes through the next-intl catalogue or `src/content/*.ts`
like every other string — never hard-coded in a component.

## Task 2 — project rows with a cursor-following image

This is the main change, and it replaces the current PROJECTS card grid.

### Content layer

Extend `ProjectEntry` in `src/content/types.ts`:

```ts
/** Cover art for the hover preview. Absent entries simply render no media. */
image?: {
  /** Path under /images/projects, without extension — AVIF and WebP siblings. */
  src: string;
  width: number;
  height: number;
  /** Real alt text, per locale. Never empty: this image carries meaning. */
  alt: string;
};
```

Add the field to both `src/content/en.ts` and `src/content/ja.ts`. A key present
in one and missing in the other must stay a compile error — that guarantee is
the whole point of the content layer.

`src` is a complete path under `/images/projects/`. Target 320×200 displayed.

**Build the placeholders first, so the effect works before the real art
exists.** Write `scripts/make-project-placeholders.mjs` — plain Node, no new
dependency — that emits one SVG per project into `public/images/projects/`:
a dark panel at 640×400 carrying the project's index in the display face, its
title, and its tag row, using the same hex values as the dark theme tokens.
These are throwaway art, so hard-coded colours are fine *in the generated
files only* — the script itself must read titles and tags from
`src/content/en.ts` rather than repeating them.

Point every `image.src` at its `.svg`. When real screenshots replace them,
they become `.avif` with a `.webp` sibling served through `<picture>` — follow
the pattern and the reasoning in `src/components/primitives/hero-backdrop.tsx`
and `src/lib/images.ts` — and each file stays under 60KB.

If a project has no `image`, everything below still works; that row just shows
no preview. Do not block the layout on art that does not exist yet.

### Layout

Rewrite the non-featured half of `sections/projects.tsx`. Replace the
asymmetric card grid with a full-width list of rows separated by hairlines:

```
002   AI presentation generator     MLIT / 国総研        Azure · Functions · VNet
003   MapAI                         Otaru · Kashiwa      MapLibre · PostGIS · QGIS
```

Index left in the display face, title next, organisation muted, tags right
aligned. Rows are tall — around 96px — and the whole row is the hover target.
The featured project keeps its current treatment with the pipeline diagram.

Below `sm`, the row collapses to two lines (index + title, then org and tags)
and the tags may be truncated. Do not let anything overflow at 360px.

### The preview

New client leaf `src/components/primitives/project-hover-media.tsx`, mounted
once inside the projects section — not once per row.

- It renders every project image stacked in one `position: fixed` layer, all at
  `opacity: 0`, and raises only the hovered one. Swapping opacity on
  already-decoded images is instant; fetching on hover is not.
- Position with `translate3d()` and easing, so the image trails the pointer.
- Add rotation proportional to pointer velocity, clamped to about ±6°, easing
  back to 0 when the pointer stops. That lag and tilt is the whole effect —
  without it this is just a tooltip.
- Enter at about `scale(0.96)` and settle to 1.
- One delegated `pointermove` listener and one rAF loop, matching Task 1. If it
  is cheaper to run both from a single shared loop, do that.

Gates and fallbacks:

- Mount the layer only when `pointer: fine` matches. On touch the images must
  never be fetched at all — a recruiter on mobile data must not pay for six
  previews they cannot trigger.
- Under `prefers-reduced-motion`, render no following layer. Instead show each
  row's image inline as a small static thumbnail.
- The layer is `aria-hidden`; each row already carries its own accessible name.
  Screen readers and keyboard users must lose nothing — verify by tabbing
  through the section with the mouse untouched.
- Reserve nothing in the document flow: the layer is fixed, so CLS must stay
  at zero. Confirm with `pnpm perf`.

## Task 3 — smooth scroll behind a flag

Add Lenis, but do not turn it on:

- `pnpm add lenis`.
- New client leaf `src/components/primitives/smooth-scroll.tsx`, dynamically
  imported after first paint, mounted in the layout.
- Active only when `process.env.NEXT_PUBLIC_SMOOTH_SCROLL === "1"`, and never
  under `prefers-reduced-motion`. Destroy the instance on unmount.
- Drive `lenis.raf` from the GSAP ticker and call `ScrollTrigger.update` on
  Lenis scroll, or the section counter and count-up will drift out of step with
  the page.
- Verify with it on: the skip link still works, in-page anchors still land,
  `:focus-visible` scrolling still reaches the focused element, and the browser
  back button restores scroll position.
- Add `NEXT_PUBLIC_SMOOTH_SCROLL` to `.env.example` with a comment saying it is
  off by default.

This is a conditional reversal of `CLAUDE.md` rule 4 (no scroll-jacking). Log it
in `docs/DECISIONS.md` as exactly that: what the rule said, why it is being
softened, and the fact that it ships disabled pending a decision on a real
trackpad and a real phone.

## Definition of done

- `pnpm check` clean.
- `pnpm budget` passes: app code under 15KB gz, first-load total under 120KB.
  Report the before and after figures. More than 5KB of movement means
  something became a client component that should not have.
- `pnpm perf`: LCP under 1.5s, CLS under 0.05.
- Verified at 360, 768 and 1440, in both themes, in both locales. No horizontal
  overflow anywhere.
- With `prefers-reduced-motion` forced on, and separately with JavaScript
  disabled, the page is complete and readable and nothing is hidden.
- On a touch device: no cursor, no following image, no project image fetched.
- axe reports zero violations.
- `docs/PROGRESS.md` updated with a Stage 16 block, and `docs/DECISIONS.md`
  updated for the Lenis reversal and for dropping the radial hover wash.
