# REFERENCE B — raviklaassens.com

Inspected 2026-08-30 by reading the live page's scripts and DOM.

## The headline: there is no Three.js on that site

The hero is not a 3D model. It is **one photograph run through a WebGL shader**.

```
<div class="hero_unicorn-bg"
     data-us-project-src=".../unicorn/ravi_portrait.json"
     data-us-lazyload="true"
     data-parallax="target">
  <canvas>   <!-- WebGL 2.0 -->
</div>
```

That `data-us-*` naming is **Unicorn.studio** — a hosted tool where you build a
shader visually, export a JSON scene, and their runtime renders it over an
image. The red bleed and the dissolving hair are displacement and noise applied
to a still portrait on the GPU. One image, one fragment shader.

This is good news. It is a far cheaper effect than a 3D scene, it is the same
family of technique as the point-cloud preview already built, and it means the
150KB Three.js budget problem in the old Stage 14 brief **does not apply**.

## Full stack

| Layer | What they use |
|---|---|
| Site platform | **Webflow** (CMS + hosting, `cdn.prod.website-files.com`) |
| Custom scripts | **Slater** (script hosting for Webflow) |
| Animation | **GSAP 3.15** + ScrollTrigger, SplitText, Flip, CustomEase, Draggable, InertiaPlugin, Observer |
| Smooth scroll | **Lenis 1.1.5** |
| Page transitions | **Barba 2.10.3** |
| Hero WebGL | **Unicorn.studio** (`ravi_portrait.json`) |
| Media | hls.js (streamed video), Howler (audio) |
| Analytics | Umami |
| Type | Suisse Intl — a licensed commercial face |

GSAP is now **100% free including every plugin** — Webflow acquired it and
removed the paywall in 2025. SplitText, Flip, InertiaPlugin and the rest cost
nothing. That removes the main historical reason not to use it.

---

## What transfers, and what does not

### Transfers cleanly
- **The hero technique.** Shader over a photograph. Achievable without their
  tooling — see the Stage 14 options below.
- **GSAP + ScrollTrigger** for scroll-driven sequences. This is the actual
  answer to "advanced animations, not the simple ones".
- **SplitText** for per-character and per-line reveals.
- **Flip** for layout transitions when something changes position or size.
- **A live clock in the header.** Theirs shows CET. A Tokyo clock on a site
  aimed at Japanese employers is a small, honest, on-brand detail.

### Does not transfer
- **Webflow, Slater, Barba.** Barba exists to animate between full page loads on
  a multi-page site. This portfolio is one page on Next.js App Router — Next has
  its own navigation model and the View Transitions API covers the rest. Barba
  would fight the framework.
- **Lenis smooth scroll** — *possible, but it reverses a decision already made.*
  `DECISIONS.md` records "no scroll-jacking: it breaks mobile momentum,
  keyboard navigation and accessibility for no visual gain." Lenis is a
  well-behaved implementation, but it is still overriding native scroll. If it
  goes in, that is a deliberate reversal that gets logged, not a quiet addition.
- **Suisse Intl.** Commercial licence, and the existing type system is already
  decided.
- **Howler / hls.js.** No audio, no streamed video on this site.

---

## The honest caution

The first reference was a project site. This one is **a named individual's
personal portfolio** — his face, his name, his positioning, built to sell his
own services. That is the case where borrowing is most likely to be noticed and
most costly.

The distinction that matters:

- **Techniques are craft and belong to everybody.** Shader displacement over a
  portrait, scroll-driven pinning, split-text reveals, magnetic cursors, a live
  clock in the corner — every studio uses these. Take them freely.
- **The specific composition is his identity.** The back-of-head portrait with
  the red bleed, the three-column word-menu, the exact hero sentence structure.
  Reproduce that and a designer in Tokyo who has seen his site will recognise it
  immediately — and the person most likely to have seen it is exactly the kind of
  person who might be interviewing you.

Take the second reference as a **capability benchmark** — this is the level of
motion craft to reach — not as a layout to copy. The first clone was defensible
because the content was swapped out and it was scaffolding. Doing it twice, on a
person rather than a project, reads differently.

---

## Revised staging

### Stage 12 — Motion system — **DECISION CHANGED**
The earlier brief recommended building the five effects with vanilla JS and no
library. **That recommendation is withdrawn.** If the target is now this level of
motion, the effects in Stage 15 need real orchestration — timelines, scrub,
pinning, per-character splitting — and hand-rolling that is worse in every way
than using the library everyone in this field already uses.

Install **GSAP + ScrollTrigger + SplitText** at Stage 12 and build the whole
motion system on it once. Doing the vanilla version first and rewriting it in
GSAP later is pure waste.

Budget: GSAP core ~23KB gz, ScrollTrigger ~11KB, SplitText ~5KB — roughly
**40KB gz**. Against a 90KB budget with app code at 11.7KB, that fits, but it
consumes most of the remaining headroom. Import only the plugins actually
registered, and keep every animated component a client leaf.

### Stage 14 — Hero shader portrait *(replaces the Three.js hero)*
Same target as the reference: one photograph, one fragment shader, displacement
and noise driven by time and cursor. Three routes, cheapest first:

1. **Raw WebGL / a single shader** — a fullscreen quad sampling the portrait
   texture. ~5KB of hand-written code, no dependency. Most control, most work.
2. **OGL** (~10KB gz) — a minimal WebGL wrapper. Sensible middle ground.
3. **Unicorn.studio** — what the reference uses. Fastest path, visual editor,
   but a hosted third-party runtime and an external dependency on someone else's
   service for the most prominent element on the page.

Recommended: **2**, falling back to 1 if the budget gets tight. Not Three.js —
nothing here needs a scene graph, a camera or lighting.

The point-cloud preview already built stays a live alternative. Both are
"photograph plus GPU effect"; pick one after seeing the real photo in each.

### Stage 15 — Advanced motion — *new*
The scroll craft that makes the reference feel expensive:

- **Pinned scroll sequences** — a section holds while its content advances.
  ScrollTrigger `pin` + `scrub`. This is the single biggest perceived upgrade.
- **Per-character and per-line reveals** on headings via SplitText, replacing
  the hand-rolled scramble if it is already built.
- **Scrubbed hero parallax** — the shader's displacement driven by scroll
  position, not just time.
- **Flip transitions** where a card expands or a layout regroups.
- **Magnetic cursor** on the bracket controls — the button pulls slightly
  toward the pointer.
- **A live Tokyo clock** in the header.
- **View Transitions API** for locale and theme switches — the framework-native
  answer to what Barba does for them.

Guardrails, unchanged: everything disables under `prefers-reduced-motion`;
nothing animates above the fold on first paint; both themes, both locales,
re-checked at 360 and 768; Stage 7's budget re-run after each addition.
