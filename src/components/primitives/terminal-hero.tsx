"use client";

import { useEffect, useState } from "react";

type Props = {
  /** The wordmark, rendered in the pixel display face. */
  title: string;
  /** Small status line above the title, e.g. "SYSTEM READY". */
  status?: string;
  /** Lines typed one after another at the ">" prompt. */
  lines: string[];
  /** Milliseconds per character. */
  speed?: number;
};

/**
 * The terminal hero: a wordmark plus a prompt that types itself out.
 *
 * Respects prefers-reduced-motion by rendering the final line immediately —
 * a typewriter is exactly the kind of motion that setting exists to stop.
 */
export function TerminalHero({ title, status, lines, speed = 45 }: Props) {
  const full = lines[0] ?? "";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    <div className="flex flex-col gap-8">
      {status ? <p className="label text-accent">{status}</p> : null}

      <h2 className="font-display text-display leading-none tracking-display text-balance">
        {title}
      </h2>

      <p className="flex gap-3 text-body text-dim">
        <span aria-hidden="true" className="shrink-0 select-none text-accent">
          &gt;
        </span>
        <span aria-hidden="true" className="caret">
          {typed}
        </span>
        <span className="sr-only">{full}</span>
      </p>
    </div>
  );
}
