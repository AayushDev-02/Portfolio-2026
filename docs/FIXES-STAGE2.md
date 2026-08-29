# STAGE 2 — CORRECTIONS (v2 — supersedes the earlier version of this file)

## Why this happened

I built the original `DESIGN-SPEC.md` by probing the reference's DOM and
computed styles with JavaScript. I never looked at the rendered page —
screenshot capture was failing in my session, and instead of saying so and
stopping, I wrote the spec from numbers alone and presented it as a teardown.

Reading computed styles is good at exact values and blind to composition.
Specifically, it missed:

1. **The site is white.** `body` really does set `background: #0a0a0a`, and I
   read that as the page ground. But `<main class="bg-white">` paints over it.
   The black is visible in exactly one place — the terminal panel in the hero.
   The whole "dark, eight tokens, `#ededed` on `#0a0a0a`" system was an
   inversion of the actual design. Your build is a dark-mode version of a
   light site, which is why it feels wrong even though every measurement is
   close.
2. **The hero has a full-bleed photograph** — a blurred grainy monochrome
   portrait with a gradient fading it into the white page. I queried for
   `<canvas>`, found none, and concluded the page had no imagery. I never
   checked `<img>`.
3. **Headings and ledes are centred.** Alignment doesn't appear in the
   properties I sampled.
4. **The dark "ghost type" I described doesn't exist.** `text-gray-800` and
   `text-gray-900` aren't near-invisible — they're ordinary dark text on white.
   My v2 "ghost colour" analysis was an elaborate explanation of an artefact of
   my own error.

What the probing *did* get right: type sizes, tracking, padding, the `sm:`
scale, the accordion mechanics, `max-w-xl` on prose, sans-vs-mono, and the
per-role colour values. Those carry over into v3.

**This is my error, not yours.** You implemented the spec you were given.

---

## What to do

The token layer is inverted, so this is not a patch — it's a re-base. It is
still cheap, because every colour lives in one `@theme` block and no component
hard-codes one. That decision is what saves this.

### 1. Invert the ground — `src/app/globals.css`

```css
@theme {
  --color-bg:            #ffffff;   /* was #0a0a0a */
  --color-ink:           #1f2937;   /* gray-800 — headings, primary text */
  --color-ink-deep:      #111827;   /* gray-900 — badges, indices */
  --color-prose:         #4b5563;   /* gray-600 — lede paragraphs */
  --color-accent:        #dc2626;   /* red-600 */
  --color-rule:          rgba(107,114,128,.2);   /* gray-500/20 */
  --color-terminal-bg:   #0a0a0a;   /* ONLY the hero terminal panel */
  --color-terminal-fg:   #ededed;

  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;

  --text-badge:   0.5625rem;  --text-micro:   0.625rem;
  --text-eyebrow: 0.6875rem;  --text-label:   0.75rem;
  --text-ui:      0.875rem;   --text-prose:   1rem;
  --text-head:    2.25rem;    --text-hero:    3rem;

  --tracking-label: 0.2em;
}
```

Then `body { background: var(--color-bg); color: var(--color-ink); }` and
`<main class="bg-bg">`. Delete `--color-fg`, `--color-dim`, `--color-faint`,
`--color-ghost*` — they were built for the inverted page.

### 2. Build the hero

- Generate a blurred, grainy, high-contrast **monochrome portrait** with
  OpenAI or Gemini. Export ~1600px wide, convert to AVIF + WebP.
- `next/image`, `fill`, `object-cover`, `priority`, plus a separate
  narrower crop for mobile.
- Gradient over the lower third: `bg-linear-to-b from-transparent to-white`.
- Wordmark over the photo: `font-display text-hero sm:text-[4.5rem] font-bold
  uppercase text-accent`.
- Terminal panel below it: `bg-terminal-bg text-terminal-fg`, holding the red
  micro status line and the `>` prompt. **This is the only dark box on the site.**

### 3. Centre the headings and ledes

```
heading: font-display text-head sm:text-[3.75rem] font-bold uppercase
         text-ink tracking-tight text-center
lede:    font-sans text-prose sm:text-lg leading-6 text-prose
         max-w-xl text-balance text-center mx-auto
```

Your ledes currently measure **1329px wide** in GeistMono against the
reference's **576px** in sans. This is the largest single readability gap.

### 4. Accordion — `accordion-row.tsx`

- Title 16px/400 → **14px/700, `text-accent`**.
- Padding: add the `sm:` step, `px-6 py-9 sm:px-12 sm:py-11`.
- Panel: flex column → **`grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2`**,
  `pl-15 pb-10`.
- Replace `hidden` with the animated disclosure:

```jsx
<div className={`grid transition-all duration-300 ease-in-out
                 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
  <div className="overflow-hidden">{children}</div>
</div>
```

Keep `aria-expanded`/`aria-controls`; add `inert` when closed so collapsed
links leave the tab order.

### 5. Timeline grid — `timeline-card.tsx`

Cards are not individually bordered. The grid paints the hairlines:

```
grid grid-cols-1 gap-px border-x border-rule bg-rule sm:grid-cols-3
```

with each card `bg-bg`. Index: `font-display text-head sm:text-5xl font-bold
text-ink-deep`, and `text-accent` when that card is the active one.

### 6. Eyebrow / counter — `labels.tsx`

11px, tracking `0.2em`, `text-accent` — except the intro section, which is
`text-ink`. Drop `text-transform: uppercase`; the strings are already capitals.

### 7. `BracketButton`

The reference CTA is `font-mono text-xs font-bold tracking-widest text-accent
uppercase` — **no border, no padding, no box**. Keep a `boxed` variant if you
want one elsewhere, but the section CTA is bare text.

### 8. Smaller

- `CheckItem`: `text-xs sm:text-sm`; mark `text-accent`, label `text-ink`.
- `StatusBadge`: `text-badge sm:text-micro font-bold tracking-widest
  text-ink-deep`; `text-accent` for the in-progress one.
- `TerminalHero`: verify the `sr-only` duplicate is actually clipping — the
  page's `innerText` currently returns the prompt line twice.

---

## Acceptance check

Re-measure at 1280×800:

| | Reference | Yours before | Target |
|---|---|---|---|
| Document height | 5955 | 5757 | 5650–6250 |
| Section 01 | 1292 | 988 | 1190–1400 |
| Section 03 | 826 | 900 | 780–880 |

And the check the numbers can't make: **put the two pages side by side and
look at them.** That is what went wrong the first time.
