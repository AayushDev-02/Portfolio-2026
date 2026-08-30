import { NotFoundSection } from "@/components/sections";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { mono, pixel } from "@/lib/fonts";
import "./globals.css";

export const metadata = {
  title: "404 — Page not found",
  robots: { index: false, follow: true },
};

/**
 * Lifts the two font variables onto `:root` for this page only.
 *
 * `[locale]/layout.tsx` is acting as this app's root layout — that is what lets
 * it own `<html lang>` — so a `not-found` at the app root sits outside it and
 * Next wraps this page in a generated `<html><body>` carrying neither the
 * stylesheet nor the font classes.
 *
 * Putting `fontVariables` on a wrapping `<div>` looks like the fix and is not.
 * globals.css declares the composite tokens on `:root`:
 *
 *     --font-display: var(--font-pixel), var(--font-geist-mono), …;
 *
 * A `var()` inside a custom property's value is resolved **where that property
 * is declared**, not where it is used. At `:root` there is no `--font-pixel` on
 * this page, so `--font-display` becomes invalid at computed-value time, and
 * every heading falls back to Tailwind preflight's sans stack. No amount of
 * defining the variables further down the tree changes that.
 *
 * So they are defined at `:root`, from next/font's own resolved family names —
 * no token is duplicated, and nothing here can drift from `@theme`.
 */
function RootFontVariables() {
  const css = `:root{--font-geist-mono:${mono.style.fontFamily};--font-pixel:${pixel.style.fontFamily};}`;
  // biome-ignore lint/security/noDangerouslySetInnerHtml: a <style> tag has no other insertion point; the value is next/font's generated family names, not user input.
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/**
 * The styled 404.
 *
 * Renders on Vercel but **not** under a local `next start`, which serves Next's
 * built-in error page instead — verify any change here against a deploy.
 *
 * `min-h-dvh` not `min-h-screen`, per CLAUDE.md rule 3: iOS Safari's toolbar
 * clips a 404 as readily as it clips a section.
 */
export default function NotFound() {
  return (
    <>
      <RootFontVariables />
      <div className="min-h-dvh bg-bg font-mono text-ink antialiased">
        <main>
          <NotFoundSection content={getContent(routing.defaultLocale)} />
        </main>
      </div>
    </>
  );
}
