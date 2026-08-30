/**
 * The site's own absolute URL, used for canonicals, hreflang, the sitemap and
 * OG image URLs. Everything in stage 8 depends on this being right.
 *
 * It is resolved rather than read, because reading it directly is what broke:
 * `NEXT_PUBLIC_SITE_URL` was left at its `.env.example` default in Vercel, so
 * production served `<link rel="canonical" href="http://localhost:3000/en">`.
 * A canonical pointing at localhost tells Google the real page is somewhere it
 * cannot reach — the failure costs the whole point of the site, and nothing
 * about the page looks wrong when it happens.
 *
 * So a localhost value is not trusted when a real deployment URL is available:
 *
 *   1. `NEXT_PUBLIC_SITE_URL`, unless it is localhost and we are on Vercel.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` — the stable production domain, set by
 *      Vercel at build time. Deliberately not `VERCEL_URL`, which is unique per
 *      deployment: a canonical must not change every time you push.
 *   3. localhost, for local development.
 */

const LOCAL = "http://localhost:3000";

function isLocal(url: string): boolean {
  return url.includes("localhost") || url.includes("127.0.0.1");
}

/** Strips a trailing slash so callers can always append `/${path}`. */
function normalise(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (explicit && !(isLocal(explicit) && production)) return normalise(explicit);
  if (production) return normalise(production);
  return explicit ? normalise(explicit) : LOCAL;
}

export const siteUrl = resolve();

/** Absolute URL for a path. `absoluteUrl("/en")` -> "https://…/en". */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
