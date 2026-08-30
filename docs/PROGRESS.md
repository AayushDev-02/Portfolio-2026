# PROGRESS

**Read this first at the start of every session.**
Update it before the end of every session. This file is the project's memory.

- **Current stage:** **Stage 13 §B and §C are DONE** — the retrieval diagram and the RESULTS band are live. §A turned out not to be a separate workstream: the band's ~416px height against neighbours of 900–1676px *is* the rhythm break. Remaining: EXPERIENCE dense (last of §A), optional §D/§E/§F, **Stage 9** (launch, needs a domain) and optional Stage 10. Both locales score Performance 98 / Accessibility 100 / Best Practices 100 / SEO 100, all four now hard-asserted in CI. Next is Stage 9 (launch). Stage 5 is still open on two human items.
- **Next action:** **Enable Web Analytics and Speed Insights in the Vercel dashboard** — the code is deployed and the component mounts, but nothing is recorded until the products are switched on, and that is a toggle only you have. Then Stage 9. Plus the Stage 5 items you alone can close (read the Japanese; hand-redact the two PDFs). Plus three checks that have queued up behind the automated work:
  1. **Stage 2R's side-by-side** against https://www.project-uncensored.site/ at 1440 / 768 / 390. Still not done, and it is the exact check whose absence let a fully inverted palette pass review — do not let measurements stand in for it again.
  2. **Stage 3 on a real phone.** Emulation misses iOS Safari's toolbar (the reason for `min-h-dvh`), real touch, and font fallback.
  3. **Read the Japanese.** It typechecks and fits the layout; whether it reads naturally is not something I can verify.
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

## Stage 2R — Re-base after the v3 teardown ★ CURRENT
- [x] Tokens inverted to the real palette AND made semantic (bg / ink / accent, never literal colour names)
- [x] `<main>` painted with the page token; `--color-terminal-*` scoped to the hero panel only
- [x] Hero background image in place (`public/images/hero-bg.png` + mobile crop) with gradient fade
- [x] Red pixel wordmark over the photo, 48 → 72px, bold, uppercase
- [x] Dark terminal panel below the wordmark
- [x] Headings and ledes centred; prose on `font-sans`, `max-w-xl`, `leading-6`
- [x] Eyebrow / counter: 11px, 0.2em tracking, accent (intro: ink)
- [x] Accordion: 14px bold accent titles, `sm:` padding step, two-column panel, animated disclosure
- [x] Timeline: `gap-px` hairline grid, black indices, accent for the active card
- [x] `BracketButton`: bare-text CTA variant
- [ ] Side-by-side at 1440 / 768 / 390 — **verified by looking, not by diffing numbers** — still pending; Stage 3 started ahead of it at Aayush's direction
**DoD:** indistinguishable from the reference at all three widths — [ ]

Measured @ 1280×800 after the re-base (reference in brackets):
document **6044** [5955] · sections **800** [800] · **1226** [1292] ·
**1134** [1004] · **800** [826] · **1284** [1232] · **800** [800].
All three of FIXES-STAGE2's acceptance bands pass. Section 02 is the
loosest fit, ~130px over. No horizontal scroll (scrollWidth 1265 < 1280).
**Numbers are not the DoD** — the side-by-side above is.

## Stage 3 — Responsive & interaction polish ★ CURRENT
- [x] Breakpoint audit 360→1920 — ran 320/360/390/414/639/640/768/1024/1280/1440/1920. Found and fixed the hero wordmark overflowing at 360 and 390
- [x] Touch targets ≥ 44px — CTA and delete link were 19px tall; `min-h-11` on the bare `BracketButton`, invisible on a text-only control
- [x] Keyboard nav + focus rings + skip link — verified with real dispatched Tab keys, not programmatic `.focus()` (which never matches `:focus-visible`). Skip link is first; ring is 2px accent at 3px offset
- [x] `prefers-reduced-motion` honoured — under emulation the panel transition is 0.01ms, the caret animation is `none`, and the prompt renders filled rather than typing
- [ ] Tested on real phone  ← **only you can do this** — emulation is not a phone; it misses iOS Safari's toolbar, real touch, and font fallback
**DoD:** no horizontal scroll anywhere; keyboard-operable end to end — [ ] *(automated audit passes at all 11 widths; holding the tick for the real-device check)*

## Stage 4 — Internationalisation ★ CURRENT
- [x] next-intl 4.14.1 installed, `[locale]` routing — both locales prerender statically; first-load JS 112 → 113kB, messages resolve in RSC
- [x] `/` locale detection + cookie override — verified: `Accept-Language: ja` → `/ja`, no header → `/en`, unknown locale terminates at a real 404
- [x] `[ EN / JA ]` switcher — server component, real links, works without JS; each option announced in its own language
- [x] JA typography rules applied — **two real bugs found and fixed, see DECISIONS.md**: the `:lang(ja)` block was losing to Tailwind utilities on cascade-layer order, and no font stack contained a CJK face
- [x] Every section re-checked for JA overflow — 360/390/768/1280/1440 in both locales: no horizontal overflow, zero real text clipping
- [x] hreflang + per-locale metadata — canonical + `en`/`ja`/`x-default` alternates on both; titles and descriptions per locale
- [ ] Human read-through of the Japanese  ← **you should do this** — the JA copy is my translation of the reference; it typechecks and fits the layout, but I can't judge whether it *reads* naturally to a Japanese recruiter
**DoD:** both locales render cleanly, no clipped text — [x] *(automated; the copy quality itself is unreviewed)*

## Stage 5 — Content remap ★ CURRENT
Brief: `docs/CONTENT-STAGE5.md`. Sources: `docs/source/*.pdf` (gitignored).

- [x] `docs/source/` added to `.gitignore` — committed alone, before any other stage 5 work; verified none of the three PDFs had ever been tracked
- [x] Section mapping applied (INTRO / ABOUT / EXPERIENCE / SKILLS / PROJECTS / CONTACT) — section files renamed to match
- [x] `content/en.ts` — real content, no placeholders
- [x] `content/ja.ts` — phrasing **lifted from the 職務経歴書**, not translated from the English
- [x] Shared content type enforced (a missing JA key is a compile error)
- [x] SKILLS: `RankBar` replaced with a categorised hairline grid — see brief §4 and DECISIONS.md. `RankBar` kept for real measured numbers
- [-] `public/documents/` — **NOT created. Blocked on redaction, handed back deliberately.** No PDF tooling exists on this machine (no qpdf/mutool/pdftk/ghostscript/poppler, no Python PDF lib). See DECISIONS.md; the brief pre-authorised stopping here
- [x] 履歴書 offered on request in copy; **no file, no link, not in `public/`** — it is not even representable in the content type
- [x] Phone number stripped — nothing was published at all, so `public/` contains no PDF. Greps for the phone and "Prodapt" both return empty
- [~] Download buttons in CONTACT, both locales — markup written and driven by `contact.documents`; the array is empty, so the section renders its "available on request" note instead of dead links. Buttons appear the moment redacted files land
- [x] Hero image optimised — AVIF 184KB / 80KB, WebP siblings 197KB / 72KB, PNGs deleted (2.3MB out of the repo)
- [ ] **Aayush reads the Japanese**  ← the DoD depends on this
**DoD:** both locales complete with real content; nothing in `public/` carries a home address or phone number — [ ] *(the privacy half is verified; the Japanese read-through is not)*

