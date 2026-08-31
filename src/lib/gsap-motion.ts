/** Load motion modules after the first paint; all effects share one promise. */
let modulesPromise: Promise<MotionModules> | undefined;

type MotionModules = {
  gsap: typeof import("gsap").default;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  SplitText: typeof import("gsap/SplitText").SplitText;
};

export function loadMotionModules(): Promise<MotionModules> {
  modulesPromise ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/SplitText"),
  ]).then(([core, trigger, split]) => {
    const gsap = core.default;
    gsap.registerPlugin(trigger.ScrollTrigger, split.SplitText);
    return { gsap, ScrollTrigger: trigger.ScrollTrigger, SplitText: split.SplitText };
  });
  return modulesPromise;
}
