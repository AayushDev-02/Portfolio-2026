/**
 * Placeholder cover art for the PROJECTS rows.
 *
 * Stage 16 task 2 needs a `<picture>`-shaped image per project so the hover
 * preview can be built and measured *before* real screenshots exist. Waiting
 * for art would mean shipping the interaction untested, or building it against
 * six 404s.
 *
 * Plain Node, no dependency — the same rule the rest of `scripts/` follows.
 * `--experimental-strip-types` lets this import `src/content/en.ts` directly,
 * which is the point: **titles and tags are read from the content layer, never
 * repeated here.** A project renamed in `en.ts` regenerates with the new name;
 * a seventh project generates a seventh card. Run:
 *
 *   pnpm placeholders
 *
 * The hex values below are the ONLY hard-coded colours allowed anywhere in this
 * project, and they are allowed because they are baked into throwaway generated
 * files rather than read by a component. They mirror the dark-theme tokens in
 * `src/app/globals.css`; if those change, these cards look slightly off until
 * someone reruns this, which does not matter for art that is being replaced.
 *
 * When real screenshots land they become `.avif` with a `.webp` sibling served
 * through `<picture>` — follow `src/components/primitives/hero-backdrop.tsx`
 * and `src/lib/images.ts` — and each file stays under 60KB.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "public", "images", "projects");

/** Mirrors the dark-theme token block. Generated files only — see above. */
const PANEL = "#0a0a0a";
const RULE = "rgba(237,237,237,0.18)";
const INK = "#ededed";
const PROSE = "#9ca3af";
const ACCENT = "#ef4444";

const WIDTH = 640;
const HEIGHT = 400;

/**
 * An SVG loaded through <img> cannot fetch a webfont, so Silkscreen is not
 * available here. The generic monospace stack is the closest thing the card can
 * reach, and these are placeholders.
 */
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Greedy wrap by character budget. Good enough for monospace. */
function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of String(text).split(/\s+/)) {
    if (!line) line = word;
    else if (`${line} ${word}`.length <= max) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** `Production RAG assistant` -> `production-rag-assistant`. */
export function slug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function card({ ordinal, title, tags }) {
  const titleLines = wrap(title, 30);
  const tagLines = wrap((tags ?? []).join(" · "), 58);

  const titleY = 196;
  const titleStep = 40;
  const tagY = titleY + titleStep * titleLines.length + 26;

  const text = (x, y, size, fill, content, weight = "normal") =>
    `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" font-weight="${weight}" fill="${fill}" xml:space="preserve">${esc(content)}</text>`;

  // The corner marks are the page's own vocabulary — see CornerMarks.
  const mark = (x, y, dx, dy) =>
    `<path d="M${x + dx * 18} ${y} H${x} V${y + dy * 18}" fill="none" stroke="${ACCENT}" stroke-width="1"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PANEL}"/>
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" fill="none" stroke="${RULE}"/>
  ${mark(24, 24, 1, 1)}
  ${mark(WIDTH - 24, 24, -1, 1)}
  ${mark(24, HEIGHT - 24, 1, -1)}
  ${mark(WIDTH - 24, HEIGHT - 24, -1, -1)}
  ${text(48, 74, 12, ACCENT, "PROJECT", "bold")}
  ${text(48, 148, 84, INK, ordinal, "bold")}
  <line x1="48" y1="168" x2="${WIDTH - 48}" y2="168" stroke="${RULE}"/>
  ${titleLines.map((l, i) => text(48, titleY + i * titleStep, 30, INK, l, "bold")).join("\n  ")}
  ${tagLines.map((l, i) => text(48, tagY + i * 22, 14, PROSE, l)).join("\n  ")}
</svg>
`;
}

const { en } = await import("../src/content/en.ts");

mkdirSync(outDir, { recursive: true });

for (const [i, project] of en.projects.items.entries()) {
  const ordinal = String(i + 1).padStart(3, "0");
  const name = `${slug(project.title)}.svg`;
  const svg = card({ ordinal, title: project.title, tags: project.tags });
  writeFileSync(join(outDir, name), svg, "utf8");
  console.log(
    `  ${ordinal}  ${name.padEnd(34)} ${String(Buffer.byteLength(svg)).padStart(5)} B`,
  );
}

console.log(
  `\n✓ ${en.projects.items.length} placeholder cards in public/images/projects/`,
);
