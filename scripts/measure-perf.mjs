/**
 * Stage 7 field measurement.
 *
 * Loads a URL under mobile emulation with Slow 4G and 4x CPU throttling — a
 * mid-range Android on mobile data, which is the machine this site is actually
 * built for — and reports LCP / CLS / FCP plus transferred bytes by type.
 *
 * Node built-ins only, driving headless Chrome over CDP. No dependency: the
 * same approach stages 2R and 3 used for their audits.
 *
 * This is the harness behind PLAN.md §7's LCP target. Lighthouse CI (see
 * .github/workflows/performance.yml) gates every push against the Core Web
 * Vitals thresholds; this script is for the tighter internal target and for
 * seeing *where* the bytes went when it regresses.
 *
 *   node scripts/measure-perf.mjs <url> [runs]
 *
 * Run at least 3 times and read the median. The first run after a deploy hits
 * a cold edge cache and is always an outlier — discard it.
 */
import { spawn } from "node:child_process";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9340;
const URL_ = process.argv[2];
if (!URL_) {
  console.error("usage: node scripts/measure-perf.mjs <url> [runs]");
  process.exit(1);
}
const RUNS = Number(process.argv[3] || 3);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=C:/Users/yadav/AppData/Local/Temp/claude/cdp-perf",
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const j = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("chrome did not expose a debugger");
}

const sock = new WebSocket(await wsUrl());
await new Promise((r) => sock.addEventListener("open", r));
let id = 0;
const pending = new Map();
const events = [];
sock.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  } else if (m.method) events.push(m);
});
let sid = null;
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, (m) => res(m.result ?? m.error));
    sock.send(
      JSON.stringify({ id: i, method, params, ...(sid ? { sessionId: sid } : {}) }),
    );
  });
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return r?.result?.value;
};

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
sid = (await send("Target.attachToTarget", { targetId, flatten: true })).sessionId;
await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");

const results = [];
for (let run = 0; run < RUNS; run++) {
  events.length = 0;
  // Moto G-class device: 4x CPU slowdown, Slow 4G, 390x844 mobile viewport.
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });
  await send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await send("Network.clearBrowserCache");
  await send("Network.setCacheDisabled", { cacheDisabled: true });

  await send("Page.navigate", { url: URL_ });
  await sleep(9000);

  const metrics = await ev(`
  new Promise((resolve) => {
    const out = { lcp: 0, cls: 0, fcp: 0 };
    for (const e of performance.getEntriesByType('paint'))
      if (e.name === 'first-contentful-paint') out.fcp = e.startTime;
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) out.lcp = Math.max(out.lcp, e.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {}
    setTimeout(() => resolve(out), 700);
  })`);

  // Transferred bytes by resource type, from the Network events.
  const bytes = {};
  const typeById = {};
  for (const e of events) {
    if (e.method === "Network.responseReceived")
      typeById[e.params.requestId] = e.params.type;
    if (e.method === "Network.loadingFinished") {
      const t = typeById[e.params.requestId] || "Other";
      bytes[t] = (bytes[t] || 0) + (e.params.encodedDataLength || 0);
    }
  }
  results.push({ ...metrics, bytes });
  console.log(
    `run ${run + 1}: LCP ${(metrics.lcp / 1000).toFixed(2)}s  CLS ${metrics.cls.toFixed(4)}  FCP ${(metrics.fcp / 1000).toFixed(2)}s`,
  );
}

const med = (arr) => arr.slice().sort((a, b) => a - b)[Math.floor(arr.length / 2)];
const lcp = med(results.map((r) => r.lcp));
const cls = med(results.map((r) => r.cls));
const fcp = med(results.map((r) => r.fcp));

console.log("\n=== MEDIAN OF " + RUNS + " RUNS (mobile, Slow 4G, 4x CPU) ===");
const row = (label, val, target, pass) =>
  console.log(
    `  ${label.padEnd(8)} ${String(val).padEnd(12)} ${target.padEnd(14)} ${pass ? "PASS" : "FAIL"}`,
  );
row("LCP", (lcp / 1000).toFixed(2) + " s", "< 1.5 s", lcp < 1500);
row("CLS", cls.toFixed(4), "< 0.05", cls < 0.05);
row("FCP", (fcp / 1000).toFixed(2) + " s", "—", true);

const agg = {};
for (const r of results)
  for (const [k, v] of Object.entries(r.bytes))
    agg[k] = (agg[k] || 0) + v / results.length;
console.log("\n=== TRANSFERRED BYTES (avg, compressed over the wire) ===");
let total = 0;
for (const [k, v] of Object.entries(agg).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(12)} ${(v / 1024).toFixed(1).padStart(8)} KB`);
  total += v;
}
console.log(`  ${"TOTAL".padEnd(12)} ${(total / 1024).toFixed(1).padStart(8)} KB`);

sock.close();
chrome.kill();
process.exit(0);
