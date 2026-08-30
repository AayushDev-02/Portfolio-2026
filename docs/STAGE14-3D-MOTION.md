# STAGE 14 — 3D HERO

> **The motion pass that used to be §3 of this file has moved to
> `docs/STAGE12-MOTION.md`** and is now Stage 12, which was already in the plan
> and unstarted. Do that first — it is cheaper, it needs no library, and it may
> be enough on its own. This file is the 3D hero only.

## Read this first: the budget conflict is real

Three.js core is roughly **150KB gzipped** before r3f, drei, or a single line of
scene code. Stage 7's budget is **90KB first-load JS**. There is no tuning that
reconciles those two numbers — the hero canvas is above the fold, so it cannot
simply be lazy-loaded below the viewport and forgotten.

The architecture that actually works:

1. The **poster image stays the LCP element**. It renders server-side, it is
   what a recruiter sees at 1.2s, and it is what a slow phone keeps.
2. The canvas mounts **after** `load`, replacing the poster with a crossfade.
   Nothing about LCP, CLS or INP changes.
3. Stage 7's budget is **re-drawn as two numbers**: first-load JS stays under
   90KB; deferred 3D is measured separately with its own ceiling (suggest 200KB
   gz) and its own kill switches.
4. Kill switches, all of them: `prefers-reduced-motion`, `saveData`,
   `hardwareConcurrency <= 4`, and no WebGL context. Any one of them and the
   poster is simply the final state. No canvas, no penalty.

Decide this before writing scene code, and log it in `DECISIONS.md`. If the
answer is "the budget wins", stop here and do the motion pass in §3 instead —
it is most of the perceived gain for about 2KB.

---

## 1. What is actually wrong with the hero today

Looking at the live site rather than guessing:

- **The placeholder image is the weakest thing on the page.** It is mottled
  noise with no focal point — it reads as texture, not as a subject. The
  reference's photograph works because a face gives the eye somewhere to land.
- **The wordmark fights it.** `AAYUSH YADAV` sits directly over the busiest,
  highest-contrast region. The red is strong enough to survive, but it is
  working against the background rather than sitting on it.
- **There is a lot of dead space** above and below the terminal panel — the
  composition is three elements floating in a large empty field.

This matters because it tells you what the 3D is *for*. It is not decoration
bolted onto a good hero; it is the fix for the hero's actual defect. Whatever
replaces that image must have a **focal point** and a **calm zone where the
wordmark sits**.

---

## 2. Five hero concepts

Pick **one**. Two competing ideas in one hero is the same as none.

### A. Shader-only grain field — *cheapest, most on-vibe*
No geometry at all. One fullscreen quad, one fragment shader generating the
blurred monochrome mass procedurally with slowly evolving noise. It is a living
version of exactly what is there now.

- **Cost:** tiny. Can be done with raw WebGL and no three.js at all — which
  sidesteps the entire budget conflict above.
- **Risk:** low. Ships in a session.
- **Weakness:** solves "it looks dead" but not "it has no focal point".

### B. Point-cloud portrait — *most striking*
Sample a real photograph into a particle field. Idle, the particles drift as a
loose cloud; on load and on cursor proximity they converge into the portrait,
then relax again. Monochrome, grain-like, directly continuous with the
photographic hero the reference established.

- **Cost:** moderate — needs three.js proper, a points material, and an image
  sampling pass.
- **Payoff:** high. This is the one people screenshot.
- **Requires:** an actual photo of him. It has no focal point without one.

### C. ASCII / ordered-dither post-process — *most distinctive*
Render anything, then pass the frame through a shader that quantises it to
monospace glyphs or a dither pattern. The background becomes literally made of
text.

- **Why it fits:** the site's entire identity is monospace type and a pixel
  display face. A background made of characters is the same idea at another
  scale, not a borrowed effect.
- **Pairs well with A or B** as a treatment layer rather than a concept of
  its own.

### D. Embedding-space cloud — *most meaningful*
Points scattered in 3D that drift, then cluster, with faint hairlines joining
nearest neighbours. It is a picture of vector search — the thing he actually
builds.

- **Why it is the strongest for his situation:** an interviewer who works in
  this field recognises it in about two seconds. It stops being decoration and
  becomes a claim about what he does. Every other option on this list is a
  mood; this one is a statement.
- **Cost:** moderate. Points + line segments, no textures, no lighting.

### E. Wireframe terrain from real geodata — *ties to MapAI*
A hairline mesh built from actual elevation data for Otaru or Kashiwa, rotating
slowly. Same logic as D — meaning rather than mood — pointed at the geospatial
work instead of the retrieval work.

### Recommendation
**D rendered through C's dither.** An embedding cloud that resolves as
monochrome grain: it has a focal point, it carries meaning about his work, and
the dither treatment keeps it inside the site's existing visual language instead
of importing a generic "3D hero" look.

If that is too much for the time available, **A** delivers 60% of the perceived
improvement for 10% of the effort and risk.

---

## 3. Do Stage 12 first

The motion pass is now `docs/STAGE12-MOTION.md`. Build it, look at the site,
and only then decide whether the hero still needs 3D. It may not.

---

## 4. Two composition fixes, independent of all the above

1. **Give the wordmark a calm zone.** Either a subtle scrim behind the type, or
   compose the background so its quiet region falls where the type sits. Right
   now the loudest element sits on the busiest area.
2. **Close the dead space.** Three elements floating in a large empty field is
   why the hero feels unfinished. Tighten the vertical rhythm, or let the
   background carry the empty areas with more presence.

---

## Guardrails

- Poster is the LCP element. The canvas mounts after `load`. Always.
- Four kill switches: reduced-motion, `saveData`, low core count, no WebGL.
- Both themes. Both locales. Re-checked at 360 and 768.
- Everything in §3 disables under `prefers-reduced-motion`.
- One hero concept, not two.
- New components read tokens. No hard-coded colours.

**DoD:** first-load JS still under 90KB and LCP still under 1.5s with the canvas
disabled; deferred 3D under its own ceiling; the hero has a focal point and the
wordmark sits in a calm zone; the site is complete and usable with every kill
switch tripped.
