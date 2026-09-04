# Stage 17 — Hero, Skills, Experience

Run **after** `docs/STAGE16-INTERACTION.md`. Paste everything below the line
into Claude as a single instruction.

---

You are working in the Portfolio 2026 repo (Next.js 15 App Router, React 19,
TypeScript strict, Tailwind v4, next-intl EN/JA, GSAP installed, Biome, pnpm).
Read `CLAUDE.md`, `docs/PROGRESS.md`, `docs/DECISIONS.md` and
`docs/STAGE14-3D-MOTION.md` before you start, and obey every rule in
`CLAUDE.md` — in particular:

- No component owns a colour, font size or spacing value. Every token lives in
  the `@theme` block of `src/app/globals.css`. There is no `tailwind.config.js`.
- `src/components/sections/*` may only read `src/content/*` and render
  `src/components/primitives/*`.
- Every animation must be disabled under `prefers-reduced-motion`.
- Push interactivity to the smallest possible leaf. Every `"use client"` is a
  byte on the critical path.
- Japanese: no negative letter-spacing, no per-character effects on CJK, and a
  key present in `en.ts` but missing from `ja.ts` must stay a compile error.
- No new dependency without a line in `docs/DECISIONS.md` saying why.
- Budgets: app code < 15KB gz, first-load total < 120KB, LCP < 1.5s mobile,
  CLS < 0.05. Run `pnpm budget` and `pnpm perf` before claiming you are done.

Three tasks, in order. `pnpm check` after each. One commit per task
(`stage17: hero embedding field`).

## Task A — hero background: embedding field

Replace the hero photograph with an animated field of points that responds to
the cursor as if it were a search query. This is the site's signature
interaction and its subject matter at the same time: the person whose portfolio
this is builds retrieval systems, and the hero should show retrieval rather
than describe it.

New client leaf `src/components/primitives/hero-field.tsx`. Use it in place of
`<HeroBackdrop />` in `src/components/sections/intro.tsx`.

**Plain 2D canvas. No Three.js, no react-three-fiber, no OGL.** r3f is roughly
90KB gzipped and would blow the 120KB first-load gate on its own, and a field of
points with lines needs no scene graph. If you believe a library is required,
stop and say so rather than adding one.

Behaviour:

- Several hundred points drifting slowly and continuously, at low opacity —
  scale the count to viewport area, cap it at about 900, and drop to roughly a
  third of that below `sm`.
- The pointer is the query. Each frame, find the nearest handful of points
  (about eight), brighten and enlarge them, and draw a thin line from each to
  the pointer, fading with distance. Everything else keeps drifting untouched.
  That contrast — a lit neighbourhood in a dark field — is the whole idea; if
  every point reacts, it reads as a screensaver.
- Points wrap at the edges rather than bouncing. No visible boundary.
- With no pointer (touch, or before first move) the field simply drifts.

Implementation constraints:

- Colours are read from the CSS custom properties with `getComputedStyle` at
  mount, and re-read when the theme changes — watch `data-theme` on
  `documentElement` with a `MutationObserver`. **No hex value in this file.**
  It must follow both themes without knowing they exist, exactly as
  `--hero-image-filter` let `HeroBackdrop` stay theme-blind.
- Size the canvas by `devicePixelRatio`, and re-size on a `ResizeObserver`, not
  a `resize` listener.
- Mount after the `load` event, never before.
- Five kill switches, each of which renders nothing: `prefers-reduced-motion`,
  `navigator.connection.saveData`, `navigator.hardwareConcurrency <= 4`, no 2D
  context available, and the canvas failing to size.
- Stop the loop when the hero scrolls out of view (`IntersectionObserver`) and
  on `document.visibilitychange`. A background tab must not run this.
- `aria-hidden`, `position: absolute; inset: 0`, behind the hero content, no
  pointer events.
- Budget for this file: under 3KB gzipped.

Two consequences to handle rather than discover:

1. **The LCP element changes.** The hero photograph was it; now it is the
   wordmark. Re-run `pnpm perf` and report the new LCP. It should improve.
2. **The portrait needs a home.** Do not delete `hero-backdrop.tsx`,
   `lib/images.ts` or the files in `public/images/`. Move the portrait into the
   ABOUT section as a framed image beside the copy — one column of image, one of
   text, with the existing hairline treatment — and give it real alt text in
   both locales. It is a portrait of a named person, so the alt text is not
   empty here the way it was when the photo was decoration.

