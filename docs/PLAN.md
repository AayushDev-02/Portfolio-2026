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

### Stage 2 — Pixel-perfect clone ★ current main goal
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
| LCP (mobile, 4G) | < 1.5s |
| CLS | < 0.05 |
| INP | < 200ms |
| Client JS (first load) | < 90KB gzipped |
| Lighthouse Performance | ≥ 95 mobile |

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
