# PROGRESS

**Read this first at the start of every session.**
Update it before the end of every session. This file is the project's memory.

- **Current stage:** Stage 6 **working locally end to end** — Aayush created all three accounts and ran the migration on 2026-08-30. A real submission stores in Supabase and arrives by email, and the 4th in an hour is refused. Only the production round-trip is left. Stage 5 is still open on two human items.
- **Next action:** set the same seven variables in **Vercel → Settings → Environment Variables** (Production *and* Preview), redeploy, and send one real message from the live site. Then the Stage 5 items you alone can close (read the Japanese; hand-redact the two PDFs). Plus three checks that have queued up behind the automated work:
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

## Stage 6 — Contact system ★ CURRENT
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
- [ ] Same seven vars set in **Vercel** (Production *and* Preview), then redeploy
- [ ] Real submission verified **in production**
**DoD:** real submission lands in DB + inbox; 4th in an hour rejected — [ ] *(passes locally; the DoD is the production round-trip)*

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

## Stage 11 — Dark mode
- [ ] Tokens confirmed semantic (prerequisite — comes out of Stage 2R)
- [ ] `next-themes`, `defaultTheme="system"`, `disableTransitionOnChange`
- [ ] Dark palette as a token-override block only — zero component edits
- [ ] Un-stamped "system" state handled, not just the two explicit ones
- [ ] No flash of wrong theme on load
- [ ] Hero image treatment for dark
- [ ] `[ ☀ / ☾ ]` bracket toggle in the header
- [ ] Contrast audit re-run in both themes
**DoD:** legible in light / dark / system, no flash, no component colour edits — [ ]

## Stage 12 — Motion
- [ ] `pnpm add motion`; imported as `motion/react`
- [ ] CSS-only for everything CSS can express (accordion stays CSS)
- [ ] Scroll reveals + staggered timeline cards via `useInView`
- [ ] `<LazyMotion features={domAnimation} strict>`; leaf client components only
- [ ] `useReducedMotion()` honoured everywhere
- [ ] Stage 7 budget re-run with motion enabled
**DoD:** budgets still met; page fully usable with motion disabled — [ ]

---

## Stage 13 — Design enhancement
Brief: `docs/STAGE13-DESIGN.md`. Runs after 10/11/12 — needs real content, both
themes, and Motion to exist first.

- [ ] Mock the four changed sections as artboards on a design canvas
- [ ] **A** — break the rhythm: dense/wide EXPERIENCE, asymmetric PROJECTS, calm INTRO + CONTACT bookends
- [ ] Re-measure after A — B and C may be all that remains worth doing
- [ ] **B** — evidence on every project: screenshot, or a real architecture diagram as inline SVG
- [ ] **C** — the four numbers pulled out as large display figures
- [ ] **D** — one signature interaction, from his own subject matter
- [ ] **E** — depth: pinned headers / cursor-reactive grid / hero parallax only
- [ ] **F** — Japanese as design: vertical rails or paired EN/JA headings
- [ ] Re-check: both themes, both locales at 360 and 768, reduced motion
- [ ] Stage 7 budgets re-run and still passing
**DoD:** sections read as composed not uniformly framed; every project shows evidence; the numbers land in a 15-second skim; budgets hold — [ ]

---

## Session log

| Date | Stage | What happened |
|---|---|---|
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
