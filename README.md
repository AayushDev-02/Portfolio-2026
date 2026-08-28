# Portfolio 2026

Bilingual (EN / JA) personal portfolio for Aayush Yadav.
Design cloned from `project-uncensored.site`; content and systems are original.

---

## First run

The dependencies are **not** installed yet — the environment this was scaffolded
in has no npm access. Run this once:

```bash
pnpm install        # or: npm install
pnpm dev            # http://localhost:3000
```

If you don't have pnpm: `npm install -g pnpm`

Then check two pages:

| URL | What it proves |
|---|---|
| `/` | Stage 0 — the app builds and the design tokens are wired |
| `/dev/kitchen-sink` | Stage 1 — every primitive in every state |

Before committing anything: `pnpm check` (typecheck + lint).

If Biome complains about its config schema, run `pnpm dlx @biomejs/biome migrate --write`.

---

## Docs — read these first

1. **`docs/PROGRESS.md`** — where the project stands, what's next. **Start here every session.**
2. `docs/PLAN.md` — the eleven-stage plan, stack and rationale.
3. `docs/DESIGN-SPEC.md` — reference teardown: tokens, layout, component inventory.
4. `docs/DECISIONS.md` — why things are the way they are.

## Stack

Next.js 15 (App Router, RSC) · TypeScript strict · Tailwind CSS v4 · Biome ·
next-intl *(stage 4)* · Resend + Supabase + Upstash *(stage 6)* · Vercel ·
react-three-fiber *(stage 10)*

## The rule that keeps this scalable

`src/components/sections/*` may only read from `src/content/*` and render
`src/components/primitives/*`. **No section owns a colour, a font size, or a
spacing value** — those live in the `@theme` block in `src/app/globals.css`.

That is what makes "clone first, personalise later" work: swapping content at
stage 5 never touches layout code.

## Where things are

```
src/
├── app/
│   ├── globals.css              ← ALL design tokens live here
│   ├── layout.tsx
│   ├── page.tsx                 ← stage 0 placeholder; stage 2 replaces it
│   └── dev/kitchen-sink/        ← noindex; delete before launch
├── components/
│   ├── primitives/              ← the whole design system
│   └── three/canvas-slot.tsx    ← the Three.js seam (stage 10)
└── lib/
    ├── fonts.ts
    └── utils.ts
```

## Rhythm

Read `PROGRESS.md` → do the next unchecked item → commit → tick it → push.
**Never end a session without updating `PROGRESS.md`.**
