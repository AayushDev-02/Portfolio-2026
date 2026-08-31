# Portfolio 2026 — Development Plan

**Owner:** Aayush Yadav (アーユシュ)
**Goal:** A bilingual (EN / JA) personal portfolio that replicates the design of
`project-uncensored.site` one-to-one, runs entirely on free tiers, loads fast,
is fully responsive, has a working contact system, and is architected so
Three.js can be added later without a rewrite.
**Primary purpose:** support the Japan job search — this site is a hiring
artifact, so it has to load fast on a recruiter's phone and read cleanly in
Japanese.

---

## 0. Decisions locked in

| Question | Decision |
|---|---|
| Fidelity | **Pixel-perfect clone first**, content swapped in later |
| Contact backend | **Resend (email) + Supabase (stores every submission)** |
| Content | **Placeholders first** in both languages, real copy later |
| Hosting | **Vercel free tier**, custom domain attached later |
| Three.js | Not now — but architecture must leave a clean seam |

---

## 1. Tech stack

### Core

| Concern | Choice | Why this one |
|---|---|---|
| Framework | **Next.js 15+ (App Router, RSC)** | Same as the reference. Server Components mean most of the page ships zero JS, which is where the speed comes from. Best-in-class on Vercel free tier. |
| Language | **TypeScript**, `strict: true` | Non-negotiable for a portfolio a hiring manager may read. |
| Styling | **Tailwind CSS v4** | The reference is Tailwind v4. v4's CSS-first config (`@theme`) maps our eight design tokens directly to CSS variables — no JS config file, no runtime cost. |
| Variants | **CVA** (`class-variance-authority`) + `tailwind-merge` | Keeps `BracketButton`/`StatusBadge` variants type-safe instead of string soup. |
| Package manager | **pnpm** | Fast, strict, disk-efficient. |
| Linting | **Biome** (or ESLint + Prettier if you prefer familiar) | Biome is one binary, ~20× faster, does lint + format. |

### Feature layers

| Concern | Choice | Notes |
|---|---|---|
| i18n | **next-intl** | Best App Router integration. `/en` and `/ja` routes, typed message keys, server-side — no client-side translation bundle. |
| Fonts | **`next/font/local`** | Geist Mono + a pixel display face, self-hosted and subset. Zero layout shift, no Google Fonts round-trip. |
| Motion | **CSS first; `motion` (Framer Motion successor) only where CSS can't** | The reference uses almost no JS motion. Every animation added is a tax on the "super fast" requirement. |
| Forms | **react-hook-form + Zod** | Zod schema shared between client and server — one source of truth for validation, localised error messages. |
| Email | **Resend + React Email** | 3,000 emails/month free, 100/day. React Email gives a decent-looking notification instead of a plaintext blob. |
| Submission storage | **Supabase Postgres** | Free tier. Every submission is inserted before the email is sent, so a Resend outage never loses a lead. RLS on, insert-only via service role in the server action. |
| Rate limiting | **Upstash Redis** (`@upstash/ratelimit`) | Free tier, edge-compatible. Without it your contact form is a spam relay. |
| Analytics | **Vercel Analytics** (free) or **Umami Cloud** | Privacy-friendly, no cookie banner needed. |
| Content layer | **Typed TS/JSON objects, per locale** | No CMS. A portfolio's content changes monthly, not daily — a CMS is unjustified weight. Upgrade path: Contentlayer/MDX if project write-ups get long. |

### Deferred (architected for, not built yet)

| Concern | Choice | Seam |
|---|---|---|
| 3D | **react-three-fiber + drei + three** | Every 3D piece lives behind `next/dynamic(..., { ssr: false })` inside a `<CanvasSlot>` wrapper that renders a static poster image as fallback. Nothing in the layout depends on the canvas existing. |
| Dark mode | **CSS custom properties + `next-themes`** | Tokens must be **semantic** (`--color-bg`, `--color-ink`) not literal (`--color-white`), and defined once per theme in `:root` / `:root[data-theme="dark"]`. Do this during the stage-2 re-base or dark mode becomes a second re-base later. |
| Design polish | **Claude Design canvas + inline SVG** | Stage 13. Sections get mocked as artboards before any component is written; evidence diagrams are hand-authored inline SVG in the existing hairline idiom, never an imported charting library. |
| Animation | **Motion** (`motion/react`, the Framer Motion successor) | Loaded only in the leaf components that animate. CSS handles everything it can first; Motion is for orchestration CSS genuinely can't express. |