**Handoff — the one thing waiting on you:** redact the phone number from
`resume-en.pdf` and `shokumu-keirekisho-ja.pdf` by hand, save them into
`public/documents/` under names with no "Prodapt" in them, then add two entries
to `contact.documents` in `content/en.ts` and `content/ja.ts`. The buttons wire
themselves up. **Never add the 履歴書.**

### First design divergence logged here
Section 03's rank bars do not survive the swap — percentages are honest for poll
results and dishonest for self-rated skills. Replaced with a categorised grid.
This is where the build stops matching the reference. See brief §4.

## Stage 6 — Contact system ✅ DONE
Setup guide: `SETUP-STAGE6.md`. Migration: `supabase/migrations/0001_*.sql`.

- [x] Supabase project + `contact_submissions` table + RLS — created and migration run 2026-08-30; verified by a real insert. RLS on with *no policies*: the anon key can neither read nor write, the secret key bypasses
- [x] Zod schema, localised errors — **server-side only**, and the client never imports it; see DECISIONS.md. Errors are codes, translated from `content/*.ts`, so a new code without both translations is a compile error
- [x] Server action: validate → ratelimit → honeypot → insert → send — honeypot moved *ahead* of the rate limiter (DECISIONS.md). Insert before send, so a Resend outage never loses an enquiry
- [x] Upstash rate limit (3/hour/IP) — sliding window, on an HMAC of the IP rather than the address. **Fails closed**: an Upstash outage rejects rather than letting messages through
- [x] Resend + email template — hand-authored HTML + plain-text sibling, no React Email. `replyTo` is the sender, so Reply answers the person
- [x] UI states idle/submitting/success/error in-style — `[ SENDING... ]`, `[ MESSAGE RECEIVED ]`, `[ TRANSMISSION FAILED ]`. Works with JavaScript off
- [x] Secrets in Vercel env vars only — nothing hard-coded; `server-only` makes a client import of the service-role key a build failure. Verified: no secret and no server library appears in `.next/static/`
- [x] Three accounts created, seven env vars set **locally** in `.env` ← `SETUP-STAGE6.md`
- [x] Migration run in the Supabase SQL editor
- [x] Real submission verified **locally**: row in the table, email delivered, 4th in an hour refused
- [x] Same seven vars set in **Vercel**, then redeploy
- [x] Real submission verified **in production** — 3 accepted, 4th refused with the localised rate-limit message; JA renders Japanese validation errors
**DoD:** real submission lands in DB + inbox; 4th in an hour rejected — [x] *(verified in production 2026-08-30; see the inbox caveat below)*

**Inbox confirmed 2026-08-30.** Aayush received the notifications at
`…002@gmail.com`, correctly formatted. Nothing arrives at `…02jp@` and nothing
will until stage 9: Resend's test mode only ever delivers to the account's own
signup address. `CONTACT_FROM_EMAIL` moves to a verified domain in stage 9, and
`CONTACT_TO_EMAIL` goes back to the `…02jp@` address at the same time — in both
`.env` and Vercel.

**Known limitation until stage 9.** `CONTACT_FROM_EMAIL` is `onboarding@resend.dev`, and Resend's test mode only delivers to the account's own signup address. `CONTACT_TO_EMAIL` is therefore temporarily `yadavaayush002@gmail.com` (the Resend account), not the `…02jp@` address the site advertises. Verify a domain at resend.com/domains in stage 9, change `CONTACT_FROM_EMAIL` to it, and point `CONTACT_TO_EMAIL` back. Both `.env` and Vercel need the change.

Automated acceptance, 12/12 passing against a running server (headless Chrome
over CDP, Node built-ins, no dependency added), plus the no-JS path driven by
raw form POSTs: empty submit flags all three fields with localised strings, not
codes · a rejected submit keeps what was typed · sub-2s submit rejected as too
fast · honeypot returns a fake success and stores nothing · an unreachable rate
limiter fails **closed** · JA renders Japanese errors · no horizontal scroll at
360/390/768 with the form present · every control ≥ 44px.

**The form does not render until all seven env vars are set.** That is
deliberate: a form that renders and cannot deliver is worse than no form.
Unconfigured, CONTACT falls back to the mailto link and the documents note —
verified in the production build.

## Stage 7 — Performance ✅ DONE
Budgets revised — see PLAN.md §7 and DECISIONS.md. Harness:
`pnpm perf <url>` (field measurement) and `pnpm budget` (bundle, exact).

- [x] `"use client"` audit — three client components, all justified: `AccordionRow`, `TerminalPrompt`, `ContactForm`. No section is a client component
- [x] Bundle pass — done by gzipping the built chunks from the manifest rather than a analyzer dependency. **App code 7.5KB**, framework baseline 101.4KB, total 107.8KB
- [x] Font subset verified — Geist Mono moved off the `geist` package to next/font/google: the preloaded face went **69.7KB → 22.6KB**, fonts overall 76.9KB → 29.8KB
- [x] LCP **1.19s** (was 2.18s) · CLS **0.0017** · INP **24ms**, TBT 0ms · app code **7.5KB / 15KB**
- [x] Lighthouse CI in GitHub Actions — `.github/workflows/performance.yml`, plus the exact bundle gate
- [x] Lighthouse category score ≥ 95 confirmed — CI run `80de149` green. The assertions are hard errors, so a passing step means performance, accessibility **and** SEO all cleared 0.95 on both `/en` and `/ja`
**DoD:** all budgets met on throttled mobile, enforced in CI — [x]

Measured on production, mobile emulation at Slow 4G and 4x CPU throttle,
median of 5 runs. Discard the first run after a deploy — it hits a cold edge.

| | before | after | budget |
|---|---|---|---|
| LCP | 2.18s | **1.19s** | < 1.5s |
| CLS | 0.0019 | **0.0017** | < 0.05 |
| INP | — | **24ms** | < 200ms |
| app code | — | **7.5KB** | < 15KB |
| total first-load JS | 115KB | **107.8KB** | < 120KB |
| page weight | 480KB | **209KB** | — |

Three fixes, in order of what they bought:
1. **The hero downloaded both crops on every device.** `sm:hidden` does not
   cancel a fetch and `priority` preloaded both — 264KB to display 80KB of it.
   `<picture>` decides in the preload scanner. Also removed 5KB of next/image
   client runtime.
