"use client";

import { useEffect, useState } from "react";

/**
 * The ">" prompt that types itself out. The only client component in the hero.
 *
 * Under prefers-reduced-motion the final line renders immediately — a
 * typewriter is exactly the kind of motion that setting exists to stop.
 *
 * The visible span is aria-hidden and a sr-only sibling carries the full line,
 * so assistive tech reads the sentence once rather than character by character.
 */
export function TerminalPrompt({ lines, speed = 45 }: { lines: string[]; speed?: number }) {
  const full = lines[0] ?? "";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setTyped(full);
      return;
    }

    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, speed);

    return () => window.clearInterval(id);
  }, [full, speed]);

  return (
    <p className="mt-3 flex gap-3 text-label sm:text-ui">
      <span aria-hidden="true" className="shrink-0 select-none text-accent">
        &gt;
      </span>
      <span aria-hidden="true" className="caret">
        {typed}
      </span>
      <span className="sr-only">{full}</span>
    </p>
  );
}
