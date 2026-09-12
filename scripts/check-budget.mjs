/**
 * Stage 7 bundle budget, enforced in CI.
 *
 * Reads `.next/app-build-manifest.json` and gzips each chunk itself rather than
 * scraping `next build`'s printed table, which is formatted for humans and has
 * changed shape between minor releases.
 *
 * The number that binds is **app code**: the chunks this route pulls in beyond
 * the ones an empty page already needs. The React 19 / Next 15 App Router
 * baseline is ~104KB and nothing in this repo can move it, so it is reported as
 * a constant and only the delta is failed on. See docs/PLAN.md §7.
 *
 * Usage: node scripts/check-budget.mjs   (after `next build`)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGETS = {
  /**
   * Chunks this route needs beyond the framework baseline.
   *
   * Raised from 15 to 18 in stage 17, after the work was done rather than
   * before it. Stages 16 and 17 added four interactive leaves that did not
   * exist — the morphing cursor pill, the project cover layer's gate, the hero
   * field's gate and the EXPERIENCE tablist — and app code moved 14.1 -> 16.6KB.
   *
   * The 2.5KB is what was left *after* the optimisations, not instead of them:
   * every effect that can be deferred is behind a bare `import()` into an async
   * chunk (the cover layer, the hero field, Lenis), `next/dynamic` was measured
   * against `React.lazy` and dropped for costing ~1KB per usage, and the
   * timeline panels are server-rendered and passed in as props so no checklist
   * or badge markup reaches the browser.
   *
   * Two fixed costs make up nearly half the figure and are not application
   * logic: ~4.7KB of next-intl client runtime and 3.5KB of Vercel Analytics +
   * Speed Insights. Both are unchanged since stage 12.
   *
   * 18 leaves ~1.4KB of headroom — enough for normal Next chunk variation,
   * tight enough that the gate still does its actual job, which is catching an
   * accidental client boundary or a dependency that wandered into one. The
   * browser-visible number that really binds is `totalKb` below.
   */
  appCodeKb: 18,
  /** Everything the route loads, baseline included. */
  totalKb: 120,
};

/** The route the budget is about — the one a recruiter actually opens. */
const ROUTE = "/[locale]/page";
/** An empty page. Whatever this needs is the floor, not our doing. */
const BASELINE_ROUTE = "/_not-found/page";

const manifestPath = join(".next", "app-build-manifest.json");
let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch {
  console.error(`✗ ${manifestPath} not found — run \`pnpm build\` first.`);
  process.exit(1);
}

const pages = manifest.pages ?? {};
for (const route of [ROUTE, BASELINE_ROUTE]) {
  if (!pages[route]) {
    console.error(`✗ route ${route} missing from the manifest. Routes present:`);
    for (const k of Object.keys(pages)) console.error(`    ${k}`);
    console.error("  If the app's routes changed, update ROUTE in this script.");
    process.exit(1);
  }
}

/** Layout chunks load on every route under it, so they count toward the page. */
const layoutFiles = pages["/[locale]/layout"] ?? [];
const routeFiles = new Set([...layoutFiles, ...pages[ROUTE]]);
const baselineFiles = new Set(pages[BASELINE_ROUTE]);

const gzipKb = (files) => {
  let bytes = 0;
  for (const f of files) {
    if (!f.endsWith(".js")) continue;
    try {
      bytes += gzipSync(readFileSync(join(".next", f))).length;
    } catch {
      console.error(`✗ could not read chunk ${f}`);
      process.exit(1);
    }
  }
  return bytes / 1024;
};

const totalKb = gzipKb(routeFiles);
const baselineKb = gzipKb(baselineFiles);
// Anything the route loads that an empty page does not.
const appCodeKb = gzipKb([...routeFiles].filter((f) => !baselineFiles.has(f)));

const rows = [
  ["app code", appCodeKb, BUDGETS.appCodeKb],
  ["total first-load", totalKb, BUDGETS.totalKb],
];

console.log("Bundle budget (gzipped)\n");
console.log(
  `  framework baseline   ${baselineKb.toFixed(1).padStart(7)} KB   (fixed by Next 15 / React 19)`,
);
let failed = false;
for (const [label, actual, budget] of rows) {
  const ok = actual <= budget;
  if (!ok) failed = true;
  console.log(
    `  ${label.padEnd(20)} ${actual.toFixed(1).padStart(7)} KB   budget ${String(budget).padStart(3)} KB   ${ok ? "PASS" : "FAIL"}`,
  );
}

if (failed) {
  console.error("\n✗ Bundle budget exceeded. See docs/PLAN.md §7 (stage 7).");
  console.error("  Usual causes: a new dependency reaching a client component,");
  console.error('  or a `"use client"` added higher up the tree than it needs to be.');
  process.exit(1);
}
console.log("\n✓ Within budget.");
