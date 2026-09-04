/** Load motion modules after the first paint; all effects share one promise. */
let modulesPromise: Promise<MotionModules> | undefined;

type MotionModules = {
  gsap: typeof import("gsap").default;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

/**
 * ScrollTrigger only.
 *
 * SplitText was here for the heading scramble, which now owns its own rAF loop
 * and needs no library at all — see `scramble-text.tsx`. Nothing else on the
 * page splits text, so the plugin came out with it.
 */
export function loadMotionModules(): Promise<MotionModules> {
  modulesPromise ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([core, trigger]) => {
      const gsap = core.default;
      gsap.registerPlugin(trigger.ScrollTrigger);
      return { gsap, ScrollTrigger: trigger.ScrollTrigger };
    },
  );
  return modulesPromise;
}