### Explicitly rejected

- **A UI kit (shadcn/MUI/Chakra)** — the reference has no rounded corners, no
  shadows, no default component look. A kit would be fought, not used.
- **A CMS (Sanity/Contentful)** — free tiers, but adds a network hop and a
  second place to keep bilingual content in sync.
- **A separate backend (Express/FastAPI)** — Next.js server actions cover the
  entire contact flow. A second service is another thing to deploy and pay for.

---

## 2. Repository layout

```
portfolio/
├── docs/
│   ├── PLAN.md            ← this file
│   ├── PROGRESS.md        ← live state, updated every session
│   ├── DECISIONS.md       ← append-only log of why things changed
│   └── DESIGN-SPEC.md     ← reference teardown, ground truth for the clone
├── messages/
│   ├── en.json
│   └── ja.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── opengraph-image.tsx
│   │   ├── api/            (only if a route handler is genuinely needed)
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── primitives/     SectionShell, CornerMarks, Eyebrow, Counter,
│   │   │                   BracketButton, StatusBadge, CheckItem
│   │   ├── sections/       Intro, About, Experience, Skills, Projects, Contact
│   │   └── three/          CanvasSlot + (later) scenes
│   ├── content/            en.ts / ja.ts — typed content objects
│   ├── lib/                schemas, resend, supabase, ratelimit, utils
│   └── styles/globals.css  @theme tokens
├── public/
│   ├── fonts/
│   └── images/             AI-generated assets, pre-optimised
└── ...config
```

**The rule that keeps this scalable:** `components/sections/*` may only read
from `content/*` and render `components/primitives/*`. No section owns a colour,
a font size, or a spacing value — those live in `@theme`. This is what makes the
"clone first, personalise later" plan actually work: swapping content never
touches layout code.

---

## 3. Stages

Each stage has a **Definition of Done**. Do not start stage N+1 until stage N's
DoD is met and `PROGRESS.md` is updated. Every stage ends with a git commit
and a Vercel preview deploy.

---

### Stage 0 — Foundation
*Estimate: 1 session*

- Install/verify Node 20+ LTS, pnpm, git on the laptop.
- `pnpm create next-app` — TypeScript, Tailwind, App Router, `src/`, no ESLint
  (Biome instead).
- Add Biome, `.editorconfig`, strict `tsconfig`, path aliases (`@/*`).
- `git init`, push to a **public** GitHub repo (recruiters will look at it —
  commit history is part of the portfolio).
- Connect the repo to Vercel. Confirm a preview deploy builds.
- Create `docs/` and drop these four files in.

**DoD:** a bare page is live on a `.vercel.app` URL, pushed from a clean repo.

---

### Stage 1 — Design system
*Estimate: 1 session*

- `globals.css` `@theme` block: the eight colour tokens, spacing scale, the
  mono/display font variables from `DESIGN-SPEC.md`.
- Self-host both fonts via `next/font/local`; subset aggressively.
  **Japanese needs a separate subset** — do not load a full CJK face; use
  `Noto Sans Mono CJK JP` subset or a variable JA mono, loaded only on `/ja`.
- Build every primitive in `components/primitives/` in isolation.
- A `/dev/kitchen-sink` route (excluded from sitemap, `noindex`) rendering
  every primitive in every state.

**DoD:** kitchen-sink page renders all primitives; a colour or font change in
`@theme` propagates everywhere with zero component edits.

---

### Stage 2 — Pixel-perfect clone *(built against a wrong spec — see Stage 2R)*
*Estimate: 3–4 sessions*

