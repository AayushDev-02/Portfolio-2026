# DESIGN SPEC — Reference Teardown

> Source: https://www.project-uncensored.site/ — inspected 2026-08-28.
> This file is the ground truth for the visual clone. Update it only when the
> reference is re-inspected, never to describe what we built.

## 1. Detected stack (reference)

| Layer | Finding |
|---|---|
| Framework | Next.js (App Router, Turbopack build — `/_next/static/immutable/chunks/*`) |
| Styling | Tailwind CSS v4 (utility classes + `oklab()` / `lab()` computed colors) |
| Fonts | `Geist Mono` (body/UI) + `minecraft` pixel display face (headings) |
| Motion | No Framer Motion global; CSS transitions + scroll-driven state |
| Canvas / WebGL | None (0 `<canvas>` elements) |
| i18n | None — single-language `<html lang="en">` |
| Page shape | 6 × full-viewport `<section>` elements, one document, natural scroll |

## 2. Color tokens

Converted from computed values. Use these as CSS custom properties.

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0a0a0a` | Page background |
| `--fg` | `#ededed` | Primary text |
| `--fg-dim` | `rgb(115 115 115)` (neutral-500) | Secondary/meta text |
| `--fg-faint` | `neutral-500 / 60%` | Corner marks, hairline labels |
| `--accent` | `#e5484d`-class red (`lab(48.4 77.4 61.5)`) | Status, active state, CTA |
| `--accent-soft` | `oklab(0.577 0.218 0.112 / 0.8)` | Accent on dark fills |
| `--rule` | `neutral-500 / 20%` | All borders and dividers |
| `--surface` | `#000000` | Inset panels, code blocks |

Rule: **only these eight.** The reference gets its polish from restraint, not
from a palette.

## 3. Typography

| Role | Face | Size | Tracking | Notes |
|---|---|---|---|---|
| Display heading | pixel face | 48px desktop | `-1.2px` | line-height 1.0 (48px) |
| Section eyebrow | mono | 12px | `+0.1em` | uppercase, e.g. `00 — INTRO` |
| Counter | mono | 12px | `+0.1em` | `01 / 06`, right-aligned |
| Body | mono | 16px | normal | max-width ~65ch |
| Row label | mono | 16px | normal | inside `[+] / [-]` toggles |
| Micro-label | mono | 10–12px | `+0.12em` | uppercase footers |

Everything is monospace except the pixel display face. No serif, no sans.

## 4. Layout system

```
<section class="relative flex min-h-screen w-full flex-col
                border-b border-[--rule]
                px-6 py-10 sm:px-12 sm:py-14">
```

- **Section**: `min-h-screen`, flex column, bottom hairline border.
- **Padding**: 24px / 40px mobile → 48px / 56px from `sm`.
- **Corner marks**: four absolutely-positioned `+` glyphs at 12px,
  inset 24px from each corner, colored `--fg-faint`. Present on every section.
- **Header row**: eyebrow left (`00 — INTRO`), counter right (`01 / 06`).
- **Footer row**: a short uppercase caption + a 2–3 letter section sigil
  (`WHY`, `PH`, `DONE`, `IG`, `LOG`) pinned bottom-right.
- **Corners**: `border-radius: 0` everywhere. No shadows. No gradients.

## 5. Component inventory (what we must build)

| Component | Behaviour |
|---|---|
| `SectionShell` | min-h-screen frame + corner marks + eyebrow + counter + footer slot |
| `CornerMarks` | 4 × `+`, decorative, `aria-hidden` |
| `Eyebrow` / `Counter` | mono micro-labels |
| `AccordionRow` | `[+]` / `[-]` prefix, 36px/24px padding, expands to a checklist |
| `CheckItem` | `[x]` / `[ ]` prefix + label |
| `StatusBadge` | `[DONE]` / `[IN PROGRESS]` / `[UPCOMING]` |
| `TimelineCard` | `001` index + status + title + checklist + date range |
| `RankBar` | `01. label` + right-aligned `%` + hairline fill bar |
| `TerminalHero` | `>` prompt with typewriter text, blinking caret |
| `BracketButton` | `[ GET NOTIFIED → ]` — text-only, no fill, hover inverts |

## 6. Section-by-section map (reference → portfolio)

| # | Reference | Our portfolio | Content shape reused |
|---|---|---|---|
| 00 | INTRO | INTRO | Terminal hero, typewriter tagline, status line |
| 01 | PHILOSOPHY | ABOUT | Accordion rows → who I am / how I work / what I'm looking for |
| 02 | STATUS | EXPERIENCE | Timeline cards `001…00n` with `[DONE]` / `[CURRENT]` roles |
| 03 | RESULTS | SKILLS | Rank bars → proficiency by stack, with honest percentages |
| 04 | FEEDBACK | PROJECTS | Accordion rows → project write-ups + pull-quote + numbered takeaways |
| 05 | HISTORY | CONTACT | Decision log → contact form + links + availability |

## 7. Things to improve over the reference

The clone is the baseline, not the ceiling. These are deliberate deviations:

1. **Two languages** — the reference is English-only. Our type scale must
   survive Japanese (no letter-spacing on JA text, different line-height).
2. **Accessibility** — reference accordions are `<button>`s but the checklist
   semantics are weak. We ship real `aria-expanded`, focus rings, skip link.
3. **Reduced motion** — typewriter and scroll effects must respect
   `prefers-reduced-motion`.
4. **Working contact** — the reference's CTA is a stub. Ours actually sends.
