import type { ReactNode } from "react";

type Props = {
  /** Rendered until (and unless) a 3D scene is mounted here in stage 10. */
  fallback?: ReactNode;
  className?: string;
};

/**
 * THE THREE.JS SEAM — see docs/PLAN.md stage 10.
 *
 * Nothing in the layout may depend on a canvas existing. This component
 * reserves the space and currently renders a static poster. When 3D lands:
 *
 *   const Scene = dynamic(() => import("./scene"), {
 *     ssr: false,
 *     loading: () => fallback,
 *   });
 *
 * ...plus the guards: skip entirely on prefers-reduced-motion,
 * navigator.hardwareConcurrency <= 4, and connection.saveData.
 *
 * If enabling it breaks the stage 7 performance budget, it does not ship.
 */
export function CanvasSlot({ fallback, className }: Props) {
  return (
    <div
      className={className}
      data-slot="canvas"
      // Reserves layout box so adding the canvas later causes zero CLS.
      style={{ aspectRatio: "16 / 9" }}
    >
      {fallback}
    </div>
  );
}