- Build all six `SectionShell` sections with the **reference's own copy**,
  hard-coded. Content correctness is not the point yet; geometry is.
- Section 00: terminal hero with typewriter + blinking caret.
- Section 01 / 04: accordion rows with `[+]`/`[-]` and checklist reveal.
- Section 02: `001…006` timeline cards with status badges and date ranges.
- Section 03 / 05: rank bars with percentages.
- Corner marks, eyebrows, counters, footer sigils on every section.
- Scroll: natural document scroll (the reference does not hijack it — do not
  add scroll-jacking, it wrecks mobile and accessibility).

**DoD:** side-by-side screenshots at 1440px, 768px and 390px are visually
indistinguishable from the reference in layout, type scale, spacing and colour.

---

### Stage 2R — Re-base after the v3 teardown ★ current main goal
*Estimate: 1–2 sessions*

The v1/v2 `DESIGN-SPEC.md` was wrong: it described a dark site. The reference is
white (`<main class="bg-white">`), with a photographic hero and one dark
terminal panel. Stage 2 was built faithfully to a wrong spec. See
`docs/FIXES-STAGE2.md` for the full account and the ordered fix list.

- Invert the token layer to the real palette, **and make the tokens semantic
  while you are in there** — `--color-bg` / `--color-ink` / `--color-accent`,
  never `--color-white`. Stage 11 depends entirely on this.
- Build the photographic hero: background image, gradient fade to page colour,
  red pixel wordmark over it, dark terminal panel beneath.
- Centre headings and ledes; prose to `font-sans`, `max-w-xl`.
- Accordion: 14px bold red titles, two-column panel, animated disclosure.
- Timeline: `gap-px` hairline grid, not individually bordered cards.
- `BracketButton`: bare text CTA, no box.

**DoD:** side-by-side at 1440 / 768 / 390 is indistinguishable from the
reference — **verified by looking at both, not by comparing numbers.**

---

### Stage 3 — Responsive & interaction polish
*Estimate: 1–2 sessions*

- Breakpoint audit: 360, 390, 768, 1024, 1440, 1920, and an ultrawide check.
- Touch targets ≥ 44px; accordions usable one-handed.
- Keyboard: full tab order, visible focus rings, skip-to-content link.
- `prefers-reduced-motion` kills the typewriter and all transitions.
- Test on the actual phone, not just devtools.

**DoD:** no horizontal scroll at any width; the whole page is operable by
keyboard alone; reduced-motion is honoured.

---

### Stage 4 — Internationalisation
*Estimate: 1–2 sessions*

- `next-intl` with `[locale]` segment; `/en` and `/ja`, `/` redirects by
  `Accept-Language` with a manual override that persists in a cookie.
- Language switch in the header — a `[ EN / JA ]` bracket toggle, in-style.
- Typography rules for Japanese: no negative letter-spacing, line-height 1.8,
  `word-break: normal` + `overflow-wrap: anywhere`, and `<wbr>`-free layouts.
  **Japanese text is ~30–40% shorter in characters but taller in line count —
  every fixed-height card in stage 2 must be re-checked here.**
- `hreflang` alternates, per-locale metadata, per-locale OG images.

**DoD:** both locales render every section correctly with no clipped or
overflowing text; switching locale preserves scroll position.

---

### Stage 5 — Content remap
*Estimate: 2 sessions*

- Replace reference copy with the portfolio mapping from `DESIGN-SPEC.md` §6:
  INTRO / ABOUT / EXPERIENCE / SKILLS / PROJECTS / CONTACT.
- Realistic bilingual placeholders — real structure, real lengths, fake facts.
  Placeholders must be *plausible length* or stage 3's layout work is wasted.
- Content lives in `content/en.ts` and `content/ja.ts` behind one shared type,
  so a missing JA key is a compile error.
- Asset pipeline for the images you generate with OpenAI/Gemini: export at 2×,
  convert to AVIF + WebP, serve via `next/image` with explicit
  `width`/`height` and `priority` only on the hero.

