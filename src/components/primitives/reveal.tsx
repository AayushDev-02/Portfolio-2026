"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /**
   * Position in a staggered group, zero-based. Each step adds a fixed delay,
   * so a row of timeline cards arrives in sequence rather than all at once.
   */
  index?: number;
  /** Fraction of the element that must be visible before it reveals. */
  amount?: number;
  /**
   * Animate the *items of the single layout element this wraps*, in sequence,
   * rather than the wrapper itself.
   *
   * Wrap exactly one layout element (a grid or a list); its children are what
   * animate. That indirection is deliberate: the timeline's hairlines come from
   * `gap-px` on `HairlineGrid`, which forwards no ref, so the observer needs a
   * div of its own outside the grid. Giving each card its own observer would
   * insert a div between the grid and its items and collapse the shared
   * borders.
   */
  stagger?: boolean;
  /**
   * `fade` (default) lifts and fades the block in.
   *
   * `rule` draws a hairline instead: `scaleX(0) → scaleX(1)` from the left.
   * A border cannot be transformed, so a rule that draws has to be a real
   * element — see `Hairline`. Kept as a variant here rather than as a second
   * component with its own observer: the trigger logic is identical and only
   * the CSS differs.
   */
  variant?: "fade" | "rule";
  className?: string;
};

/**
 * Reveals its children once they scroll into view.
 *
 * A client component, but a thin wrapper: `children` are passed in as a prop,
 * so everything inside stays server-rendered. This component ships an
 * IntersectionObserver and a boolean, nothing more.
 *
 * **No Motion.** PLAN.md §12 specified the `motion` library, and it was
 * measured rather than assumed: `LazyMotion` + `domAnimation` + `strict` — the
 * plan's own prescription — costs **38.3KB gzipped**, against an app-code
 * budget of 15KB of which 11.4KB was already spent. `useInView` alone is only
 * 0.6KB, but keeping a 38KB dependency to use 1.5% of it leaves a footgun: the
 * next person to reach for `m.div` adds the other 38KB, and would only find out
 * from CI. See docs/DECISIONS.md.
 *
 * The animation itself is CSS. This only flips a data attribute; globals.css
 * owns the distance, the duration and the easing, so the motion can be retuned
 * without touching a component — the same separation the colour tokens have.
 *
 * Two things that must hold regardless of this component:
 *
 * - **Without JavaScript the content is visible.** The hidden state is scoped
 *   to `[data-js]`, set by a blocking script in the layout. No script, no
 *   `data-js`, no hidden state — the page renders complete.
 * - **Under `prefers-reduced-motion` the content is visible immediately**, not
 *   revealed quickly. globals.css forces the revealed state outright rather
 *   than shortening the transition.
 */
export function Reveal({
  children,
  index = 0,
  amount = 0.15,
  stagger = false,
  variant = "fade",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    // Anything already on screen at mount reveals without waiting for a scroll
    // that may never come — a short section, or a visitor who lands deep-linked.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            // Reveal is one-way: re-hiding on scroll-up is a distraction, and
            // it makes the page feel unstable when someone scrolls back.
            observer.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <div
      ref={ref}
      {...(variant === "rule"
        ? { "data-reveal-rule": shown ? "shown" : "pending" }
        : stagger
          ? { "data-reveal-stagger": shown ? "shown" : "pending" }
          : { "data-reveal": shown ? "shown" : "pending" })}
      style={index > 0 ? ({ "--reveal-index": index } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
