"use client";

import { lazy, Suspense } from "react";
import type { ProjectImage } from "@/content";
import { usePointerMode } from "@/lib/pointer-mode";

/** One project's cover, keyed by the ordinal its row carries. */
export type Item = { ordinal: string; image: ProjectImage };

/**
 * The layer, its rAF loop and its five `<img>` tags are all behind this.
 *
 * `React.lazy` rather than `next/dynamic`: both defer the chunk, but `lazy` and
 * `Suspense` are already in the React baseline while `next/dynamic` brings its
 * own loadable machinery on top — measured at about 1KB gzipped of app code.
 * There is no SSR case for `ssr: false` to handle either: the gate below starts
 * at `off`, which is exactly what the server renders.
 */
const ProjectHoverLayer = lazy(() => import("./project-hover-layer"));

/**
 * Cover art that follows the pointer across the PROJECTS rows.
 *
 * This file is the *gate*; `project-hover-layer.tsx` is the effect. Splitting
 * them is the stage-12 lesson applied again — that stage found 51.5KB of GSAP
 * sitting in the initial route because the code was imported where it was used
 * rather than where it was needed, and fixed it with exactly this seam. The
 * gate is a few lines and a media query; the effect is a chunk that arrives
 * only once a fine pointer is confirmed.
 *
 * On touch, `usePointerMode` never leaves `off` and the import is never
 * reached. That is what makes "no project cover is fetched on a phone" a
 * property of the module graph rather than a promise about CSS.
 */
export function ProjectHoverMedia({ items }: { items: Item[] }) {
  const mode = usePointerMode();
  if (mode === "off" || items.length === 0) return null;

  return (
    // No fallback: there is nothing to show while the chunk arrives, and a
    // placeholder in a fixed layer would be a flash of red where the cover is
    // about to be.
    <Suspense fallback={null}>
      <ProjectHoverLayer items={items} mode={mode} />
    </Suspense>
  );
}