**DoD:** both locales are complete with placeholders; `content/*.ts` type-checks;
no image ships larger than 200KB.

---

### Stage 6 — Contact system
*Estimate: 1–2 sessions*

- Supabase project; `contact_submissions` table (`id`, `name`, `email`,
  `message`, `locale`, `ip_hash`, `created_at`); RLS enabled, **no** public
  insert policy — writes go through the server action with the service role key.
- Zod schema in `lib/schemas.ts`, shared client + server; error messages pulled
  from the i18n message catalogue.
- Server action: validate → rate limit (Upstash, 3/hour per IP hash) →
  honeypot check + time-to-submit check → insert to Supabase → send via Resend.
  **Insert before send**, so an email failure never loses the message.
- Resend: verify a sending domain (or use `onboarding@resend.dev` until the
  custom domain exists). React Email template.
- UI states: idle / submitting / success / error, all in the terminal aesthetic
  (`[ SENDING... ]`, `[ MESSAGE RECEIVED ]`, `[ TRANSMISSION FAILED — RETRY ]`).
- All secrets in Vercel env vars. Nothing prefixed `NEXT_PUBLIC_` except the
  Supabase anon key, which is not used here.

**DoD:** a real submission lands in both the Supabase table and your inbox;
a 4th submission within an hour is rejected; secrets appear in no client bundle.

---

### Stage 7 — Performance
*Estimate: 1 session*

Budgets (enforced, not aspirational):

| Metric | Target |
|---|---|
| LCP (mobile, Slow 4G, 4x CPU) | < 1.5s |
| CLS | < 0.05 |
| INP | < 200ms |
| **App code** (first load, gzipped) | **< 15KB** |
| Total first-load JS (gzipped) | < 120KB |
| Lighthouse Performance | ≥ 95 mobile |

**Why the JS budget is split.** The original single figure was 90KB, which is
below the floor: an empty page in this stack (`/_next-found`) already ships
~104KB of React 19 and Next 15 App Router runtime, and nothing short of leaving
the framework changes that. A budget that can never pass is not enforcement, it
is noise — CI would fail on every commit for a reason no commit caused.

So the number that binds is **our own code**, currently ~7KB, capped at 15KB.
That catches the regression the budget exists to catch — a careless dependency,
an accidental `"use client"` — while the framework baseline is recorded as a
constant rather than pretended away. The total is kept as a secondary ceiling
so the two together still describe the real page weight.

- Audit which components actually need `"use client"` — every one that doesn't
  is free speed. Push interactivity to the smallest possible leaf.
- Font subsetting check; `font-display: swap`; preload the display face only.
- `@next/bundle-analyzer` — find and cut anything unexpected.
- Lighthouse CI in GitHub Actions, failing the build on budget regression.

**DoD:** all budgets met on a throttled mobile run; CI enforces them.

---

### Stage 8 — SEO, accessibility, analytics
*Estimate: 1 session*

- Per-locale metadata, canonical + `hreflang`, `sitemap.ts`, `robots.ts`.
- JSON-LD `Person` schema (name in both scripts, `jobTitle`, `knowsLanguage`,
  `sameAs` → GitHub/LinkedIn). This is what makes you findable by name.
- Dynamic OG images via `opengraph-image.tsx`, per locale.
- axe / Lighthouse a11y pass → WCAG 2.1 AA. Contrast check the `--fg-dim` text
  against `#0a0a0a` — dim mono on near-black is the most likely AA failure.
- Vercel Analytics + Speed Insights enabled.

**DoD:** Lighthouse ≥ 95 across Performance, Accessibility, Best Practices, SEO,
in both locales.

---

### Stage 9 — Launch
*Estimate: 1 session*

- Production deploy; verify env vars are set for production, not just preview.
- Attach the custom domain when purchased; force HTTPS; verify Resend DNS
  (SPF/DKIM) on that domain.
