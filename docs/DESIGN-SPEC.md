# DESIGN SPEC — Reference Teardown (v3)

> Source: https://www.project-uncensored.site/ — re-inspected 2026-08-28,
> **this time by actually looking at the rendered page**, not only by reading
> computed styles.
>
> v1 and v2 were both wrong about the most basic fact on the page. See
> `FIXES-STAGE2.md` § "Why this happened". v3 supersedes both.

## 0. The headline correction

**The reference is a WHITE site.** `<main class="bg-white">`.

v1 and v2 recorded `body { background-color: #0a0a0a }` and built an entire
dark design system on it. That rule is real, but `<main>` paints white over it,
so the black is never visible except through one element: the terminal panel in
the hero. Everything downstream — "eight tokens", "ghost type", `--color-fg:
#ededed` — was an inversion of the actual design.

## 1. Stack

Next.js App Router (Turbopack) · Tailwind CSS v4 · Geist Mono + a pixel face
("minecraft") · **one raster hero image**, no WebGL · no i18n ·
6 × `min-h-screen` sections, natural scroll.

## 2. Colour

| Token | Value | Used for |
|---|---|---|
| `--color-bg` | `#ffffff` | The page. `<main class="bg-white">` |
| `--color-ink` | `gray-800` `#1f2937` | Section headings, primary dark text |
| `--color-ink-deep` | `gray-900` / `#000` | Timeline indices, status badges |
| `--color-prose` | `gray-600` `#4b5563` | Lede paragraphs |
| `--color-accent` | `red-600` `#dc2626` | Eyebrows, counters, accordion titles, `[x]` marks, active timeline index, rank bars, CTA |
| `--color-rule` | `gray-500 / 20%` | Every hairline |
| `--color-terminal-bg` | `#0a0a0a` | **Only** the hero terminal panel |
| `--color-terminal-fg` | `#ededed` | Text inside that panel |

Red is not a small accent here — it carries the eyebrows, every accordion title,
every checkmark, the rank bars and the CTA. Dark ink is for headings and body.

## 3. The hero (section 00)

This is the piece the clone is missing entirely:

- **Full-bleed background image** — a blurred, grainy monochrome portrait.
  `/images/bg.png` desktop, `/images/bg-mobile.png` mobile, served through
  `next/image`, `object-cover`, `scale-110 sm:scale-100`.
- A gradient over the lower third: `bg-linear-to-b from-transparent to-white`,
  fading the photo into the white page.
- The **red pixel wordmark** sits over the photo, `text-5xl sm:text-7xl`,
  bold, uppercase.
- Below it, a **solid `#0a0a0a` terminal panel** — the only dark box on the
  site — containing the red micro status line and the `>` prompt with caret.

You will need to generate an equivalent portrait/abstract image with
OpenAI or Gemini. Blurred, high-grain, monochrome, high contrast.

## 4. Typography

| Role | Face | Size (→ sm) | Weight | Tracking | Colour | Align |
|---|---|---|---|---|---|---|
| Hero wordmark | pixel | 48 → **72px** | 700 | tight | **red-600** | over photo |
| Section heading | pixel | 36 → **60px** | 700 | tight | gray-800 | **centred** |
| Lede paragraph | **sans** | 16 → 18px | 400 | normal | gray-600, `leading-6`, **`max-w-xl`**, `text-balance` | **centred** |
| Eyebrow / counter | mono | **11px** | 400 | **0.2em** | red-600 (intro: gray-800) | — |
| Accordion title | mono | **14px** | **700** | normal | **red-600** | left |
| Checklist `[x]` + label | mono | 12 → 14px | 400 | normal | mark red-600, label gray-800 | left |
| Timeline index `001` | pixel | 36 → 48px | 700 | — | black; **red-600 when active** | left |
| Status badge `[DONE]` | mono | 9 → 10px | 700 | `tracking-widest` | gray-900; red when in progress | — |
| Micro / status line | mono | 10px | 400 | `tracking-widest` | red-600 / 80% | — |
| CTA `[ Get notified → ]` | mono | 12px | 700 | `tracking-widest` | red-600, **no box** | centred |

There is **no single body size.** Nine distinct roles, 9px to 72px.

## 5. Layout

```
section: relative flex min-h-screen w-full flex-col border-b
         px-6 py-10  sm:px-12 sm:py-14
```

- **Corner marks**: four `+`, 12px, inset 24px.
- **Section head/foot**: eyebrow left + counter right; caption left + sigil right.
- **Headings and ledes are centred**; the content blocks below them are not.
- **Timeline cards**: `grid grid-cols-1 gap-px border-x border-gray-500/20
  bg-gray-500/20 sm:grid-cols-3` — the grid's own background shows through the
  1px gaps as shared hairlines. Cards are *not* individually bordered.
- **Accordion button**: `px-6 py-9 sm:px-12 sm:py-11`.
- **Accordion panel**: `grid grid-cols-1 gap-x-8 gap-y-4 px-6 pb-10 pl-15
  sm:grid-cols-2` — two-column checklist at `sm`.
- **Accordion animation**: `grid-rows-[0fr]` → `grid-rows-[1fr]` + opacity,
  `transition-all duration-300 ease-in-out`.
- **CTA**: bare text, no border, no padding.
- Zero border-radius, no shadows.

## 6. Measured geometry @ 1280×800

Document 5955px · sections **800 · 1292 · 1004 · 826 · 1232 · 800**

## 7. Section map (reference → portfolio)

| # | Reference | Ours |
|---|---|---|
| 00 | INTRO | INTRO |
| 01 | PHILOSOPHY | ABOUT |
| 02 | STATUS | EXPERIENCE |
| 03 | RESULTS | SKILLS |
| 04 | FEEDBACK | PROJECTS |
| 05 | HISTORY | CONTACT |

## 8. Deliberate deviations

Two languages · real disclosure semantics · reduced-motion support ·
a contact form that sends. **Dark mode is now a deviation, not the base** —
if you want the dark look, it is a second theme layered on this one, not the
default.
