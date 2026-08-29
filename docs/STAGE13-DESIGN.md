# STAGE 13 — DESIGN ENHANCEMENT

Runs last, after Three.js (10), dark mode (11) and motion (12). Everything here
needs the site to be finished first: you cannot polish content you do not have,
enhancements have to work in both themes, and several of them use Motion.

## Why it reads bland — the diagnosis

This is worth being precise about, because "make it more modern" is not a brief
and will produce noise.

1. **It is a clone.** Every decision in it was made for someone else's content.
   Cloned designs always read slightly hollow, because the form was fitted to a
   different argument.
2. **The reference rests on one move.** Giant ghosted pixel headings, red used
   eight times, a photographic hero. That single gesture carries the whole page.
   It works there because the content is a manifesto — short, loud claims with
   air around them. A portfolio is dense and factual, and the same restraint
   reads as empty rather than confident.
3. **Six identical frames.** Same viewport height, same corner marks, same
   eyebrow, same centred heading, same hairline, six times. Nothing varies, so
   nothing stands out. Monotony is the actual complaint behind "bland".
4. **No evidence.** This is a portfolio for an engineer who built map
   applications, retrieval systems and document pipelines, and there is not one
   image, diagram or screenshot on it. Biggest miss on the page.

The fix is not more decoration. It is variation, evidence, and one thing that is
unmistakably his.

---

## The six directions

Do them in this order. A, B and C are the ones that matter; D, E and F are
upside.

### A. Break the rhythm
Stop making every section a full-viewport centred block. Vary density
deliberately:

- **INTRO and CONTACT** stay calm and full-bleed — they are the bookends.
- **EXPERIENCE** goes dense and wide. A near-tabular grid, hairline-ruled,
  more information per screen than anything else on the page. Density here
  reads as substance.
- **PROJECTS** goes asymmetric — offset columns, a wide first entry, uneven
  gutters. Not a uniform stack.
- **SKILLS** stays quiet. It is reference material, not an argument.

Rhythm comes from contrast between sections, not from adding effects to all of
them.

### B. Show the work — highest value on this list
Every project entry gets a visual. Where a screenshot is fine, use one. Where
client work makes that impossible, draw the **architecture** instead — the
retrieval pipeline, the map data flow, the PDF extraction stages — as inline
SVG in the existing hairline-and-mono idiom.

Two reasons this is the strongest item here. Engineers hire engineers who can
show how a system fits together, and a diagram of a RAG pipeline says more about
his level than any adjective. And it solves the bland problem structurally: the
page stops being an unbroken field of text.

Diagrams must be real. A generic boxes-and-arrows stock diagram is worse than
none.

### C. Make the numbers the hero
He has genuinely strong figures, and they are currently buried in accordion body
text where nobody will read them:

- **1,400 hours** of manual document work removed per year
- **~2 months** from sandbox to production
- **days → under an hour** for deck preparation
- **~40%** cut in perceived response time

Pull them out as large display figures in the pixel face. This is exactly what
that typeface is for, and it is the most legitimate way to use the reference's
strongest weapon on his own content. A recruiter skimming for fifteen seconds
should hit these numbers whether or not they open anything.

### D. One signature interaction — exactly one
The reference has its typewriter. This site needs one memorable thing that is
his, and it should come out of his actual subject matter:

- a working query box in the hero that answers questions about his experience —
  ties directly to the RAG work he does; or
- a map-tile reveal driven by scroll — ties to MapAI.

Pick one. Two competing signatures is the same as none, and each one costs
bundle size that Stage 7's budget has to absorb.

### E. Depth without breaking the flat plane
The reference is deliberately flat. Ways to add dimension that do not fight it:
sticky section headers that pin while content scrolls beneath; a hairline grid
overlay that responds faintly to the cursor; slow parallax on the hero
photograph only. Subtle. If it announces itself, it is too much.

### F. Japanese as a design element — the differentiator
He is bilingual and most portfolios in this market are not. Rather than treating
Japanese as a translation layer bolted on at Stage 4, make it visible design:
vertical `writing-mode: vertical-rl` section labels as a rail down one edge,
or paired EN/JA section headings where the second language sits as a smaller
line beneath the first.

This is the item most likely to make a Japanese hiring manager remember the
site, and it is true to him rather than borrowed. Handle it carefully — vertical
text has real layout and accessibility consequences, and it must degrade to
horizontal on narrow screens.

---

## Guardrails

Every one of these is subordinate to constraints already established:

- **Stage 7's performance budget still binds.** LCP < 1.5s, first-load JS < 90KB
  gzipped. Anything here that breaks it does not ship. Diagrams are inline SVG,
  not an imported charting library.
- **Both themes.** Every addition is checked in light, dark and system.
- **Both locales.** Japanese runs taller and breaks differently; every new
  layout is re-checked at 360 and 768 in `ja`.
- **Reduced motion.** Everything in D and E disables cleanly.
- **The token rule holds.** New components read tokens. No hard-coded colours,
  no one-off font sizes outside `@theme`.
- **Accessibility does not regress.** Diagrams get real `<title>`/`<desc>`. The
  signature interaction is keyboard-operable or it is decorative and hidden from
  assistive tech.

## Process

1. Mock the four changed sections as artboards on a design canvas before writing
   any component code. Decide there, not in the codebase.
2. Build A first and re-measure. If breaking the rhythm alone fixes the
   complaint, B and C may be all that is left worth doing.
3. One direction per commit. Any of these can be reverted independently.

**DoD:** the four changed sections read as deliberately composed rather than
uniformly framed; every project shows evidence; the four numbers are legible in
a fifteen-second skim; Stage 7's budgets still pass in both themes and locales.
