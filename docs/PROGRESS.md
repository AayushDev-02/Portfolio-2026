# PROGRESS

**Read this first at the start of every session.**
Update it before the end of every session. This file is the project's memory.

- **Current stage:** Stage 0 — Foundation (installed + committed locally; GitHub + Vercel still needed)
- **Next action:** create the GitHub repo (github.com → New → `portfolio-2026`, public, no README/gitignore/license — this repo already has them), then run:
  `git remote add origin https://github.com/<you>/portfolio-2026.git && git push -u origin main`
  Then do SETUP.md step 3 (Vercel import + deploy) and paste the `.vercel.app` URL below.
- **Live URL:** —
- **Repo:** —
- **Last updated:** 2026-08-29

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` skipped (log why in DECISIONS.md)

---

## Stage 0 — Foundation
- [x] Node 20+ LTS, pnpm, git verified on laptop — Node v22.15.0, pnpm 9.12.0 (installed via `npm i -g pnpm`, corepack couldn't write to Program Files without admin), git 2.39.1
- [x] Next.js 15 app scaffolded (TS, Tailwind v4, App Router, src/)
- [x] Biome + strict tsconfig + path aliases
- [x] docs/ committed
- [x] `pnpm install && pnpm dev` runs clean locally — see session log 2026-08-29
- [ ] Public GitHub repo created and pushed  ← SETUP.md step 2, **needs your github.com login** (no `gh` CLI on this machine)
- [ ] Vercel connected, first preview deploy green  ← SETUP.md step 3, **needs your Vercel account**
**DoD:** bare page live on a .vercel.app URL — [ ]

## Stage 1 — Design system
- [x] `@theme` tokens (8 colours, spacing, type scale, font vars)
- [x] Geist Mono self-hosted via the `geist` package
- [x] Pixel display face — Silkscreen via next/font/google, self-hosted at build
- [x] JA fallback decided: system stack (`--font-jp`), zero bytes — see DECISIONS
- [x] Primitives: SectionShell, CornerMarks, Eyebrow, Counter, Sigil, MicroLabel
- [x] Primitives: BracketButton, StatusBadge, CheckItem, AccordionRow
- [x] Primitives: TimelineCard, RankBar, TerminalHero
- [x] CanvasSlot (the Three.js seam, built early on purpose)
- [x] `/dev/kitchen-sink` route (noindex)
- [ ] Visually verified in a browser  ← **you still need to eyeball this** — server confirmed both routes compile clean (200, no runtime errors) but a human hasn't looked yet
- [ ] Confirm a token change propagates with no component edits
**DoD:** all primitives render; token change propagates with no component edits — [ ]

## Stage 2 — Pixel-perfect clone ★ MAIN GOAL
- [ ] Section 00 INTRO — terminal hero, typewriter, caret
- [ ] Section 01 PHILOSOPHY — accordion + checklists
- [ ] Section 02 STATUS — 001–006 timeline cards
- [ ] Section 03 RESULTS — rank bars + CTA
- [ ] Section 04 FEEDBACK — accordion + pull quotes + numbered list
- [ ] Section 05 HISTORY — decision log
- [ ] Corner marks / eyebrows / counters / footer sigils on all 6
- [ ] Side-by-side comparison at 1440 / 768 / 390
**DoD:** visually indistinguishable from reference at all three widths — [ ]

## Stage 3 — Responsive & interaction polish
- [ ] Breakpoint audit 360→1920
- [ ] Touch targets ≥ 44px
- [ ] Keyboard nav + focus rings + skip link
- [ ] `prefers-reduced-motion` honoured
- [ ] Tested on real phone
**DoD:** no horizontal scroll anywhere; keyboard-operable end to end — [ ]

## Stage 4 — Internationalisation
- [ ] next-intl installed, `[locale]` routing
- [ ] `/` locale detection + cookie override
- [ ] `[ EN / JA ]` switcher
- [ ] JA typography rules applied
- [ ] Every section re-checked for JA overflow
- [ ] hreflang + per-locale metadata
**DoD:** both locales render cleanly, no clipped text — [ ]

## Stage 5 — Content remap
- [ ] Section mapping applied (INTRO/ABOUT/EXPERIENCE/SKILLS/PROJECTS/CONTACT)
- [ ] `content/en.ts` placeholders
- [ ] `content/ja.ts` placeholders
- [ ] Shared content type enforced
- [ ] AI-generated images optimised (AVIF/WebP, <200KB)
**DoD:** both locales complete with plausible placeholders — [ ]

## Stage 6 — Contact system
- [ ] Supabase project + `contact_submissions` table + RLS
- [ ] Zod schema shared client/server, localised errors
- [ ] Server action: validate → ratelimit → honeypot → insert → send
- [ ] Upstash rate limit (3/hour/IP)
- [ ] Resend + React Email template
- [ ] UI states idle/submitting/success/error in-style
- [ ] Secrets in Vercel env vars only
**DoD:** real submission lands in DB + inbox; 4th in an hour rejected — [ ]

## Stage 7 — Performance
- [ ] `"use client"` audit
- [ ] Bundle analyzer pass
- [ ] Font preload/subset verified
- [ ] LCP < 1.5s / CLS < 0.05 / INP < 200ms / JS < 90KB
- [ ] Lighthouse CI in GitHub Actions
**DoD:** all budgets met on throttled mobile, enforced in CI — [ ]

## Stage 8 — SEO / a11y / analytics
- [ ] Metadata, canonical, sitemap, robots
- [ ] JSON-LD Person schema
- [ ] Dynamic OG images per locale
- [ ] axe pass, WCAG 2.1 AA, contrast check on --fg-dim
- [ ] Vercel Analytics + Speed Insights
**DoD:** Lighthouse ≥ 95 on all four categories, both locales — [ ]

## Stage 9 — Launch
- [ ] Production env vars set
- [ ] Custom domain + HTTPS + Resend DNS
- [ ] Safari iOS / Chrome Android / Firefox pass (`100dvh` not `100vh`)
- [ ] 404 page in-style
- [ ] URL added to resume, LinkedIn, GitHub, agency profiles
**DoD:** live on real domain, contact verified in production — [ ]

## Stage 10 — Three.js (deferred)
- [ ] r3f + drei behind dynamic import in `<CanvasSlot>`
- [ ] Guards: reduced-motion, low-core, saveData
- [ ] Stage 7 budgets re-verified with canvas on
**DoD:** budgets still met with canvas enabled — [ ]

---

## Session log

| Date | Stage | What happened |
|---|---|---|
| 2026-08-28 | — | Reference site torn down, stack chosen, plan written. Nothing built yet. |
| 2026-08-28 | 0–1 | Full project source written: configs, design tokens, 11 primitives, CanvasSlot, kitchen sink. NOT installed or run — no npm access in the scaffolding environment. See SETUP.md. |
| 2026-08-29 | 0 | Installed pnpm 9.12.0 (npm global, corepack lacked write access to Program Files), `pnpm install` clean. `pnpm check` surfaced real issues, all fixed: biome.json missing `css.parser.tailwindDirectives` for Tailwind v4 `@theme` syntax; `role="region"` in AccordionRow swapped for `<section aria-labelledby>`; `role="meter"` in RankBar kept with a biome-ignore (native `<meter>` can't render the custom hairline fill bar) rather than switched; `aria-label` on a `<p>` in TerminalHero replaced with a `.sr-only` span (aria-label isn't valid on paragraph role). Ran `biome migrate --write` for the schema-version warning — it wrote `"preset": "none"`, which silently disables all lint rules; corrected to `"preset": "recommended"` by hand. `pnpm dev` verified clean: both `/` and `/dev/kitchen-sink` return 200 with no compile/runtime errors. `git init` + first commit done locally (31a1316). GitHub repo creation and push, and Vercel connect, are next — both need the user's own accounts/browser. |
