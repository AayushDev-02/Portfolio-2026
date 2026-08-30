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
 * **Not yet reachable for a mistyped URL — see docs/DECISIONS.md.** It renders
 * correctly and is prerendered into `_not-found.html` at build, but Next serves
 * its own built-in error page for unmatched paths in this app, because there is
 * no root `app/layout.tsx`: `[locale]/layout.tsx` is filling that role, and
 * `not-found.tsx` boundaries need a real root above them. Both a
 * `[locale]/not-found.tsx` and a `[...rest]` catch-all calling `notFound()`
 * were tried and neither boundary rendered.
 *
 * Wiring it up means restructuring the root layout, which belongs with stage
 * 9's launch work rather than bolted onto stage 8. Kept here because it is the
 * correct destination once that lands, and because it costs nothing meanwhile.
 *
 * No locale layout wraps this page, so the stylesheet and font variables are
 * brought in here. `min-h-dvh` not `min-h-screen`, per CLAUDE.md rule 3 — the
 * iOS Safari toolbar clips a 404 just as readily as a section.
 */
export default function NotFound() {
  return (
    <div className={`${fontVariables} min-h-dvh bg-bg text-ink antialiased`}>
      <main>
        <NotFoundSection content={getContent(routing.defaultLocale)} />
      </main>
    </div>
  );
}