## Task B — skills as a stack diagram

SKILLS is currently the tallest section on the page (about 1676px) and is nine
bulleted lists. Replace it with a drawn diagram of the layers actually built in,
with each technology sitting in its layer.

Content layer first. Replace `SkillGroup` in `src/content/types.ts` with:

```ts
/** One horizontal band of the stack diagram. SKILLS. */
export type SkillLayer = {
  /** Layer name, e.g. "AI & Retrieval". */
  name: string;
  /** One short line saying what this layer does. */
  note: string;
  items: string[];
};
```

Five layers, in this order: Frontend, API & Services, AI & Retrieval, Data,
Cloud & Delivery. Redistribute the existing entries in `en.ts` and `ja.ts` into
them — nothing is invented and nothing is dropped, but items may be merged where
the current lists repeat themselves. Certifications are not a layer: keep them
as a small block beneath the diagram.

Then `src/components/primitives/stack-diagram.tsx` — a **server component**
rendering hand-authored inline SVG, following `pipeline-diagram.tsx` exactly:

- Every string it draws comes from the content layer, so the diagram translates
  with the page. A diagram that stays English on the Japanese page is worse than
  no diagram.
- `<title>` and `<desc>` are the accessible name and description, not
  decoration: they are what a screen reader gets instead of the drawing.
- Colours are token classes on the SVG elements. No `fill="#..."`.
- Bands are visibly a stack: the AI & Retrieval band is emphasised, because it
  is what the whole page argues for.

Responsive: below `sm`, do not scale the drawing down — restack the layers as
labelled bands so the text stays readable. If anything is still too wide, it
scrolls inside its own `overflow-x: auto` container; the page body must never
scroll horizontally.

Target: the section comes in under about 1000px tall. Report the before and
after heights the way `docs/PROGRESS.md` records the others.

## Task C — experience as a timeline rail

Replace the five stacked checklist cards with a horizontal rail: one line across
the section, roles placed along it by date, the current role marked.

Content layer first. Extend `TimelineEntry` in `src/content/types.ts`:

```ts
/** ISO year-month, e.g. "2025-06". Positions the marker on the rail. */
start: string;
/** Same, or null for the current role. */
end: string | null;
```

Keep `period` — it is the display string and must stay translatable. Positions
are computed from `start` and `end`, never hand-placed, so adding a role next
year moves everything correctly on its own.

`src/components/primitives/timeline-rail.tsx`:

- A single rule across the section with a marker per role at its date position,
  the current role in the accent colour. The one-year language-study entry is a
  span on the rail, not a gap.
- Each marker is a real `<button>` that shows that role's detail in a panel
  beneath the rail. Full keyboard support: left/right arrows move between
  markers, `aria-controls` and `aria-selected` wired properly, visible
  `:focus-visible`. Verify by tabbing through with the mouse untouched.
- The panel defaults to the **current** role, and every role's title and dates
  stay readable on the rail itself. Content behind a disclosure is content a
  fifteen-second skim never sees — that is why the accordion was removed from
  PROJECTS, and the same rule applies here.
- Below `sm` the rail becomes a vertical spine with **all five entries
  expanded**. Nothing is hidden on mobile.
- Under `prefers-reduced-motion`, panel changes are instant, and the current
  marker does not pulse.

## Definition of done

- `pnpm check` clean.
- `pnpm budget` passes: app code under 15KB gz, first-load total under 120KB.
  Report before and after. More than 5KB of movement means something became a
  client component that should not have.
- `pnpm perf`: LCP under 1.5s, CLS under 0.05. Report the new LCP element.
- Verified at 360, 768 and 1440, in both themes, in both locales, with no
  horizontal overflow anywhere.
- With `prefers-reduced-motion` forced on, and separately with JavaScript
  disabled, the page is complete and readable and nothing is hidden.
- On a touch device the hero canvas never mounts.
- axe reports zero violations across both locales and both themes.
- `docs/PROGRESS.md` gains a Stage 17 block with the new section-height table,
  and `docs/DECISIONS.md` records: the hero photograph moving to ABOUT, the
  choice of plain canvas over Three.js with the measured reason, and
  `SkillGroup` being replaced by `SkillLayer`.
