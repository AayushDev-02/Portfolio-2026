import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

/**
 * The hero's moving ground: a grainy mesh gradient, drawn by a fragment shader,
 * bent by the pointer.
 *
 * This is the animated successor to `public/images/hero-bg.*` — the blurred
 * grey study the hero shipped with through stage 16. That image was 99KB, it
 * was the LCP element, and it could not react to anything. The same picture is
 * about 60 lines of GLSL, weighs nothing over the wire once the chunk is cached,
 * and the pointer can push it around.
 *
 * ## Why Three.js is here at all
 *
 * `lib/embedding-field.ts` argues at length that a field of points has no use
 * for a scene graph, and that is still true — which is why the point field is
 * still a 2D canvas and is not touched by this file. **This is the opposite
 * case.** It is one fullscreen quad and one shader, and what Three.js supplies
 * is the part nobody should hand-write twice: context loss and restore, the
 * DPR-aware drawing-buffer sizing, uniform plumbing, and the GLSL preamble that
 * makes the same shader source compile under both WebGL1 and WebGL2.
 *
 * It is not free, and the number is in docs/DECISIONS.md. What keeps it off the
 * budget is the seam: this module is reached only through a bare `import()`
 * from `hero-gradient.tsx`, after the `load` event, so it lands in an async
 * chunk that the route manifest never sees and that no visitor waits on. Nobody
 * on a phone downloads any of it — see the gate.
 *
 * ## No colour value appears in this file
 *
 * Every colour and every constant the *look* depends on is read from the CSS
 * custom properties at start, and re-read when `data-theme` changes on `<html>`.
 * The shader follows both themes without knowing either exists, which is the
 * contract `--field-*` gives the point field and `--hero-image-filter` gave the
 * photograph.
 *
 * Callers get a teardown function, or `null` if the canvas cannot be used —
 * no WebGL context, or a canvas that never gets a size. The other three kill
 * switches are in `hero-gradient.tsx`, because they can be answered before a
 * canvas exists at all.
 */

/**
 * Frames per second. Deliberately not 60.
 *
 * The drift is slow enough that 30 is indistinguishable from 60 for the
 * gradient, and the grain is *better* at 30 — a per-pixel dither resampled
 * sixty times a second reads as digital noise, and at thirty it reads as film.
 * It also halves a fullscreen fragment shader's GPU cost on a laptop that may
 * be running on battery.
 */
const FPS = 30;

/**
 * Device pixel ratio ceiling, and 1 is not a mistake.
 *
 * This is a low-frequency image — soft blobs with no edge sharper than the
 * smoothstep that draws it — so there is nothing for a second sample per axis
 * to resolve. Rendering at DPR 2 is four times the fragment work for a picture
 * nobody can tell apart, and the grain, which is the one high-frequency part,
 * is *meant* to sit at one grain per screen pixel.
 */
const MAX_DPR = 1;

/** How fast the pointer's influence catches up, per second. Eased, not snapped. */
const POINTER_EASE = 3.2;

const VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Simplex noise, then the same noise used to displace itself, then a hard
 * contrast curve.
 *
 * The domain warp in the middle is what makes this read as the reference
 * photograph rather than as lava-lamp blobs: displacing the sample point by a
 * second noise field tears the contours into the folded, torn-edged shapes the
 * original has. Plain fBm alone produces circles.
 *
 * `snoise` is Ashima Arts' 3D simplex implementation (MIT), unchanged. The
 * third dimension is time, so the field evolves rather than scrolling — a 2D
 * noise panned along a vector betrays its direction within about a second.
 */
const FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerOn;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform float uContrast;
  uniform float uGrain;
  uniform float uScale;
  uniform float uGrip;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  // A white-noise hash, and the sin-based one it replaces was visibly wrong.
  //
  // fract(sin(dot(p, k)) * big) is the usual one-liner and it is NOT white
  // noise: it has strong diagonal structure, and driving it by ADDING a
  // per-frame value to the coordinate translated that structure across the
  // screen. The result read as faint lines sliding left to right — which is
  // exactly what a grain is supposed to hide, arriving instead as the most
  // visible thing on the page. It is also precision-dependent, so it bands
  // differently on different GPUs.
  //
  // This is Dave Hoskins' hash (MIT), which is genuinely uncorrelated in both
  // space and time, so re-seeding it per frame produces a fresh field rather
  // than the same field moved.
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);

    // Aspect-corrected so a blob stays the same shape on a phone and on an
    // ultrawide. Without this the field stretches with the window.
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
    float t = uTime * 0.05;

    // THE POINTER. It is a lens, not a spotlight: the field is pushed away
    // from the cursor, hardest right under it and falling off fast, so moving
    // the mouse parts the gradient rather than lighting it. A falloff this
    // tight is what keeps it from reading as the whole background sliding.
    vec2 m = (uPointer - 0.5) * vec2(aspect, 1.0);
    vec2 toPointer = p - m;
    float grip = uPointerOn * exp(-dot(toPointer, toPointer) * 2.6);
    p += toPointer * grip * uGrip;

    // Domain warp — see the block above. One field displacing another.
    vec2 warp = vec2(
      snoise(vec3(p * uScale + vec2(0.0, 1.7), t)),
      snoise(vec3(p * uScale - vec2(3.1, 0.0), t))
    );
    p += warp * 0.42;

    // Three octaves. A fourth is invisible under the contrast curve below and
    // costs another simplex evaluation on every pixel of the screen.
    float v =
        snoise(vec3(p * uScale, t)) * 0.6
      + snoise(vec3(p * uScale * 2.1 + 4.3, t * 1.3)) * 0.3
      + snoise(vec3(p * uScale * 4.3 - 2.7, t * 1.7)) * 0.1;
    v = v * 0.5 + 0.5;

    // The difference between a soft gradient and the reference's torn edges.
    v = smoothstep(0.5 - uContrast, 0.5 + uContrast, v);

    // The centre stays at the page colour so the wordmark keeps its measured
    // contrast, and the field only opens up toward the frame. This is the
    // composition of the photograph it replaces, not a safety margin bolted on.
    float radial = smoothstep(0.2, 0.68, length((vUv - 0.5) * vec2(1.1, 1.0)));
    // ...and the lower edge returns to the page outright, so the border with
    // ABOUT is a hairline rather than a change of ground. Shallow on purpose:
    // a deeper fade left the bottom third of the hero flat white, which read
    // as the field having stopped rather than as it receding.
    float foot = smoothstep(0.0, 0.16, vUv.y);
    v *= radial * foot;

    vec3 color = mix(uLow, uHigh, v);

    // GRAIN. Without it this is a CSS gradient, and a CSS gradient is what the
    // static fallback in globals.css already is. Quantised to about 12 steps a
    // second: resampled every frame it reads as digital noise, and held it
    // reads as film.
    float seed = floor(uTime * 12.0);
    // The frame number goes in as a third coordinate, not as an offset added to
    // the first two. Offsetting slides the field; this reseeds it.
    float g = hash12(gl_FragCoord.xy + vec2(seed * 17.13, seed * 41.77));
    // The grain is scaled by the same falloff as the field, and that is a
    // CONTRAST fix, not a stylistic one.
    //
    // Every text colour on this page is measured against the page token, and
    // the centre is held at exactly that, so those measurements still hold.
    // Full-
    // amplitude grain breaks them anyway: it moves the ground by about seven
    // levels either way, and the two tightest pairs on the site have no seven
    // levels to give. Red-600 on white is 4.83:1 and red-500 on the dark ground
    // is 4.63:1 — both land under 4.5:1 once the dither darkens the pixel a
    // hero call to action happens to sit on. Measured, not assumed; the probe
    // samples the worst background pixel inside each text box across six
    // frames.
    //
    // So the centre keeps a fifth of the amplitude, which is enough that it
    // does not read as a clean plate dropped into a grainy field, and the frame
    // — where nothing is set — keeps all of it.
    // The floor is a dither, not a texture: +/- half a level at 8-bit depth.
    // Without it the centre, which deliberately carries only a fifth of the
    // grain, shows the smoothstep's own contour steps as faint moving bands.
    float grain = max(uGrain * mix(0.2, 1.0, radial * foot), 0.004);
    color += (g - 0.5) * grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * `#rrggbb` or `#rgb` to a 0–1 triple.
 *
 * Deliberately not `THREE.Color`. Three's colour management would read the
 * token as sRGB and convert it into the linear working space, and this shader
 * writes `gl_FragColor` directly with no output-encoding chunk — so the value
 * would arrive linear, be written as if it were sRGB, and the whole hero would
 * render washed out. Parsing the token here means what the CSS says is exactly
 * what the screen gets, and it drops `Color` from the import list.
 */