- Cross-browser: Safari iOS, Chrome Android, Firefox. Safari is where the
  monospace metrics and `min-h-screen` will bite (use `100dvh`, not `100vh`).
- 404 page in-style. Uptime check (free tier of any monitor).
- Add the URL to your resume, LinkedIn, GitHub profile and agency profiles.

**DoD:** live on the real domain, contact form verified in production, no
console errors.

---

### Stage 10 — Three.js (later)
*Estimate: 2+ sessions, whenever*

- `react-three-fiber` + `drei`, dynamically imported, `ssr: false`.
- Render inside `<CanvasSlot>` which already exists from stage 1 and currently
  renders a static poster. Nothing else in the layout changes.
- Guards: skip the canvas entirely on `prefers-reduced-motion`, on
  `navigator.hardwareConcurrency <= 4`, and on `saveData`.
- Re-run the stage 7 budgets. If the canvas costs more than 40KB gz or drops
  LCP below target, it does not ship.

**DoD:** stage 7 budgets still met with the canvas enabled.

---

### Stage 11 — Dark mode
*Estimate: 1 session — if stage 2R did the tokens properly*

The reference has no dark mode; this is ours. It is also the single cheapest
feature on this list, provided stage 2R left semantic tokens behind.

- `next-themes` with `attribute="class"` or `data-theme`, `defaultTheme="system"`,
  `disableTransitionOnChange` so switching doesn't animate every colour at once.
- Define the dark palette as a **token override block only** — one
  `:root[data-theme="dark"] { ... }` redefining the same names. No component
  changes. If a component needs editing to support dark mode, its colour was
  hard-coded and that is the bug.
- Three states, not two: an explicit choice sets the attribute; the default
  "system" sets nothing and is resolved by `prefers-color-scheme`. Handle the
  un-stamped case or the page renders one theme's text on the other's ground.
- Suppress the flash of wrong theme with the blocking inline script
  `next-themes` provides.
- The hero image needs a dark treatment — either a second asset or a
  `mix-blend-mode` / brightness filter. Check it in both themes.
- Toggle in the section header, in-style: `[ ☀ / ☾ ]` as a bracket control.
- Re-run the contrast audit from stage 8 in **both** themes.

**DoD:** every section legible in light, dark and system; no flash on load;
zero component-level colour edits were needed.

---

### Stage 12 — Motion system (GSAP) ★ next
*Estimate: 1–2 sessions. Brief: `docs/STAGE12-MOTION.md`*

**Use GSAP.** An earlier version of this brief recommended vanilla JS and no
library. That is **withdrawn** — see `docs/REFERENCE-B-TEARDOWN.md`. The motion
target moved to Stage 15's level (pinned scroll sequences, scrubbed timelines,
per-character splitting), and hand-rolling that is worse in every way than the
library the whole field already uses. Building vanilla now and rewriting in GSAP
later is pure waste.

Install **GSAP + ScrollTrigger + SplitText**. GSAP became 100% free including
every plugin in 2025, so there is no licence cost. Budget: ~23KB + ~11KB + ~5KB
gz ≈ **40KB**. The browser-visible first-load ceiling is **120KB gzipped**:
Next 15 + React 19 alone cost about 101KB, leaving roughly 19KB for eager app
code. GSAP is therefore dynamically loaded after `load`; only its small loader
seam is in the initial route. Register only the plugins actually used, and keep
every animated component a client leaf.

Five effects, in build order:

- **A. Text scramble on headings.** Characters cycle and resolve on entry.
  ~20 lines, highest impact per byte on the list — on a monospace-and-pixel
  site it reads as native rather than applied. **Latin headings only**;
  cycling random kana or kanji looks like a rendering fault, so `ja` fades in.
- **B. Number count-up** on the four RESULTS figures. `tabular-nums`, width
  reserved before animating. These numbers are the argument the page makes.
- **C. Hairline draw-in** on section rules — `scaleX(0) → scaleX(1)`,
  `transform-origin: left`, staggered ~40ms. Never animate `width`.
