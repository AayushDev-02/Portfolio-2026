# STAGE 12 — MOTION PASS

## The decision to make first: probably don't install Motion

Stage 13 left the app at **11.7KB of app code, entirely server-rendered**, with
LCP at 1.23s and Lighthouse Performance at 98 in both locales. That is a lot of
headroom — and it is worth protecting rather than spending.

Every effect in §2 below can be built with `IntersectionObserver`, CSS
transitions and roughly 60 lines of vanilla JS spread across small client
leaves. None of them needs an animation library. Installing `motion` costs
~30KB gzipped and converts the components that use it into client components,
which is the opposite direction from where the last three stages went.

**Recommendation: build §2 without any library.** Revisit `motion` only if a
later effect genuinely needs orchestration — shared layout transitions, spring
physics, gesture handling — that CSS cannot express. Nothing in this stage does.

If you disagree, that is a legitimate call, but log it in `DECISIONS.md` with
the measured before/after bundle numbers rather than deciding on preference.

---

## 1. Ground rules

- **Server Components stay server components.** Each effect lives in the
  smallest possible client leaf. A scramble effect on a heading means a
  `<ScrambleText>` leaf, not `"use client"` at the top of a section.
- **`prefers-reduced-motion` is not an afterthought.** Every effect checks it
  and renders its finished state immediately. The global CSS block in
  `globals.css` already handles transitions; JS-driven effects need their own
  check.
- **Animate `transform` and `opacity` only.** Never `width`, `height`, `top`
  or `left` — they force layout on every frame.
- **Nothing animates above the fold on first paint.** LCP is 1.23s; keep it.
- Both themes, both locales. Japanese runs taller and wraps differently — a
  per-character effect must not break `ja` text.

---

## 2. The effects, in build order

### A. Text scramble on headings — do this first
Characters cycle through random glyphs and resolve into the real word as the
heading enters the viewport.

- Trigger on `IntersectionObserver`, once per element, then disconnect.
- ~20 lines. No dependency.
- **Highest impact per byte on this list.** On a site built from monospace and
  a pixel display face, this reads as native to the design rather than applied
  to it.
- **Japanese caveat:** scramble Latin headings only. Cycling random kana or
  kanji looks like a rendering fault, not an effect. On `ja`, fade the heading
  in instead — check `locale` and branch.
- Respect reduced-motion by rendering the final string immediately.

### B. Number count-up
The four figures from Stage 13's RESULTS band — 1,400 hours, 40%, two months,
days to under an hour — count up when the band scrolls in.

- `requestAnimationFrame`, ease-out, ~800ms. Once, then stop.
- `font-variant-numeric: tabular-nums` so the width does not jitter mid-count.
- Reserve the final width in CSS before animating, or the band reflows.
- These numbers are the argument the page makes. Motion is what makes a skimmer
  stop on them.

### C. Hairline draw-in
Section borders and grid rules animate from zero to full width on entry.

- `transform: scaleX(0) → scaleX(1)` with `transform-origin: left`.
  **Never animate `width`.**
- Stagger by ~40ms where several rules share a section.
- Reinforces the hairline idiom that already carries the whole design.

### D. Cursor crosshair
A faint full-width and full-height hairline pair tracking the cursor, like a
terminal cursor or a CAD reticle.

- ~15 lines. `pointer: fine` media query only — never on touch.
- `transform: translate3d()` on a fixed-position element, updated in
  `requestAnimationFrame`, not on every `mousemove`.
- `aria-hidden`, `pointer-events: none`.
- Skip entirely under reduced-motion.

### E. Scroll-linked section counter
The `01 / 06` in the corner updates as sections pass.

- One `IntersectionObserver` over all sections, `rootMargin: "-50% 0px"` so it
  switches at the midpoint.
- Small change, but it turns the counter from decoration into information.

### F. Boot sequence on first load — think hard before building this
Terminal-style init lines before the hero resolves.

It fits the concept perfectly and it is the single most likely item here to
annoy a returning visitor. If you build it: first visit only, flagged in
`sessionStorage`, skippable on any keypress or click, and it must never delay
LCP — the hero renders behind it, not after it.

Honest read: **skip this one.** A recruiter opening the site from a phone
between meetings does not want a loading ceremony. Build A through E, see
whether the page still feels like it needs more.

---

## 3. Verification

- `pnpm check` and `pnpm build` clean.
- First-load JS reported per locale, before and after. If it moved more than
  ~5KB, something became a client component that should not have.
- Lighthouse Performance still ≥ 95 in both locales; LCP still under 1.5s.
- Every effect verified under emulated reduced-motion — the page must be
  complete and readable with all of them disabled.
- `ja` checked at 360 and 768: no per-character effect applied to CJK text.

**DoD:** all five effects live; first-load JS essentially unchanged; Stage 7
budgets pass; the page is complete with motion disabled.