2. **Geist Mono shipped whole**, 70KB, competing with the LCP image for
   bandwidth on Slow 4G. Subsetted to latin: 22.6KB.
3. **Hero re-encoded from the PNG originals** recovered at `757cd45^`, so no
   generation loss. Quality chosen by mean-absolute-error, all under 2/255.

## Stage 8 — SEO / a11y / analytics ✅ DONE
- [x] Metadata, canonical, sitemap, robots — **production was serving `http://localhost:3000` as its canonical.** `NEXT_PUBLIC_SITE_URL` was left at the `.env.example` default in Vercel; a canonical pointing at localhost tells Google the real page is unreachable. Fixed the value *and* the code: `lib/site-url.ts` resolves rather than reads
- [x] JSON-LD `Person` schema — built only from what the page already displays, so structured data cannot disagree with the page or leak what stage 5 withheld. `sameAs` merges this page with GitHub and LinkedIn into one entity
- [x] Dynamic OG images per locale — Noto Sans JP subset to the exact glyphs at build, because satori has no font fallback and the Japanese card would otherwise be blank boxes. Both cards rendered and eyeballed
- [x] axe pass, WCAG 2.1 AA, contrast check — **one real AA failure found**, in both locales: the terminal panel's status line at 2.94:1. `--color-accent` is tuned for white (4.83:1) and is only 4.10:1 on the dark panel *even at full opacity*, so added `--color-terminal-accent` (5.26:1). Now 0 violations across 29 rules, both locales
- [x] Favicon — **did not exist.** Every page load 404'd `/favicon.ico` and every tab was blank. Adding `icon.tsx` was not enough: next-intl's matcher only excludes paths with a file extension, so `/icon` was being rewritten to `/en/icon`
- [~] Vercel Analytics + Speed Insights — **code deployed and verified mounting** (`window.va` / `window.vaq` initialise, no console errors). **Nothing is recorded until you enable both products in the Vercel dashboard** — that toggle is yours
**DoD:** Lighthouse ≥ 95 on all four categories, both locales — [x]

Measured on the production build, mobile, both locales:

| | /en | /ja | target |
|---|---|---|---|
| Performance | **98** | **98** | ≥ 95 |
| Accessibility | **100** | **100** | ≥ 95 |
| Best Practices | **100** | **100** | ≥ 95 |
| SEO | **100** | **100** | ≥ 95 |

All four are now `error`-level assertions in `.github/workflows/performance.yml`,
so a regression fails the build rather than passing quietly. Best Practices was
a `warn` until this stage — which is exactly why the missing favicon survived
this long.

## Stage 9 — Launch ★ CURRENT
- [x] 404 page in-style — **done and live**, pulled forward since it needs no domain. Renders on Vercel only; a local `next start` serves Next's built-in page, so verify changes against a deploy
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

## Stage 11 — Dark mode ✅ DONE
- [x] Tokens confirmed semantic — audited every colour utility in `src/`: all name a token, no literals. The only hard-coded colours are the favicon and OG image, where satori cannot read CSS variables
- [x] `next-themes` 0.4.6, `defaultTheme="system"`, `disableTransitionOnChange` — the last matters here because every colour sits behind a 150ms transition, so without it a switch animates the whole page as a muddy wipe
- [x] Dark palette as a token-override block only — **zero component colour edits.** Two components changed, neither for colour: `HeroBackdrop` gained a filter hook driven by `--hero-image-filter`, `LocaleSwitcher` stopped positioning itself
- [x] Three states handled — explicit light beats a dark OS and survives reload; the `prefers-color-scheme` block also covers JavaScript being off
- [x] No flash — ten background samples from the first frames after navigation are all `rgb(26,26,26)`
- [x] Hero image treatment — a filter in the token layer, not a second asset: no bytes, and the art is still placeholder
- [x] `[ LT / DK ]` bracket toggle — **not** PLAN's `[ ☀ / ☾ ]`: Geist Mono has no moon and the fallback crescent is indistinguishable from a C at 11px. See DECISIONS.md
- [x] Contrast audit re-run in both themes — axe, 0 violations across 26 WCAG 2.1 A/AA rules in **all four** combinations of theme × locale
**DoD:** legible in light / dark / system, no flash, no component colour edits — [x]

Measured, not eyeballed. Every dark pair clears AA:

| pair | ratio | note |
|---|---|---|
| ink on page | 14.87:1 | |
| ink-deep on page | 17.40:1 | |
| prose on page | 6.86:1 | gray-500 measured 4.10:1 and was rejected |
| accent on page | **4.62:1** | tightest pair in either theme — protect this |
| terminal-fg on panel | 16.91:1 | |

**The page lifts to `#1a1a1a`; the panel stays `#0a0a0a`.** The terminal panel is
the darkest element in light mode and keeping that relationship is the point — a
panel at `#171717` on a `#0a0a0a` page separates by 1.10:1 and effectively
disappears, deleting the one dark element the design rests on.

Also fixed here: the layout header used the *same* offsets as `SectionShell`'s
counter, so the locale switcher had been sitting on top of "01 / 06" since
stage 4. A second control made it obvious.

## Stage 12 — Motion pass ★ NEXT
Brief: `docs/STAGE12-MOTION.md`. Library decision first — the recommendation is
**no library**: app code is 11.7KB fully server-rendered, and every effect below
is `IntersectionObserver` + CSS + ~60 lines of vanilla JS in small client leaves.

- [ ] Decide on `motion` vs no library; log it in DECISIONS.md with measured numbers
- [ ] **A** — text scramble on headings (Latin only; `ja` fades instead)
- [ ] **B** — count-up on the four RESULTS figures (`tabular-nums`, width reserved)
- [ ] **C** — hairline draw-in on section rules (`scaleX`, origin left, ~40ms stagger)
- [ ] **D** — cursor crosshair (`pointer: fine`, rAF + `translate3d`, `aria-hidden`)
- [ ] **E** — scroll-linked section counter (one observer, `rootMargin: -50%`)
- [-] **F** — boot sequence on first load — **recommended against**; see brief §2F
- [ ] Every effect renders its finished state under `prefers-reduced-motion`
- [ ] `ja` checked at 360/768 — no per-character effect on CJK text
- [ ] First-load JS reported before/after; >5KB movement means something became a client component
- [ ] Lighthouse ≥ 95 both locales; LCP still < 1.5s
**DoD:** all five live; first-load JS essentially unchanged; budgets pass; page complete with motion disabled — [ ]

---

## Stage 14 — 3D hero
Brief: `docs/STAGE14-3D-MOTION.md`. **After Stage 12**, and only if Stage 12
did not already fix the complaint.

- [ ] Settle the budget conflict and log it — poster stays LCP, canvas mounts after `load`, budget splits into two numbers
- [ ] Pick exactly one of the five concepts
- [ ] Four kill switches: reduced-motion, `saveData`, `hardwareConcurrency <= 4`, no WebGL
- [ ] Hero has a focal point; wordmark sits in a calm zone
- [ ] Both themes, both locales, 360/768
- [ ] Stage 7 budgets re-run with the canvas disabled AND enabled
**DoD:** first-load < 90KB and LCP < 1.5s with canvas off; deferred 3D under its own ceiling; site complete with every kill switch tripped — [ ]

