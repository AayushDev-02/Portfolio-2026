"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Glyphs the scramble cycles through. Uppercase Latin, digits and the symbols
 * the design already uses — nothing that would look foreign against a heading
 * set in the pixel display face.
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+-<>/\\";

/** Total resolve time. Long enough to read as deliberate, short enough to ignore. */
const DURATION_MS = 620;

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
  // biome-ignore lint/suspicious/noControlCharactersInRegex: the range is the printable ASCII block, bounded deliberately rather than by a character class that would admit CJK.
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
  const [display, setDisplay] = useState<string | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !isScrambleSafe(text) || typeof IntersectionObserver === "undefined") {
      return;
    }

    let start = 0;
    const run = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / DURATION_MS, 1);
      // Characters settle left to right; each one holds noise until the wave
      // passes it, so the word appears to resolve rather than simply fade.
      const settled = progress * text.length;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i] as string;
        // Spaces never scramble — a heading that changes word shape mid-effect
        // reads as broken rather than as motion.
        out += char === " " || i < settled ? char : randomGlyph();
      }
      setDisplay(out);
      if (progress < 1) {
        frame.current = requestAnimationFrame(run);
      } else {
        setDisplay(null);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          frame.current = requestAnimationFrame(run);
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [text]);

  // Resolved, reduced-motion, or non-Latin: the plain string, no extra markup.
  if (display === null) {
    return <span ref={ref}>{text}</span>;
  }

  return (
    <span ref={ref} className="relative inline-block">
      {/* holds the exact final width so nothing reflows mid-scramble */}
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-pre">
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
