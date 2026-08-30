# Portfolio 2026 — project context

Bilingual (EN / JA) personal portfolio for Aayush Yadav. The design is a
deliberate one-to-one clone of `https://www.project-uncensored.site/`;
the content, i18n and contact system are original.

This site supports a Japan job search — it is a hiring artifact. Assume a
recruiter opens it once, on a phone, on mobile data.

## Read these before doing anything

| File | What it is |
|---|---|
| `docs/PROGRESS.md` | **Start here.** Current stage, next action, checklist state |
| `docs/PLAN.md` | The eleven-stage plan, stack and rationale |
| `docs/DESIGN-SPEC.md` | Reference teardown — tokens, layout, component inventory |
| `docs/DECISIONS.md` | Append-only log of why things are the way they are |
| `SETUP.md` | Remaining manual stage-0 steps (install, GitHub, Vercel) |

## Current state

Stages 0–1 are written but **have never been installed or run** — they were
authored in an environment with no npm access. First `pnpm install && pnpm dev`
is the real gate. Expect to fix version drift.

## Stack

Next.js 15 (App Router, RSC) · TypeScript strict · Tailwind CSS v4 · Biome ·
pnpm. Later: next-intl (stage 4), Resend + Supabase + Upstash (stage 6),
react-three-fiber (stage 10).

## Commands

```bash
pnpm dev        # dev server
pnpm check      # typecheck + lint — run before every commit
pnpm lint:fix   # biome autofix
pnpm build      # production build
```

## Rules for working in this repo

1. **No component owns a colour, font size, or spacing value.** All tokens live
   in the `@theme` block of `src/app/globals.css`. There is no
   `tailwind.config.js` — in Tailwind v4 the CSS file *is* the config.
2. `src/components/sections/*` may only read from `src/content/*` and render
   `src/components/primitives/*`. This is what makes stage 5's content swap
   safe.
3. **`min-h-dvh`, never `min-h-screen`/`100vh`.** iOS Safari's toolbar makes vh
   taller than the viewport and clips every section footer.
4. **No scroll-jacking.** The reference uses natural document scroll. Custom
   scroll breaks mobile momentum and keyboard nav.
5. Every animation must be disabled under `prefers-reduced-motion` — there is a
   global block at the bottom of `globals.css`, plus per-component handling in
   `TerminalHero`.
6. Japanese: no negative letter-spacing, line-height 1.85, `word-break: normal`.
   Handled by the `:lang(ja)` rule. The pixel display face has **no CJK glyphs**
   — headings fall back to `--font-jp`.
7. Push interactivity to the smallest possible leaf component. Every
   `"use client"` is a byte on the critical path. Currently only
   `AccordionRow` and `TerminalHero` are client components — keep it that way.
8. Do not add a dependency without a line in `docs/DECISIONS.md` saying why.

## Performance budgets (enforced from stage 7)

LCP < 1.5s mobile · CLS < 0.05 · INP < 200ms · Lighthouse perf >= 95 mobile ·
**app code < 15KB gz** (total first-load < 120KB; ~104KB of it is the React 19 /
Next 15 floor, so the app-code figure is the one that binds — see PLAN.md §7).

## Session rhythm

Read `docs/PROGRESS.md` → do the single next unchecked item → commit with the
stage in the message (`stage2: timeline cards`) → tick it in `PROGRESS.md` →
add to `DECISIONS.md` if a choice changed → push.

**Never end a session without updating `docs/PROGRESS.md`.** That file is the
project's memory across sessions and across tools.
