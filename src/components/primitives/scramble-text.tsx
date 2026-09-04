"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * Glyphs the decode cycles through. Uppercase Latin, digits and the symbols the
 * design already uses — nothing that would look foreign against a heading set
 * in the pixel display face.
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+-<>/\\";

/** How far behind its left-hand neighbour each character starts, in ms. */
const CHAR_STEP_MS = 46;

/** How long one character flickers before it locks to its real value. */
const CHAR_SCRAMBLE_MS = 250;

/** Glyph swap cadence inside that window. Slower than the frame rate on purpose. */
const SWAP_MS = 48;

/** Ceiling for the whole heading; the step compresses to fit long strings. */
const MAX_TOTAL_MS = 900;

/**
 * True when every character is safe to replace with a random Latin glyph.
 *
 * **This is the Japanese guard, and it is deliberately a property of the string
 * rather than of the locale.** Cycling random kana or kanji reads as a font
 * failure, not an effect. Branching on `locale === "ja"` would be subtly wrong
 * for this site in particular: its English copy names Japanese organisations
 * (国総研, 株式会社), so an English heading can legitimately contain CJK, and a
 * locale check would happily scramble it. Testing the characters covers both
 * cases and needs no locale threaded down through every section.
 *
 * Printable ASCII only: anything else — CJK, kana, accented Latin, emoji —
 * renders immediately instead.
 */
function isScrambleSafe(text: string): boolean {
  return /^[\x20-\x7E]*$/.test(text);
}

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] as string;
}

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * The gate below has to run *before* the browser paints, or the finished
 * heading flashes for one frame and is then blanked to start decoding — the
 * exact stutter this rewrite exists to remove. React warns about
 * `useLayoutEffect` during server rendering, hence the swap.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Token = { text: string; space: boolean; slots: { ch: string; order: number }[] };

/**
 * Splits the string into whitespace runs and words, and numbers every
 * non-space character in reading order.
 *
 * Words are the unit because each character has to become an `inline-block` to
 * hold its own width — and inline-blocks are individually wrappable, so a
 * naively split heading would break "EXPERIENCE" across two lines the moment
 * the viewport narrowed. Wrapping each word in a `whitespace-nowrap` block puts
 * the line breaks back where they belong.
 */
function tokenize(text: string): Token[] {
  let order = 0;
  return text.split(/(\s+)/).map((part) => {
    if (/^\s+$/.test(part)) return { text: part, space: true, slots: [] };
    return {
      text: part,
      space: false,
      slots: Array.from(part).map((ch) => ({ ch, order: order++ })),
    };
  });
}

/**
 * A heading that decodes into place, left to right, as it scrolls into view.
 *
 * **What changed, and why.** The previous version tweened opacity on
 * SplitText characters and swapped in a random glyph on roughly a quarter of
 * its update ticks. Two things fell out of that. The whole heading churned at
 * once rather than resolving in a direction, so it read as noise rather than as
 * a decode; and because the last tick was as likely to write a random glyph as
 * any other, the final frame frequently held nonsense that the component then
 * *replaced* with the real string when it unmounted the animation — the visible
 * snap at the end.
 *
 * This version owns its own clock. Every character has an explicit start time
 * (`order * step`), flickers for a fixed window, and is then written once with
 * its real value and never touched again. The end state is reached by each
 * character arriving, not by the animation being torn down, so there is nothing
 * left to snap.
 *
 * The smallest possible client leaf: it renders one string and holds an
 * `IntersectionObserver`. `SectionHead` stays a Server Component and passes its
 * text straight through, so no section becomes a client component.
 *
 * Four ways this renders its finished state immediately rather than animating:
 * `prefers-reduced-motion`, a Japanese document, a string containing anything
 * outside printable ASCII, or no `IntersectionObserver` in the browser.
 *
 * **Layout cannot shift.** Each character is a slot holding an invisible copy
 * of its own final glyph, with the flickering glyph absolutely positioned and
 * centred inside it. Silkscreen is a pixel face, not a monospace one — swapping
 * `W` for `I` in the flow would otherwise change the width on every frame and
 * push CLS around. Once the last character lands, the wrapper is dropped
 * entirely and the plain string is returned.
 *
 * No GSAP. This is one `requestAnimationFrame` loop over a handful of spans,
 * and it is the only remaining reason the project loaded SplitText.
 *
 * Assistive technology always reads the real heading: the animating copy is
 * `aria-hidden`, with an `sr-only` copy of the true text beside it.
 */
export function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const slots = useRef<(HTMLSpanElement | null)[]>([]);
  /**
   * `plain` renders the string as-is — the server-rendered state, the
   * reduced-motion state and the finished state are all the same markup.
   * `armed` splits it into empty slots; `running` fills them.
   */
  const [phase, setPhase] = useState<"plain" | "armed" | "running">("plain");

  const tokens = useMemo(() => tokenize(text), [text]);
  const total = useMemo(
    () => tokens.reduce((sum, token) => sum + token.slots.length, 0),
    [tokens],
  );

  useIsomorphicLayoutEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.lang.toLowerCase().startsWith("ja")) return;
    if (!isScrambleSafe(text) || total === 0) return;
    setPhase("armed");
  }, [text, total]);

  useEffect(() => {
    if (phase !== "armed") return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase("running");
            observer.disconnect();
          }
        }
      },
      // Matches the reveal threshold, so a heading decodes as its block arrives
      // rather than a beat after it.
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    if (phase !== "running") return;

    // Long headings compress rather than run past the ceiling. The floor keeps
    // the wave visible: below ~14ms consecutive characters share a frame.
    const step =
      total > 1
        ? Math.max(
            14,
            Math.min(CHAR_STEP_MS, (MAX_TOTAL_MS - CHAR_SCRAMBLE_MS) / (total - 1)),
          )
        : 0;

    const swapAt = new Array<number>(total).fill(-1);
    const locked = new Array<boolean>(total).fill(false);
    const started = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      let pending = false;

      for (let i = 0; i < total; i += 1) {
        if (locked[i]) continue;
        const node = slots.current[i];
        if (!node) {
          locked[i] = true;
          continue;
        }
        const begins = i * step;

        if (elapsed < begins) {
          pending = true;
          continue;
        }
        if (elapsed < begins + CHAR_SCRAMBLE_MS) {
          pending = true;
          const swap = Math.floor((elapsed - begins) / SWAP_MS);
          if (swapAt[i] !== swap) {
            swapAt[i] = swap;
            node.textContent = randomGlyph();
          }
          continue;
        }
        // Landed. Written once, from the source string — never from whatever
        // the last flicker happened to be.
        node.textContent = node.dataset.ch ?? "";
        locked[i] = true;
      }

      if (pending) raf = requestAnimationFrame(tick);
      else setPhase("plain");
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, total]);

  if (phase === "plain") {
    return <span ref={ref}>{text}</span>;
  }

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {tokens.map((token, t) =>
          token.space ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: positional by nature — this list is derived from one immutable string and never reorders.
            <span key={`s${t}`}>{token.text}</span>
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: as above.
            <span key={`w${t}`} className="inline-block whitespace-nowrap">
              {token.slots.map((slot) => (
                <span key={slot.order} className="relative inline-block">
                  {/* Holds this character's exact width for the whole decode. */}
                  <span className="invisible">{slot.ch}</span>
                  <span
                    ref={(node) => {
                      slots.current[slot.order] = node;
                    }}
                    data-ch={slot.ch}
                    className="absolute inset-0 text-center"
                  />
                </span>
              ))}
            </span>
          ),
        )}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
