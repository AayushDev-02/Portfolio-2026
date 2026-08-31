# AGENTS.md — Portfolio 2026

Instructions for any coding agent working in this repository. Codex reads this
file automatically. Claude Code reads `CLAUDE.md`, which carries the same rules —
**if you change a rule here, change it there too, or the two agents will drift.**

## What this is

Bilingual (EN / JA) personal portfolio for Aayush Yadav. Live at
`aayush-yadav-portfolio-nine.vercel.app`. It exists to support a job search in
Japan, so assume a recruiter opens it once, on a phone, on mobile data.

The design began as a deliberate clone of `project-uncensored.site` and has
diverged since. A second reference, `raviklaassens.com`, is a **capability
benchmark for motion craft only** — its techniques are fair to take, its layout
and identity are not.

## Read before doing anything

| File | What it is |
|---|---|
| `docs/PROGRESS.md` | **Start here.** Current stage, next action, checklist state |
| `docs/PLAN.md` | All stages, stack, rationale |
| `docs/DECISIONS.md` | Append-only. Why things are the way they are |
| `docs/DESIGN-SPEC.md` | Reference A teardown — tokens, layout, components |
| `docs/REFERENCE-B-TEARDOWN.md` | Reference B — what transfers and what does not |
| `docs/STAGE*.md` | Per-stage briefs |

## Stack

Next.js 15 App Router (RSC) · TypeScript strict · Tailwind CSS v4 · Biome ·
next-intl · Resend + Supabase + Upstash · Vercel · pnpm.
From Stage 12: GSAP + ScrollTrigger + SplitText.

## Commands

```bash
pnpm dev          # dev server
pnpm check        # typecheck + lint — run before every commit
pnpm lint:fix     # biome autofix
pnpm build        # production build
```

Never run `pnpm build` while `pnpm dev` is running — both write `.next/` and the
dev server's manifest corrupts. Stop dev first.

## Invariants — do not violate these

1. **No component owns a colour, font size, or spacing value.** Every token
   lives in the `@theme` block of `src/app/globals.css`. There is no
   `tailwind.config.js`; in Tailwind v4 the CSS file *is* the config.
2. **Tokens are semantic, never literal.** `--color-ink`, not `--color-black`.
   Dark mode is a token-override block with zero component edits. If you need to
   edit a component to support a theme, its colour was hard-coded — that is the
   bug.
3. `src/components/sections/*` may only read from `src/content/*` and render
   `src/components/primitives/*`.
4. **`min-h-dvh`, never `min-h-screen` or `100vh`.** iOS Safari's toolbar makes
   vh taller than the viewport and clips every section footer.
5. **Every animation disables under `prefers-reduced-motion`** and renders its
   finished state. There is a global CSS block; JS-driven effects need their own
   check.
6. **Push interactivity to the smallest possible leaf.** App code is ~11.7KB and
   almost everything is server-rendered. Keep it that way — a `"use client"` at
   the top of a section is a defect.
7. **Japanese:** no negative letter-spacing, line-height 1.85, `word-break:
   normal`. The pixel display face has no CJK glyphs. Never apply a
   per-character effect to CJK text — it looks like a rendering fault.
8. **Content is typed and bilingual.** A missing JA key must be a compile error.
9. **Never publish `docs/source/`.** It holds a 履歴書 with a home address,
   phone number and date of birth. It is gitignored. Nothing from it reaches
   `public/`.
10. **No new dependency without a line in `docs/DECISIONS.md`** saying why.

## Performance budgets — enforced in CI

LCP < 1.5s mobile · CLS < 0.05 · INP < 200ms · first-load JS < 90KB gz ·
Lighthouse ≥ 95 on all four categories, both locales.

Current: LCP 1.23s, app code 11.7KB, Performance 98. GSAP will spend roughly
40KB of the remaining headroom — that is budgeted, but nothing else is.

## Session rhythm — this matters more than usual

Two different agents work in this repo. `docs/PROGRESS.md` is the only shared
memory between them. If you skip it, the next agent starts blind.

1. Read `docs/PROGRESS.md`.
2. Do the single next unchecked item.
3. Commit with the stage in the message: `stage12: text scramble on headings`.
4. Tick it in `PROGRESS.md`. Add to `DECISIONS.md` if a choice changed.
5. Append a session-log row saying what happened, including what went wrong.

**Never end a session without updating `docs/PROGRESS.md`.**

## Do not mark a stage done

Several stages have acceptance criteria only a human can judge — visual
side-by-sides, reading the Japanese, testing on a real phone. Report what you
did and what remains. Leave the final tick to Aayush.