function parseHex(value: string, into: Vector3): Vector3 {
  const hex = value.trim().replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const n = Number.parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(n)) return into;
  return into.set(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export function startHeroGradient(
  canvas: HTMLCanvasElement,
  /** Called once the first frame is on screen, so the gate can fade it in. */
  onReady?: () => void,
): (() => void) | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      // The hero is drawn once per frame and never read back, and the page
      // behind it is already the same colour at the centre.
      powerPreference: "low-power",
    });
  } catch {
    // No WebGL. The static gradient underneath is already correct.
    return null;
  }

  const rect = canvas.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) {
    renderer.dispose();
    return null;
  }

  const root = document.documentElement;

  const uniforms = {
    uResolution: { value: new Vector2(1, 1) },
    uTime: { value: 0 },
    // Starts dead centre so the first frame is not bent toward a corner.
    uPointer: { value: new Vector2(0.5, 0.5) },
    uPointerOn: { value: 0 },
    uLow: { value: new Vector3(1, 1, 1) },
    uHigh: { value: new Vector3(0, 0, 0) },
    uContrast: { value: 0.3 },
    uGrain: { value: 0.055 },
    uScale: { value: 1.15 },
    uGrip: { value: 0.45 },
  };

  const readTheme = () => {
    const style = getComputedStyle(root);
    const num = (name: string, fallback: number) =>
      Number(style.getPropertyValue(name)) || fallback;

    parseHex(style.getPropertyValue("--hero-gradient-low"), uniforms.uLow.value);
    parseHex(style.getPropertyValue("--hero-gradient-high"), uniforms.uHigh.value);
    uniforms.uContrast.value = num("--hero-gradient-contrast", 0.3);
    uniforms.uGrain.value = num("--hero-gradient-grain", 0.055);
    uniforms.uScale.value = num("--hero-gradient-scale", 1.15);
    uniforms.uGrip.value = num("--hero-gradient-grip", 0.45);
  };
  readTheme();

  const scene = new Scene();
  // The quad is written straight to clip space by the vertex shader, so the
  // camera never transforms anything. It exists because `render` wants one.
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new PlaneGeometry(2, 2);
  const material = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });
  scene.add(new Mesh(geometry, material));

  /** Where the pointer is, and where the shader currently believes it is. */
  const target = { x: 0.5, y: 0.5, on: 0 };

  let raf = 0;
  let start = 0;
  let last = 0;
  let ready = false;
  let visible = document.visibilityState === "visible";
  let onScreen = true;

  const size = () => {
    const box = canvas.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    // `false` — do not let Three write width/height into the element's style.
    // The canvas is sized by the layout (`absolute inset-0`), and letting the
    // renderer stamp pixel dimensions on it would freeze it at one size.
    renderer.setSize(box.width, box.height, false);
    uniforms.uResolution.value.set(box.width, box.height);
  };
  size();

  const interval = 1000 / FPS;

  const draw = (now: number) => {
    raf = requestAnimationFrame(draw);

    const elapsed = now - last;
    if (elapsed < interval) return;
    // Keep the cadence honest rather than drifting a frame later every time.
    last = now - (elapsed % interval);

    const dt = Math.min(elapsed / 1000, 0.1);
    uniforms.uTime.value = (now - start) / 1000;

    // The pointer is eased rather than followed. A fullscreen field that snaps
    // to the cursor reads as a bug; one that catches up over a few frames reads
    // as weight.
    const k = 1 - Math.exp(-POINTER_EASE * dt);
    const pointer = uniforms.uPointer.value;
    pointer.x += (target.x - pointer.x) * k;
    pointer.y += (target.y - pointer.y) * k;
    uniforms.uPointerOn.value += (target.on - uniforms.uPointerOn.value) * k;

    renderer.render(scene, camera);

    if (!ready) {
      ready = true;
      onReady?.();
    }
  };

  const run = () => {
    // A background tab, or a hero scrolled past, must not run this.
    const should = visible && onScreen;
    if (should && !raf) {
      const now = performance.now();
      // `start` is rebased on resume so the field picks up where it paused
      // rather than jumping forward by however long the tab was hidden.
      start = now - uniforms.uTime.value * 1000;
      last = now;
      raf = requestAnimationFrame(draw);
    } else if (!should && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const onMove = (event: PointerEvent) => {
    const box = canvas.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    // Flipped: the shader's uv origin is bottom-left, the DOM's is top-left.
    const y = 1 - (event.clientY - box.top) / box.height;
    const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
    if (inside) {
      target.x = x;
      target.y = y;
    }
    // Outside the hero the bend relaxes out rather than sticking at the edge.
    target.on = inside ? 1 : 0;
  };

  const onLeave = () => {
    target.on = 0;
  };

  const onVisibility = () => {
    visible = document.visibilityState === "visible";
    run();
  };

  // A lost context is not an error worth surfacing: preventDefault lets the
  // browser restore it, and until it does the static gradient is still there.
  const onContextLost = (event: Event) => {
    event.preventDefault();
    onScreen = false;
    run();
  };
  const onContextRestored = () => {
    onScreen = true;
    size();
    run();
  };

  const resizeObserver = new ResizeObserver(size);
  resizeObserver.observe(canvas);

  const intersectionObserver = new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    run();
  });
  intersectionObserver.observe(canvas);

  const themeObserver = new MutationObserver(readTheme);
  themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  // next-themes stamps `data-theme` on an explicit choice, but a visitor on
  // "system" who flips their OS never changes an attribute — only the media
  // query resolves differently. Watching it keeps those two paths identical.
  const scheme = window.matchMedia?.("(prefers-color-scheme: dark)");
  scheme?.addEventListener("change", readTheme);

  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("mouseleave", onLeave);
  document.addEventListener("visibilitychange", onVisibility);
  run();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    themeObserver.disconnect();
    scheme?.removeEventListener("change", readTheme);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("mouseleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
    // Three holds GPU resources that garbage collection cannot reach. Dropping
    // the component without these leaks a program and a buffer per mount.
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
