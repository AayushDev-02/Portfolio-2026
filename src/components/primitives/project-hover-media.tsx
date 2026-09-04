"use client";

import dynamic from "next/dynamic";
import type { ProjectImage } from "@/content";
import { usePointerMode } from "@/lib/pointer-mode";

/** One project's cover, keyed by the ordinal its row carries. */
export type Item = { ordinal: string; image: ProjectImage };

/**
 * The layer, its rAF loop and its six `<img>` tags are all behind this.
 *
 * `ssr: false` is not a convenience here, it is the guarantee: nothing below
 * this line exists in the server HTML, so a device that can never hover
 * downloads neither the covers nor the code that would show them.
 */
const ProjectHoverLayer = dynamic(() => import("./project-hover-layer"), {
  ssr: false,
});

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
 * reached. That is what makes "no project image is fetched on a phone" a
 * property of the module graph rather than a promise about CSS.
 */
export function ProjectHoverMedia({ items }: { items: Item[] }) {
  const mode = usePointerMode();
  if (mode === "off" || items.length === 0) return null;
  return <ProjectHoverLayer items={items} mode={mode} />;
}