- **D. Cursor crosshair**, CAD-reticle style. `pointer: fine` only,
  `translate3d` inside rAF, `aria-hidden`, off under reduced motion.
- **E. Scroll-linked section counter** — one observer, `rootMargin: -50%`.
  Turns `01 / 06` from decoration into information.

A boot sequence on first load is documented in the brief and **recommended
against** — it fits the concept and is the item most likely to irritate a
recruiter opening the site from a phone between meetings.

Ground rules: each effect lives in the smallest possible client leaf; every one
checks `prefers-reduced-motion` and renders its finished state; `transform` and
`opacity` only; nothing animates above the fold on first paint.

**DoD:** all five live; initial first-load JS remains under the 120KB total gate
and app code under 15KB; stage 7 budgets pass; the page is complete and
readable with motion disabled.

---

### Stage 13 — Design enhancement
*Estimate: 3–4 sessions. Brief: `docs/STAGE13-DESIGN.md`*

Runs last, because it needs everything else to exist: you cannot polish content
you do not have, every addition has to survive both themes, and several use
Motion from stage 12.

The site currently reads flat, and the reason is structural rather than
decorative. It is a clone, so every decision in it was fitted to someone else's
argument; the reference rests on one strong gesture that works for a manifesto
and goes hollow under dense factual content; six identically-framed viewport
sections produce monotony; and there is not one image or diagram on a portfolio
belonging to someone who builds map applications and retrieval systems.

Six directions, in priority order — full detail in the brief:

- **A. Break the rhythm.** Vary density between sections deliberately. Dense and
  wide for EXPERIENCE, asymmetric for PROJECTS, calm bookends at INTRO and
  CONTACT. Contrast between sections, not effects added to all of them.
- **B. Show the work.** Every project gets a visual — a screenshot, or where
  client work forbids it, a real architecture diagram as inline SVG in the
  hairline-and-mono idiom. Highest-value item on the list.
- **C. Make the numbers the hero.** 1,400 hours/year, two months to production,
  days to under an hour, 40% perceived latency. Currently buried in accordion
  body text; they belong in the pixel display face.
- **D. One signature interaction.** Exactly one, drawn from his own subject
  matter — a hero query box that answers questions about his experience, or a
  scroll-driven map reveal. Two signatures is the same as none.
- **E. Depth without breaking the flat plane.** Sticky pinned headers, a
  cursor-reactive hairline grid, slow parallax on the hero photograph only.
- **F. Japanese as a design element.** Vertical `writing-mode` section rails or
  paired EN/JA headings. The item most likely to make a Japanese hiring manager
  remember the site, and true to him rather than borrowed.

Guardrails, all inherited and none negotiable: stage 7's budget still binds
(diagrams are inline SVG, not a charting library); every addition checked in
light, dark and system, and in both locales at 360 and 768; everything in D and
E disables under reduced motion; new components read tokens and introduce no
hard-coded colours; diagrams carry real `<title>`/`<desc>`.

Mock the four changed sections on a design canvas before writing component code.
Build A first and re-measure — if breaking the rhythm alone fixes the complaint,
B and C may be all that is left worth doing. One direction per commit so any of
them can be reverted alone.

**DoD:** the four changed sections read as composed rather than uniformly
framed; every project shows evidence; the four numbers land in a fifteen-second
skim; stage 7's budgets still pass in both themes and both locales.

---

### Stage 14 — Hero shader portrait
*Estimate: 2–3 sessions. Briefs: `docs/REFERENCE-B-TEARDOWN.md`, `docs/STAGE14-3D-MOTION.md`*

**The Three.js framing was wrong.** Reference B's hero — the effect that prompted
this — contains no Three.js at all. It is one photograph run through a WebGL
fragment shader (Unicorn.studio), with displacement and noise driven by time and
cursor. Nothing in it needs a scene graph, a camera or lighting, which means the
150KB budget conflict that dominated the old brief does not apply.

Three routes, cheapest first:

1. **Raw WebGL, one shader** — a fullscreen quad sampling the portrait texture.
   ~5KB hand-written, no dependency. Most control, most work.
