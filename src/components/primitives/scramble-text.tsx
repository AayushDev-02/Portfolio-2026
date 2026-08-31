"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Glyphs the scramble cycles through. Uppercase Latin, digits and the symbols
 * the design already uses — nothing that would look foreign against a heading
 * set in the pixel display face.
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+-<>/\\";

/** Total resolve time. Long enough to read as deliberate, short enough to ignore. */
const DURATION_MS = 0.62;

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
 * A heading that resolves out of noise as it scrolls into view.
 *
 * The smallest possible client leaf: it renders one string and holds an
 * IntersectionObserver. `SectionHead` stays a Server Component and simply
 * passes its text through, so no section becomes a client component.
 *
 * Three ways this renders its finished state immediately rather than animating:
 * `prefers-reduced-motion`, a string containing anything outside printable
 * ASCII, or no `IntersectionObserver` in the browser.
 *
 * **Layout cannot shift.** The real string is rendered invisibly to hold the
 * exact final width, and the scrambling text is absolutely positioned over it.
 * Silkscreen is a pixel face, not a monospace one — swapping `W` for `I` would
 * otherwise change the width on every frame and push CLS around. Once resolved
 * the wrapper is dropped entirely and the plain string is returned.
 *
 * Assistive technology always reads the real heading: the animating copy is
 * `aria-hidden`, with an `sr-only` copy of the true text beside it.
 */
export function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const ja = document.documentElement.lang.toLowerCase().startsWith("ja");
    if (reduced || ja || !isScrambleSafe(text)) {
      setReady(true);
      return;
    }
    const split = new SplitText(el, { type: "chars" });
    const chars = split.chars;
    let timeline: gsap.core.Timeline | undefined;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
      timeline = gsap.timeline({ onComplete: () => setReady(true) });
        chars.forEach((char, index) => {
          timeline.to(
            char,
            {
              duration: DURATION_MS,
              opacity: 1,
              onStart: () => {
                char.textContent = text[index] ?? "";
              },
              onUpdate: () => {
                if (Math.random() > 0.72) char.textContent = randomGlyph();
              },
              ease: "none",
            },
            index * 0.02,
          );
        });
      },
    });
    return () => {
      trigger.kill();
      timeline?.kill();
      split.revert();
    };
  }, [text]);

  // Resolved, reduced-motion, or non-Latin: the plain string, no extra markup.
  if (ready) {
    return <span ref={ref}>{text}</span>;
  }

  return (
    <span ref={ref} className="relative inline-block">
      {/* holds the exact final width so nothing reflows mid-scramble */}
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-pre">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
