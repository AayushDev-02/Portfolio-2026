"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 800;

/**
 * Splits a figure into the parts that animate and the parts that do not.
 *
 * The four RESULTS figures are not plain numbers — they are `1,400`, `2`, `<1`
 * and `40%`. Counting the whole string is impossible; counting the numeric core
 * while holding the prefix and suffix fixed is what makes `<1` and `40%` work.
 * A string with no digits at all returns `null` and is rendered untouched,
 * which is also what keeps this safe for the Japanese units beside it.
 */
function parseFigure(text: string) {
  const match = text.match(/^([^\d]*)([\d,]+)([\s\S]*)$/);
  if (!match) return null;
  const [, prefix = "", digits = "", suffix = ""] = match;
  const value = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  return { prefix, value, suffix, grouped: digits.includes(",") };
}

/** Ease-out cubic: fast first, settling at the end, so the final value reads. */
function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * A figure that counts up when the RESULTS band scrolls into view.
 *
 * These four numbers are the argument the page makes; the brief's reasoning is
 * that motion is what makes a skimmer stop on them. Once per element, then the
 * observer disconnects.
 *
 * **Width is reserved, not merely stabilised.** `tabular-nums` equalises digit
 * widths, but the digit *count* still grows while counting — `1` to `1,400` is
 * four characters wider — so tabular alone would let the band reflow on every
 * frame. The final string is rendered invisibly to hold the exact width, with
 * the counting value absolutely positioned over it. That also covers the pixel
 * display face, which may carry no tabular figures at all.
 *
 * Renders the final value immediately under `prefers-reduced-motion`, with no
 * `IntersectionObserver`, or when the string holds no number.
 */
export function CountUp({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parsed = parseFigure(text);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!parsed || reduced || typeof IntersectionObserver === "undefined") return;

    const format = (n: number) =>
      parsed.grouped ? Math.round(n).toLocaleString("en-US") : String(Math.round(n));

    let start = 0;
    const run = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setDisplay(
        `${parsed.prefix}${format(parsed.value * easeOut(progress))}${parsed.suffix}`,
      );
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
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [text]);

  if (display === null) {
    return (
      <span ref={ref} className="tabular-nums">
        {text}
      </span>
    );
  }

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      {/* holds the final width; the count cannot reflow the band */}
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-pre">
        {display}
      </span>
      {/* assistive tech reads the real figure, never an intermediate one */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
