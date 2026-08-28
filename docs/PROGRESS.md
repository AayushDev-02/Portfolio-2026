# PROGRESS

**Read this first at the start of every session.**
Update it before the end of every session. This file is the project's memory.

- **Current stage:** Stage 2 — all six sections built and wired with the reference's real copy. Stage 1's visual sign-off is still open too (never explicitly confirmed).
- **Next action:** side-by-side comparison at 1440 / 768 / 390 against https://www.project-uncensored.site/ — this is Stage 2's actual DoD and only a human can call it. While there, also do Stage 1's leftover check (kitchen-sink primitives, pixel font, JA typography, token propagation).
- **Live URL:** https://aayush-yadav-portfolio-nine.vercel.app
- **Repo:** https://github.com/AayushDev-02/Portfolio-2026
- **Last updated:** 2026-08-29

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` skipped (log why in DECISIONS.md)

---

## Stage 0 — Foundation
- [x] Node 20+ LTS, pnpm, git verified on laptop — Node v22.15.0, pnpm 9.12.0 (installed via `npm i -g pnpm`, corepack couldn't write to Program Files without admin), git 2.39.1
- [x] Next.js 15 app scaffolded (TS, Tailwind v4, App Router, src/)
- [x] Biome + strict tsconfig + path aliases
- [x] docs/ committed
- [x] `pnpm install && pnpm dev` runs clean locally — see session log 2026-08-29
- [x] Public GitHub repo created and pushed — https://github.com/AayushDev-02/Portfolio-2026
- [x] Vercel connected, first preview deploy green — https://aayush-yadav-portfolio-nine.vercel.app
**DoD:** bare page live on a .vercel.app URL — [x]

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
- [x] Section 00 INTRO — terminal hero, typewriter, caret
- [x] Section 01 PHILOSOPHY — accordion + checklists
- [x] Section 02 STATUS — 001–006 timeline cards
- [x] Section 03 RESULTS — rank bars + CTA
- [x] Section 04 FEEDBACK — accordion + pull quotes + numbered list — **judgment call, see DECISIONS.md**: rendered as accordion rows since text-only extraction couldn't confirm the reference actually collapses these
- [x] Section 05 HISTORY — decision log
- [x] Corner marks / eyebrows / counters / footer sigils on all 6 — free, comes from `SectionShell`
- [ ] Side-by-side comparison at 1440 / 768 / 390  ← **you need to do this** — open both the reference and http://localhost:3000 (or the Vercel deploy once pushed) at each width and compare
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
| 2026-08-29 | 0 | Installed pnpm 9.12.0 (npm global, corepack lacked write access to Program Files), `pnpm install` clean. `pnpm check` surfaced real issues, all fixed: biome.json missing `css.parser.tailwindDirectives` for Tailwind v4 `@theme` syntax; `role="region"` in AccordionRow swapped for `<section aria-labelledby>`; `role="meter"` in RankBar kept with a biome-ignore (native `<meter>` can't render the custom hairline fill bar) rather than switched; `aria-label` on a `<p>` in TerminalHero replaced with a `.sr-only` span (aria-label isn't valid on paragraph role). Ran `biome migrate --write` for the schema-version warning — it wrote `"preset": "none"`, which silently disables all lint rules; corrected to `"preset": "recommended"` by hand. `pnpm dev` verified clean: both `/` and `/dev/kitchen-sink` return 200 with no compile/runtime errors. `git init` + first commit done locally (31a1316), second commit for this log (f065efb). User created public repo AayushDev-02/Portfolio-2026 on github.com; pushed via `git push -u origin main` — first attempt hung 2min behind a Git Credential Manager browser sign-in prompt (not visible to the assistant), user completed sign-in, retry showed "Everything up-to-date" confirming the first attempt had actually already gone through server-side before the local process was killed on timeout. Remote `main` verified at f065efb via `git ls-remote`. |
| 2026-08-29 | 0 | User imported the repo to Vercel; first build failed: `Failed to collect page data for /_not-found` / `TypeError: Invalid URL`, input `''`. Root cause: `src/app/layout.tsx` built `metadataBase` as `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")` — `??` only falls back on null/undefined, not on an empty string, and `NEXT_PUBLIC_SITE_URL` was present but blank in the Vercel env (SETUP.md had said to leave env vars empty for now). Reproduced locally by building with `NEXT_PUBLIC_SITE_URL=""`, confirmed it crashes the same way. Fixed by switching to `\|\|`. Verified the reproduction build succeeds with the fix, then `pnpm check` was clean except for a newly-surfaced unrelated issue: `next-env.d.ts` (generated, CRLF, gitignored) was failing biome's formatter because it wasn't excluded from biome's file scan the way `.next`/`node_modules`/`public` are — added `"!next-env.d.ts"` to `biome.json`'s `files.includes`. Committed (ec2013e) and pushed, which should trigger a Vercel auto-redeploy. Not yet confirmed green — check Vercel and paste the `.vercel.app` URL into this file's header once it deploys. |
| 2026-08-29 | 0 | Redeploy went green. Live at https://aayush-yadav-portfolio-nine.vercel.app — confirmed `/` and `/dev/kitchen-sink` both return 200. **Stage 0 complete.** Only remaining Stage 1 item is human visual verification (pixel font, JA typography, token-propagation check) — not something the assistant can confirm from an HTTP response. |
| 2026-08-29 | 2 | Fetched and transcribed the reference site's actual copy for all six sections (see DESIGN-SPEC.md §6 mapping) into `src/content/reference.ts`, typed. Built `IntroSection`/`PhilosophySection`/`StatusSection`/`ResultsSection`/`FeedbackSection`/`HistorySection` in `src/components/sections/`, each reading only from that content file and rendering existing primitives, per the project rule. Added two primitives not in the original stage-1 inventory — `PullQuote` and `NumberedItem`/`NumberedList` — needed for FEEDBACK's quotes and plain ranked takeaways; reasoning logged in DECISIONS.md, including the judgment call to render FEEDBACK's five themes as accordions (text-only site extraction couldn't confirm the reference's actual disclosure behavior there). `page.tsx` now composes all six in order. `pnpm check` clean, `pnpm build` succeeds (107kB first-load JS — over the stage-7 90KB budget, but that's stage 7's problem, not stage 2's). Hit one operational snag verifying in dev: ran `pnpm build` while `pnpm dev` was still running in the background, and both processes fighting over `.next/` corrupted the dev server's manifest (ENOENT errors, 500s) — not a code bug. Fixed by stopping the dev task, deleting `.next`, restarting; confirmed clean afterward. Grepped the rendered homepage for content markers from every section — all present. **Not yet committed or pushed** — that's next, then the real DoD (side-by-side visual comparison at 1440/768/390 against the live reference) is on the user. |
