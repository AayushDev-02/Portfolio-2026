import { NotFoundSection } from "@/components/sections";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata = {
  title: "404 — Page not found",
  robots: { index: false, follow: true },
};

/**
 * The styled 404.
 *
 * This page has no layout above it that it controls. `[locale]/layout.tsx` is
 * acting as this app's root layout — that is what lets it own `<html lang>` and
 * the font variables — and a `not-found` at the app root sits outside it, so
 * Next wraps this in a generated `<html><body>` that carries neither.
 *
 * Two consequences, both handled here:
 *
 * 1. The stylesheet is imported directly, since nothing else pulls it in.
 * 2. `font-mono` is on this element and not only `fontVariables`. Custom
 *    properties resolve where the *declaration* sits, and globals.css declares
 *    `font-family: var(--font-mono)` on `body` — a parent of this div. At that
 *    point `--font-geist-mono` is not yet defined, so it fell through to
 *    `ui-monospace`, and this div inherited the already-computed value. Naming
 *    the family here, where the variables are in scope, is what actually makes
 *    the 404 match the rest of the site.
 *
 * `min-h-dvh` not `min-h-screen`, per CLAUDE.md rule 3 — iOS Safari's toolbar
 * clips a 404 as readily as it clips a section.
 *
 * Note this renders on Vercel but not under a local `next start`, which serves
 * Next's built-in page instead. Verify 404 changes against a deploy.
 */
export default function NotFound() {
  return (
    <div className={`${fontVariables} font-mono min-h-dvh bg-bg text-ink antialiased`}>
      <main>
        <NotFoundSection content={getContent(routing.defaultLocale)} />
      </main>
    </div>
  );
}
