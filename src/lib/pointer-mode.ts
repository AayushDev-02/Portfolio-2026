import { useEffect, useState } from "react";

/**
 * - `off` — no fine pointer. Every touch device, and the server.
 * - `reduced` — a fine pointer, but the visitor asked for less motion.
 * - `full` — a fine pointer and no such preference.
 */
export type PointerMode = "off" | "reduced" | "full";

/**
 * The gate every pointer-driven effect on this page shares.
 *
 * Both queries are **watched rather than sampled once**: a hybrid laptop can
 * gain or lose a fine pointer mid-session, and reduced-motion can be toggled
 * with the page already open. Sampling in an effect and never listening again
 * is the bug this exists to not repeat in three places.
 *
 * It starts at `off` on purpose, so the first render — the one the server also
 * produced — draws nothing. Anything gated on this is absent from the SSR
 * markup, which is what lets a component guarantee that no image is fetched and
 * no canvas is created on a device that could never use either.
 */
export function usePointerMode(): PointerMode {
  const [mode, setMode] = useState<PointerMode>("off");

  useEffect(() => {
    const fine = window.matchMedia?.("(pointer: fine)");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!fine || !reduced) return;

    const sync = () =>
      setMode(!fine.matches ? "off" : reduced.matches ? "reduced" : "full");
    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return mode;
}