## Stage 13 — Design enhancement
Brief: `docs/STAGE13-DESIGN.md`. Runs after 10/11/12 — needs real content, both
themes, and Motion to exist first.

- [x] Mock the changed sections as artboards on a design canvas — five artboards, laid out in page order so the rhythm contrast is visible side by side. Aayush approved B and C from it
- [~] **A** — **not a separate workstream.** Breaking the rhythm is a *consequence* of B and C: §C's band is ~416px against neighbours of 900–1676px, and §B makes PROJECTS taller and asymmetric. Only EXPERIENCE-goes-dense is left, and it is drawn on the canvas
- [x] **B** — the featured project shows its retrieval architecture as hand-authored inline SVG. Labels live in `content/*.ts` typed as `PipelineDiagram`, so it translates and a missing JA label is a compile error; colours are token classes, so it follows both themes
- [x] **C** — the four figures moved out of project prose into a RESULTS band in the display face
- [ ] **D** — one signature interaction ← optional upside
- [ ] **E** — depth: pinned headers / cursor-reactive grid / hero parallax ← optional upside
- [ ] **F** — Japanese as design: vertical rails or paired EN/JA headings ← optional upside
- [x] Re-check: both themes, both locales — axe 0 violations across 30 rules in all four combinations; no horizontal overflow at 1440/390/360/768
- [x] Stage 7 budgets re-run — LCP 1.23s, CLS 0.0018, **app code unchanged at 11.7KB** (all server-rendered), CI green
**DoD:** sections read as composed not uniformly framed; every project shows evidence; the numbers land in a 15-second skim; budgets hold — [~] *(B and C met; the featured project shows evidence, the others do not yet; EXPERIENCE dense outstanding)*

Section heights, light EN — the uniform six-frame page is gone:

| section | height |
|---|---|
| intro | 900 |
| about | 1003 |
| experience | 1270 |
| skills | 1676 |
| **results** | **416** ← the break |
| projects | 1392 |
| contact | 1458 |

**Design canvas:** https://claude.ai/code/artifact/c7f0b922-b362-4a81-a246-91a0d9244237
Working files in `design-mockups/` (the seeded `.html` is gitignored — it is
2.5MB of editor payload and regenerates from the `.dc.html` files beside it).

**Still open from the canvas, for Aayush:** the EXPERIENCE "What shipped" tags
are my summary of his roles, not his words; the language-study year is drawn as
a row of its own rather than a gap; and company names carry 株式会社 in the
English artboard.

---

## Session log