2. **OGL** (~10KB gz) — minimal WebGL wrapper. Sensible middle ground. *Recommended.*
3. **Unicorn.studio** — what the reference uses. Fastest, visual editor, but a
   hosted third-party runtime carrying the most prominent element on the page.

The point-cloud canvas preview already built stays a live alternative — both are
"photograph plus GPU effect". Pick one after seeing the real photograph in each.

Unchanged from the old brief: the poster image stays the LCP element, the canvas
mounts after `load`, and four kill switches (`prefers-reduced-motion`,
`saveData`, `hardwareConcurrency <= 4`, no WebGL) leave the poster as the final
state. The hero needs a focal point and a calm zone where the wordmark sits.

**DoD:** first-load JS under 120KB and LCP under 1.5s with the canvas disabled;
hero has a focal point; site complete with every kill switch tripped.

---

### Stage 15 — Advanced motion
*Estimate: 2–3 sessions. Brief: `docs/REFERENCE-B-TEARDOWN.md`*

The scroll craft that makes reference B feel expensive. All of it is GSAP +
ScrollTrigger, installed back at Stage 12.

- **Pinned scroll sequences** — a section holds while its content advances.
  `pin` + `scrub`. Single biggest perceived upgrade on this list.
- **Per-character and per-line reveals** via SplitText, superseding the
  hand-rolled scramble. Latin only — `ja` still fades.
- **Scrubbed hero parallax** — shader displacement driven by scroll position,
  not only time.
- **Flip transitions** where a card expands or a layout regroups.
- **Magnetic cursor** on the bracket controls.
- **A live Tokyo clock** in the header — small, honest, and pointed at the
  audience this site is for.
- **View Transitions API** for locale and theme switches — the framework-native
  answer to what Barba does for a Webflow site.

Not taken from the reference: Barba (multi-page tool, wrong for App Router) and
Lenis smooth scroll — *possible, but it reverses the logged "no scroll-jacking"
decision, so it goes in as a deliberate reversal or not at all.*

**DoD:** every effect disables under reduced motion; nothing animates above the
fold on first paint; both themes and locales re-checked at 360 and 768; stage 7
budgets still pass.

---

## 4. Working rhythm

1. Start each session by reading `docs/PROGRESS.md`.
2. Pick the single next unchecked item.
3. Do it, commit with a message referencing the stage (`stage2: timeline cards`).
4. Tick it in `PROGRESS.md`, add a line to `DECISIONS.md` if a choice changed.
5. Push. Check the Vercel preview.

Never leave a session without updating `PROGRESS.md`. That file is the memory.

## 5. Risks

| Risk | Mitigation |
|---|---|
| Japanese text breaks the cloned layout | Stage 4 exists specifically for this; avoid fixed heights in stage 2 |
| The pixel display font has no CJK glyphs | JA headings fall back to a mono CJK face — decide this in stage 1, not stage 4 |
| Cloning too literally reads as derivative to a hiring manager | Stage 5 remaps content and stage 3/4/6 add real substance the reference lacks |
| Free-tier limits (Resend 100/day, Supabase pause on inactivity) | Rate limiting from day one; a monthly ping keeps Supabase awake |
| Scope creep into Three.js before the site ships | Stage 10 is last, and gated on the performance budget |
| A spec written from measurements rather than from looking | This already happened once — it cost stage 2. Every visual DoD from here is confirmed by viewing both pages, not by diffing numbers |
| Dark mode turning into a second re-base | Tokens go semantic during stage 2R, before any more components are written |
| Motion bloating the bundle after stage 7 passed | Stage 12 re-runs the budget; `LazyMotion`, leaf-only imports, CSS first |
| Stage 13 turning into decoration for its own sake | Its brief diagnoses *why* the page reads flat and prescribes against that. Build direction A first and re-measure before doing the rest |
| Client work making project screenshots impossible | Architecture diagrams instead — they say more about engineering level than a screenshot anyway |
