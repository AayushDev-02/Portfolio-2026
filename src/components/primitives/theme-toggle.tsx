"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Accessible name for the group, localised. */
  label: string;
  lightLabel: string;
  darkLabel: string;
};

/**
 * The `[ ☀ / ☾ ]` bracket toggle, sibling to the locale switcher.
 *
 * Two explicit options rather than a three-way light/dark/system control. The
 * default *is* system — it is what a visitor gets before touching this — so a
 * third button would only let someone return to a state they already had, at
 * the cost of a wider control in a corner that is already busy.
 *
 * `mounted` is not ceremony. The server cannot know the visitor's OS
 * preference, so `resolvedTheme` is undefined during SSR and on the first
 * client render; marking either option as current before then would render one
 * value on the server and another after hydration. Until mounted, both options
 * render inert and unselected — the same shape, so nothing shifts.
 */
export function ThemeToggle({ label, lightLabel, darkLabel }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const options = [
    { value: "light", glyph: "LT", name: lightLabel },
    { value: "dark", glyph: "DK", name: darkLabel },
  ] as const;

  return (
    // A <fieldset> with a visually hidden <legend> rather than a div with
    // role="group": valid outside a form, and it gives the pair a real
    // accessible name, which aria-label on a generic element does not
    // reliably produce.
    <fieldset className="m-0 flex items-center gap-1 border-0 p-0">
      <legend className="sr-only">{label}</legend>
      <span aria-hidden="true" className="text-rule">
        [
      </span>
      {options.map((option, i) => {
        const active = mounted && resolvedTheme === option.value;
        return (
          <span key={option.value} className="flex items-center gap-1">
            {i > 0 ? (
              <span aria-hidden="true" className="text-rule">
                /
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setTheme(option.value)}
              aria-pressed={mounted ? active : undefined}
              title={option.name}
              className={cn(
                "inline-flex min-h-11 items-center px-1 transition-colors duration-150",
                active
                  ? "text-accent"
                  : "text-prose hover:text-ink focus-visible:text-ink",
              )}
            >
              <span className="sr-only">{option.name}</span>
              <span aria-hidden="true">{option.glyph}</span>
            </button>
          </span>
        );
      })}
      <span aria-hidden="true" className="text-rule">
        ]
      </span>
    </fieldset>
  );
}