| Date | Stage | What happened |
|---|---|---|
| 2026-08-30 | 13 | Design enhancement, §B and §C. Started on a design canvas as the brief's process step 1 requires — five artboards in page order, using tokens lifted from `globals.css` rather than approximated. Aayush approved B and C and asked what A actually meant; **the useful answer was that A is not a separate workstream**: breaking the rhythm is a consequence of B and C, since the numbers band measures ~416px against neighbours of 900–1676px and PROJECTS grew taller and asymmetric. Only EXPERIENCE-goes-dense is left of it. **§B — evidence**, which the brief called the highest-value item because a portfolio for someone who builds retrieval systems contained no diagram, image or screenshot at all. Hand-authored inline SVG in the hairline-and-mono idiom; no charting library, since stage 7's budget binds and a generic import would look like clip art. Two decisions that mattered: every label lives in `content/*.ts` typed as `PipelineDiagram`, so the diagram translates and a missing Japanese label is a compile error — a diagram left in English on the JA page reads as an oversight rather than a choice — and every colour is a token class, so it follows light and dark with the model sitting on `fill-terminal-bg`, the one dark element, marking where the answer is produced. Wrote `useId` first and removed it: Server Components have no hooks, and fixed ids are safe because `featured` marks exactly one project. Also caught myself using `text-[9px]`/`text-[10px]` arbitrary values against CLAUDE.md rule 1 when `--text-badge` and `--text-micro` already existed. PROJECTS also **lost its accordion** — content behind a disclosure is content a fifteen-second skim never sees, and this is the section that most needs seeing. **§C — the numbers**, which already existed buried in project prose. The band deliberately does **not** use `SectionShell`: that shell is what makes every section a centred full-viewport frame, so using it would defeat the purpose. It keeps the eyebrow, caption and sigil so it belongs to the page, but is unnumbered and does not advance the 01/06 counter. **Cost 0KB of client JS** — all server-rendered, app code unchanged at 11.7KB. axe: 0 violations across 30 rules in all four theme × locale combinations; LCP 1.23s; CI green. Two self-inflicted slips fixed after committing: I re-added the `Co-Authored-By` trailer Aayush had asked be removed (amended and force-pushed; contributors still show him alone), and I committed the 2.5MB seeded canvas payload, which is now gitignored since it regenerates from the `.dc.html` working files beside it. |
| 2026-08-30 | 12 | Motion — and the plan's own prescription was **built, measured and rejected**. `LazyMotion` + `domAnimation` + `strict`, exactly as PLAN.md §12 specified, costs **38.3KB gzipped**: app code 11.4 → 49.7KB against a 15KB budget, two and a half times the entire budget for two effects. `useInView` alone measured 0.6KB and would have fit, but keeping a 38KB dependency to use 1.5% of it leaves a loaded footgun — the next person reaching for `m.div` adds the other 38KB and learns it from CI rather than from the code. The replacement costs **0.3KB** and does everything §12 asked: `Reveal` is a thin client wrapper holding an IntersectionObserver and one boolean, with `children` passed as a prop so everything inside stays server-rendered, and the animation is entirely CSS with distance, duration, easing and stagger as tokens. Only `opacity` and `transform` animate — both compositor-only, so nothing touches layout or INP. Stagger needed a structural decision: `HairlineGrid` builds its shared hairlines from `gap-px` and forwards no ref, so giving each card its own observer would insert a div between the grid and its items and collapse the borders; instead one observer wraps the grid and CSS staggers the cards by `:nth-child`, enumerated to ten because CSS cannot compute a delay from an index. **The hidden state is scoped to `[data-js]`**, set by a blocking inline script — if it applied unconditionally and a script ever failed, every revealed element would sit at `opacity: 0` and the site would be blank, which is the worst failure available to a page whose job is being read. Reduced motion forces the shown state outright rather than shortening the transition, which would flash rather than reveal. Verified: below-fold nodes pending then 3/5 shown after scrolling, stagger stepping 0/70/140/210/280ms, reduced-motion elements at opacity 1 with no transform, and served HTML carrying `data-reveal="pending"` with no `data-js`. Budgets re-run on production: **LCP improved to 1.11s**, CLS 0.0017, INP 56ms, TBT 0ms, app code 11.7KB — all inside budget, CI green. Also cost time again: `pkill -f next-server` from Git Bash reports success and leaves the process running, so a new `pnpm start` silently fails to bind and every request goes to the old server, which serves HTML referencing a deleted stylesheet hash and renders with no CSS at all. The CSS-applied guard added after the stage 11 incident caught it this time instead of producing another confident wrong answer. Use PowerShell's `Stop-Process` and a fresh port. |
| 2026-08-30 | 11 | Dark mode, and stage 2R's bet paid off exactly as intended: an audit of every colour utility in `src/` found all of them naming a semantic token and not one literal, so the feature is a single override block in globals.css with **no component colour edit**. Two components changed and neither for colour — `HeroBackdrop` gained a `hero-image` class applying `--hero-image-filter` (`none` in light, so it is inert there and the component still knows nothing about themes), and `LocaleSwitcher` stopped positioning itself. **The palette was measured rather than chosen by eye**: gray-500 for prose measures 4.10:1 and was rejected for gray-400 at 6.86:1; the light theme's red-600 accent is 3.4:1 on a dark ground and was replaced with red-500 at 4.62:1 — the tightest pair in either theme and the one to protect. **The page lifts to #1a1a1a rather than the panel dropping**, because the terminal panel is the darkest element in light mode and a panel at #171717 on a #0a0a0a page separates by 1.10:1 and disappears, which would delete the one dark element the whole design rests on. Three states verified, not two: OS-dark renders dark, an explicit light choice beats it and survives a reload, and the media block is guarded with `:not([data-theme=\"light\"])` so it also covers JavaScript being off. No flash — ten background samples from the first frames after navigation are all `rgb(26,26,26)`. axe re-run: 0 violations across 26 rules in all four theme × locale combinations. Toggle shipped as `[ LT / DK ]` rather than PLAN's `[ ☀ / ☾ ]` — Geist Mono has no moon and the fallback crescent is indistinguishable from a capital C at the 11px eyebrow size; notably a `measureText` coverage probe *disagreed* with what the browser actually painted, so the screenshot was the evidence. Fixed a bug that predates this stage: the layout header used SectionShell's own `px-gutter py-10` offsets, so the locale switcher had been overlapping the "01 / 06" counter since stage 4 — invisible until a second control sat beside it. **Two measurement traps cost real time and are written up in DECISIONS.md**: a stale `next start` serving HTML that referenced a deleted stylesheet hash, which rendered the page with no CSS and produced a completely convincing false report of hero-image overflow at every width; and two CDP runs sharing a debug port and profile, where the second attaches to the first's dying browser and audits `about:blank`, which axe reports as missing `<title>` and `lang`. Both harnesses now assert the page actually loaded before reporting anything. |
| 2026-08-30 | 8 | SEO, structured data, OG images, a11y, analytics — **both locales now 98 / 100 / 100 / 100**. The worst find was that **production had been serving `<link rel="canonical" href="http://localhost:3000/en">`**: `NEXT_PUBLIC_SITE_URL` was left at its `.env.example` default in Vercel, and every canonical, hreflang and sitemap URL derives from it. A canonical pointing at localhost tells a search engine the real page is somewhere it cannot reach — for a site whose whole purpose is being found by a recruiter that is the most expensive possible bug, and nothing about the rendered page looks wrong when it happens. Fixed the Vercel value *and* `lib/site-url.ts`, which now resolves rather than reads and will not trust a localhost value when `VERCEL_PROJECT_PRODUCTION_URL` exists (that variable, not `VERCEL_URL`, which is unique per deployment — a canonical must not change on every push). Added `sitemap.ts`, `robots.ts`, and a JSON-LD `Person` built **only from what the page already displays**: structured data that disagrees with the page is a manual-action risk, and it is a privacy boundary — city and country only, so the home address stage 5 refused to publish does not reappear inside a `<script>` nobody thinks to check. `worksFor` omitted deliberately: the content model does not mark which engagement is current. Per-locale OG images subset Noto Sans JP to the exact glyphs at build, since satori needs font *data* and has none of the per-glyph `--font-jp` fallback the pages rely on — without it every kana on the Japanese card is a blank box; both cards were rendered and looked at. **axe found one real WCAG AA failure in both locales**: the terminal panel's status line at 2.94:1. `--color-accent` is tuned for red on white (4.83:1) and is 4.10:1 on the dark panel even at full opacity, so dropping the `/80` alone would not have fixed it — added `--color-terminal-accent` at 5.26:1, as a token per CLAUDE.md rule 1, which stage 11 will need again for the whole page. Then promoting Best Practices from `warn` to `error` — so the DoD could be *confirmed* rather than assumed — surfaced three console errors, one real: **there was no favicon at all**. Adding `icon.tsx` was not sufficient, because next-intl's matcher only excludes paths with a file extension and `/icon` has none, so it was rewritten to `/en/icon`; any root-level metadata route without an extension hits this. The other two were the Vercel analytics scripts 404ing off-platform, now gated on `isDeployed`. That gate was itself a lesson: the first attempt used `process.env.VERCEL`, which was falsy during the static prerender and silently left analytics off in production — a gate that fails closed and says nothing is worse than no gate, so it now derives from the same resolved `siteUrl` everything else uses. Analytics verified mounting in production (`window.va`/`window.vaq` initialise, no console errors), but **beacons record nothing until Web Analytics and Speed Insights are enabled in the dashboard**. Also bounded the OG font fetch after one build died as `Failed to collect page data for /[locale]/opengraph-image`, which was an unbounded request to Google Fonts saying nothing about the network. |
| 2026-08-30 | 6, 7 | **Both stages closed.** Aayush confirmed the notification emails arrive at `…002@gmail.com`, correctly rendered — the last open half of stage 6's DoD. Nothing reaches `…02jp@` and nothing will until stage 9, since Resend test mode only delivers to the account's own signup address. He also made the repo public again, which PLAN.md's stage 0 had asked for and which finally made CI readable. The first `performance` run had failed at `pnpm/action-setup`: package.json declares `"packageManager": "pnpm@9.12.0"` and the workflow also passed `version: 9`, and the action refuses outright when a version is given in both places rather than picking one — removed the input and let packageManager be the single source. Second run green, all nine steps, which closes stage 7's last item: the Lighthouse assertions are `error` level, so a passing step means performance, accessibility and SEO each cleared 0.95 on **both** locales. That also pre-verifies part of stage 8's DoD. Worth noting for next time: GitHub's job-log download endpoint 403s without a token even on a public repo, so step conclusions — not log text — are what is readable from here. |
| 2026-08-30 | 7 | Performance. **LCP 2.18s → 1.19s and page weight 480KB → 209KB**, measured on production under mobile emulation at Slow 4G and 4x CPU, median of 5 runs, via a CDP harness using Node built-ins (now `scripts/measure-perf.mjs`). PageSpeed Insights' public quota was exhausted for the whole session, so nothing here comes from Lighthouse — the category score is the one number still unverified, and the new CI workflow is what will report it. **The big find: the hero downloaded both crops on every device.** `HeroBackdrop` rendered both as `next/image` and hid one with `sm:hidden`, which does not cancel a fetch — and `priority` emitted a preload for *both*, so the desktop crop was fetched eagerly, on a phone, in competition with the crop actually on screen: 264KB delivered to display 80KB. Replaced with `<picture>`, which resolves the choice in the preload scanner before any byte is requested; dropping next/image also took 5KB of client runtime off, page JS 7.76 → 2.58KB. Second: the `geist` package ships Geist Mono whole at 69.7KB with no subsetting option, nearly the size of the hero photo; moved to next/font/google's `Geist_Mono` with `subsets: ["latin"]` — same face, still self-hosted at build, 22.6KB — and removed the dependency. Latin-only is free here because Japanese resolves through `--font-jp` by design. Third: re-encoded the hero from the **PNG originals recovered from git history at `757cd45^`** rather than re-compressing the shipped AVIF, avoiding generation loss; quality picked by mean-absolute-error against the original rather than by eye, all four files under 2/255. **Deliberately did not take the desktop AVIF cliff at q35** (96.8KB → 14.1KB for only 1.36 → 1.81 error) — a collapse that large on gradient-heavy art is banding, exactly the artefact a mean-error metric understates. **The 90KB JS budget turned out to be below the framework floor**: an empty page already ships ~101KB of React 19 + Next 15 runtime, so the budget could never pass and CI would have failed on every commit for a reason no commit caused. Split it at Aayush's direction: app code ≤ 15KB (now 7.5KB) is the number that binds and catches real regressions, with the baseline recorded as a constant and a 120KB total as a secondary ceiling. Enforced by `scripts/check-budget.mjs`, which gzips the chunks from `app-build-manifest.json` rather than scraping `next build`'s human-formatted table. INP measured at 24ms and TBT at 0ms with real dispatched clicks on the accordion. |
| 2026-08-30 | 6 | **Stage 6 closed — the form is live and verified in production.** Getting there turned up three separate faults, none visible from the browser. (1) Aayush renamed `NEXT_PUBLIC_SUPABASE_URL` to `SUPABASE_URL` in `.env.example` — correct, since the browser never talks to Supabase here and the prefix set the wrong precedent beside the RLS-bypassing secret key — but the code still read the old name, which silently gated the form in *both* environments. Adopted the rename in `contact-env.ts` and the setup guide. (2) Vercel does not rebuild when environment variables change, and the page is statically prerendered, so `isContactConfigured()` had been evaluated at build time before the variables existed; the form stayed hidden until a push forced a rebuild. `SETUP-STAGE6.md` had not said this — now it does. (3) The real one: production returned `TRANSMISSION FAILED` while the identical credentials worked locally. Found by streaming `vercel logs` while POSTing to the live server action — `Upstash Redis client was passed an invalid URL. Received: ""https://…""`. Upstash's dashboard hands you a quoted `.env` snippet; `dotenv` strips the quotes from a real `.env` file, Vercel's UI stores them verbatim. **Fixed in `req()` rather than by correcting the two Vercel values**, since that paste is how anyone would copy these credentials and it would recur on every rotation, on Preview, and for Supabase and Resend equally; nine cases unit-checked, interior quotes untouched. Worth remembering for next time: the failure was invisible from outside because the form correctly returns a generic error rather than leaking the reason, and `vercel env pull` returns `""` for variables marked Sensitive, so the values themselves could not be inspected. Production then verified: 3 submissions accepted, the 4th refused with the localised rate-limit message, and `/ja` returning Japanese validation errors. Also linked the repo to the Vercel project (`.vercel/`, already gitignored) and deleted the pulled env file. |
| 2026-08-30 | 6 | Aayush created the Supabase, Resend and Upstash accounts and ran the migration. **The values were pasted into `.env.example`, which is tracked** — caught before any commit, so nothing reached GitHub and no key needed rotating; the real values were already in a gitignored `.env`, and `.env.example` was restored to the blank template. (A blank `.env.local` created mid-recovery was deleted — Next.js gives `.env.local` precedence, so its empty values would have overridden `.env` and silently re-gated the form.) Verified live against the real services: the form renders once all seven vars resolve, a submission inserts into `contact_submissions`, and the 4th within an hour is refused with the localised rate-limit message. **The first attempt exercised the insert-before-send design for real** — Resend rejected it (`onboarding@resend.dev` only delivers to the account's own signup address, and `CONTACT_TO_EMAIL` was the `…02jp@` address rather than the `…002@` account address) and the row was stored anyway, exactly as intended: `[contact] stored 2e1943cc… but email failed`. `CONTACT_TO_EMAIL` temporarily repointed at the Resend account address, with the comment on its own line rather than inline — dotenv's inline-comment handling would otherwise risk becoming part of the address. Reverts in stage 9 once a domain is verified. Four test rows are in the table and can be deleted. Production still unconfigured. |
| 2026-08-29 | 6 | Contact system built end to end; five dependencies added with a DECISIONS.md line each, and **two the plan specified were dropped**. `react-hook-form` went because React 19's `useActionState` already gives the pending flag, the result and progressive enhancement, and ~9KB gz was not defensible on a budget already 25KB over stage 7's target. `@react-email/components` went because the site's monospace-on-hairlines idiom maps to hand-written HTML almost literally, and a plain-text sibling helps deliverability. **Zod is server-side only and the client never imports it** — the first cut had the form importing `CONTACT_LIMITS` from `lib/schemas.ts`, which calls `z.object()` at module scope and so put Zod in the client graph, left to tree-shaking to maybe remove; split into `lib/contact-contract.ts` (no byte-costing imports, both sides) and `lib/schemas.ts` (Zod, server only). That split was forced anyway: a `"use server"` module may only export async functions, which the build caught. Form copy went into `SiteContent.contact.form` rather than the next-intl catalogue, because errors typed `Record<ContactErrorCode, string>` make a missing translation a compile error where flat JSON gives a runtime fallback — and it keeps CLAUDE.md rule 2 intact. **Honeypot moved ahead of the rate limiter**: a honeypot hit already returns a fake success, so rate-limiting it changes nothing for the bot and spends a Redis command per hit out of a free tier. The two bot checks deliberately differ — filled honeypot returns a fake success (telling a bot it was caught only teaches it), too-fast returns a real error (a person pasting a prepared message genuinely can be quick, and silently dropping that is the exact failure this section guards against). Timing stamp written in an effect, not during render, since `Date.now()` in the render body is a hydration mismatch; an absent stamp means no JS and skips the check rather than failing it. IP stored as HMAC-SHA256 keyed on the service-role key — a bare hash of an IP is not anonymisation, and the service-role key avoids an eighth env var. Verified against a running server: 12/12 CDP checks, and the no-JS path driven by raw multipart POSTs (one `aria-invalid` and the right server-rendered error for a bad address; TRANSMISSION FAILED and no success panel for a valid one against fake credentials; success panel and no form for a filled honeypot). Confirmed no secret and no server library reaches `.next/static/`, and that the unconfigured production build renders no form at all. Cost: 113 → 115kB first-load JS. **Nothing is configured** — `SETUP-STAGE6.md` written for the three accounts. Also repaired `docs/PROGRESS.md`, whose working copy had been overwritten with a pre-stage-5 snapshot: every stage 5 item back to unchecked and its session-log entry deleted, while stage 5 is committed at 757cd45. |
| 2026-08-29 | 5 | Aayush supplied his EN resume, 職務経歴書 and 履歴書. Saved to `docs/source/` (to be gitignored). `docs/CONTENT-STAGE5.md` written: section-by-section content mapping, JA sourcing rule (lift from the 職務経歴書, don't translate the English), and a publish/don't-publish table — the 履歴書 carries a home address, phone, DOB, gender and nationality and must never reach `public/`. Identified the first real design divergence: SKILLS cannot use the reference's percentage rank bars. |
| 2026-08-28 | — | Reference site torn down, stack chosen, plan written. Nothing built yet. |
| 2026-08-29 | 2R | v3 teardown done by actually viewing the reference. Found the site is WHITE with a photographic hero — v1/v2 specs were inverted. DESIGN-SPEC.md and FIXES-STAGE2.md rewritten. Dark mode (11) and Motion (12) added to the plan. Placeholder hero image generated. |
| 2026-08-28 | 0–1 | Full project source written: configs, design tokens, 11 primitives, CanvasSlot, kitchen sink. NOT installed or run — no npm access in the scaffolding environment. See SETUP.md. |
| 2026-08-29 | 0 | Installed pnpm 9.12.0 (npm global, corepack lacked write access to Program Files), `pnpm install` clean. `pnpm check` surfaced real issues, all fixed: biome.json missing `css.parser.tailwindDirectives` for Tailwind v4 `@theme` syntax; `role="region"` in AccordionRow swapped for `<section aria-labelledby>`; `role="meter"` in RankBar kept with a biome-ignore (native `<meter>` can't render the custom hairline fill bar) rather than switched; `aria-label` on a `<p>` in TerminalHero replaced with a `.sr-only` span (aria-label isn't valid on paragraph role). Ran `biome migrate --write` for the schema-version warning — it wrote `"preset": "none"`, which silently disables all lint rules; corrected to `"preset": "recommended"` by hand. `pnpm dev` verified clean: both `/` and `/dev/kitchen-sink` return 200 with no compile/runtime errors. `git init` + first commit done locally (31a1316), second commit for this log (f065efb). User created public repo AayushDev-02/Portfolio-2026 on github.com; pushed via `git push -u origin main` — first attempt hung 2min behind a Git Credential Manager browser sign-in prompt (not visible to the assistant), user completed sign-in, retry showed "Everything up-to-date" confirming the first attempt had actually already gone through server-side before the local process was killed on timeout. Remote `main` verified at f065efb via `git ls-remote`. |
| 2026-08-29 | 0 | User imported the repo to Vercel; first build failed: `Failed to collect page data for /_not-found` / `TypeError: Invalid URL`, input `''`. Root cause: `src/app/layout.tsx` built `metadataBase` as `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")` — `??` only falls back on null/undefined, not on an empty string, and `NEXT_PUBLIC_SITE_URL` was present but blank in the Vercel env (SETUP.md had said to leave env vars empty for now). Reproduced locally by building with `NEXT_PUBLIC_SITE_URL=""`, confirmed it crashes the same way. Fixed by switching to `\|\|`. Verified the reproduction build succeeds with the fix, then `pnpm check` was clean except for a newly-surfaced unrelated issue: `next-env.d.ts` (generated, CRLF, gitignored) was failing biome's formatter because it wasn't excluded from biome's file scan the way `.next`/`node_modules`/`public` are — added `"!next-env.d.ts"` to `biome.json`'s `files.includes`. Committed (ec2013e) and pushed, which should trigger a Vercel auto-redeploy. Not yet confirmed green — check Vercel and paste the `.vercel.app` URL into this file's header once it deploys. |
| 2026-08-29 | 0 | Redeploy went green. Live at https://aayush-yadav-portfolio-nine.vercel.app — confirmed `/` and `/dev/kitchen-sink` both return 200. **Stage 0 complete.** Only remaining Stage 1 item is human visual verification (pixel font, JA typography, token-propagation check) — not something the assistant can confirm from an HTTP response. |
| 2026-08-29 | 5 | Gitignored `docs/source/` and committed that alone before touching anything else; confirmed none of the three PDFs had ever been tracked, so no history rewrite was needed. Read all three sources. Content remapped to INTRO/ABOUT/EXPERIENCE/SKILLS/PROJECTS/CONTACT with section files renamed to match; `SiteContent` rewritten for the new shapes, so the JA file passing typecheck is itself the completeness proof. **Japanese lifted from the 職務経歴書, not translated** — 「要件定義から設計・実装・テスト・運用保守まで一貫して」, 「技術領域を限定せず学習を重ねながら」, 「日本語・英語での円滑な仕様調整」 and the 技術スキル category names are his own wording; new Japanese written only for the intro line, availability and contact. Also corrected his name to ヤダフ アーユシュ (his own spelling) from the ヤダヴ・アーユシュ I had invented in stage 4. **SKILLS dropped RankBar** for a categorised hairline grid — extracted `HairlineGrid` so timeline and skills share one implementation, added `SkillCard`; `RankBar` kept for real measured numbers. Minor deviation from the brief: it suggested two-column `CheckList` inside the grid, but the grid is already 2–3 columns of categories, which left ~15 characters per line, so lists inside cards stay single-column. **`public/documents/` deliberately not created** — there is no PDF tooling on this machine, and a stdlib probe showed the phone is contiguous text in the EN resume (so a byte edit is reachable but would mean hand-writing xref repair) while the 職務経歴書's Japanese is CID-encoded, meaning a plaintext search cannot even confirm a phone is absent. Publishing a personal phone number is irreversible, so I stopped as the brief pre-authorised. CONTACT is driven by `contact.documents`, currently empty, so it renders the "available on request" note rather than dead links. Hero converted to AVIF 184KB/80KB with WebP siblings using the `sharp` already present as a Next transitive dep (resolved by path from `.pnpm`; nothing added to package.json), PNGs deleted — 2.3MB out of the repo. One self-inflicted bug caught: the first conversion pass piped the encoded buffer back through `sharp().toFile()`, which decoded and re-encoded it at defaults and pushed the desktop WebP to 251KB; fixed by writing buffers directly. Also lost ~10 minutes to a stale dev server from an earlier task still holding port 3000 and serving old code as a 500 — the new server had silently moved to 3002. Greps for the phone number and "Prodapt" across `public/` and the whole working tree return empty. |
| 2026-08-29 | 4 | i18n via next-intl 4.14.1 (logged in DECISIONS.md per rule 8). `[locale]` segment with middleware detection + cookie override; `/` redirects by `Accept-Language`; both locales prerender statically and first-load JS moved only 112→113kB because messages resolve in RSC. `reference.ts` became `en.ts` alongside a new `ja.ts`, both typed against one `SiteContent` — a key present in English and missing in Japanese is now a compile error. Sections take content as a prop rather than importing it, keeping CLAUDE.md rule 2 intact. **Two Japanese typography bugs that only surfaced once JA actually rendered.** (1) The `:lang(ja)` block was inside `@layer base`; cascade layers beat specificity, so every Tailwind utility in `@layer utilities` overrode it and headings kept `tracking-tight`'s negative tracking in Japanese — precisely what CLAUDE.md rule 6 forbids. Moved the block out of `@layer` entirely, since unlayered rules outrank layered ones; fixed with no `!important` and no component edits. (2) Neither `--font-display` nor `--font-mono` contained a CJK face, so Japanese headings fell through to generic monospace instead of the gothic stack. Appended `--font-jp` to each rather than swapping the family in `:lang(ja)` — font fallback is per-glyph, so Latin still renders in Silkscreen while kana/kanji resolve to gothic, which a family swap could not achieve. Verified after: heading tracking `normal`, body line-height 29.6px, word-break normal. Audited both locales at 360/390/768/1280/1440 — no horizontal overflow anywhere, and zero real text clipping: a naive detector flagged 26 elements, all of them `sr-only` spans, which clip by definition. hreflang/canonical/x-default and per-locale titles verified in the served HTML. JA doc height runs ~4% taller than EN, as expected. **The Japanese copy itself is unreviewed by a human** — it is my translation of the reference copy. |
| 2026-08-29 | 3 | Stage 3 audited with headless Chrome over CDP (Node built-ins, no dependency). Two genuine DoD failures found and fixed. **Hero wordmark overflowed at 360 and 390** — a flat 48px pixel face on one long string pushed the document 25px past the viewport, i.e. the page scrolled sideways on a phone, which is exactly what the DoD forbids; both hero steps are now fluid `clamp()` in the token layer, continuous at the sm boundary so there is no visible jump at 640. **CTA and delete link were 19px tall** against the 44px minimum; `min-h-11` on the bare `BracketButton` variant fixes it invisibly, since a text-only control has no box for the padding to show in. Re-ran clean: no overflow at any of 11 widths 320→1920, no target under 44px. Focus verified by dispatching **real Tab keydown/keyup** rather than programmatic `.focus()` — the first attempt used `.focus()` and reported `outline-style: none`, which was a measurement artefact, not a missing ring: `.focus()` never matches `:focus-visible`. With real keys the ring is 2px accent at 3px offset and the skip link is first in order. Reduced-motion confirmed under emulation: panel transition 0.01ms, caret animation `none`, prompt rendered filled instead of typing. Geometry barely moved (doc 6044→6062, results 800→818), all bands still pass. Stage 2R's side-by-side is **still outstanding** — I briefly recorded it as signed off after a "looks fine", then reverted that when Aayush clarified they had not actually checked yet. |
| 2026-08-29 | 2R | Worked FIXES-STAGE2.md §§1–8, one commit each. Tokens re-based to semantic role names (bg / ink / ink-deep / prose / accent / rule + terminal-bg/fg scoped to the hero panel) so stage 11's dark mode is a token-override block with no component edits. **Renamed the 16px lede size token to `--text-lede` rather than the `--text-prose` the fixes doc specified** — `--color-prose` and `--text-prose` both generate a `.text-prose` utility in Tailwind v4, so the colour and the size would have silently collided. Hero built: two-crop backdrop through `next/image` (paths behind one constant in `lib/images.ts` since the art is placeholder), gradient fade, red pixel wordmark, dark terminal panel. `TerminalHero` became a server component with the typewriter split into a `TerminalPrompt` client leaf. Extracted `SectionHead` instead of repeating the centred heading/lede across five sections. Accordion got the grid-rows 0fr→1fr reveal (no motion dependency, per the constraint) plus `inert` when collapsed; **the two-column rule had to go on `CheckList`, not the panel wrapper** — the list is a single grid child, so columns on the wrapper would never have split it, and it's opt-in because timeline cards reuse `CheckList` at a width that can't take two. Timeline switched to the `gap-px` shared-hairline grid. `BracketButton`'s `tone` prop became `variant` (bare/boxed) since it now picks a shape, not just a colour. Kitchen sink re-based in the same pass — leaving the stage-1 acceptance surface pointed at deleted tokens would have made it useless for the check it exists for. Measured at 1280×800 with headless Chrome over CDP driven by Node built-ins (no dependency added): first pass put section 01 at 1086 against its 1190–1400 band, so I checked the reference's delivered HTML and found 2 of its 11 accordions ship `aria-expanded="true"` — one per group. Opening the first row of each put section 01 at 1226 and the document at 6044, and all three acceptance bands pass. `pnpm check` clean, `pnpm build` clean. **Stage 2R deliberately NOT marked done** — its DoD is the visual side-by-side, which is the check whose absence let the inverted palette through in the first place. |
| 2026-08-29 | 2 | Fetched and transcribed the reference site's actual copy for all six sections (see DESIGN-SPEC.md §6 mapping) into `src/content/reference.ts`, typed. Built `IntroSection`/`PhilosophySection`/`StatusSection`/`ResultsSection`/`FeedbackSection`/`HistorySection` in `src/components/sections/`, each reading only from that content file and rendering existing primitives, per the project rule. Added two primitives not in the original stage-1 inventory — `PullQuote` and `NumberedItem`/`NumberedList` — needed for FEEDBACK's quotes and plain ranked takeaways; reasoning logged in DECISIONS.md, including the judgment call to render FEEDBACK's five themes as accordions (text-only site extraction couldn't confirm the reference's actual disclosure behavior there). `page.tsx` now composes all six in order. `pnpm check` clean, `pnpm build` succeeds (107kB first-load JS — over the stage-7 90KB budget, but that's stage 7's problem, not stage 2's). Hit one operational snag verifying in dev: ran `pnpm build` while `pnpm dev` was still running in the background, and both processes fighting over `.next/` corrupted the dev server's manifest (ENOENT errors, 500s) — not a code bug. Fixed by stopping the dev task, deleting `.next`, restarting; confirmed clean afterward. Grepped the rendered homepage for content markers from every section — all present. **Not yet committed or pushed** — that's next, then the real DoD (side-by-side visual comparison at 1440/768/390 against the live reference) is on the user. |
