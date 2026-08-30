"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps the app in next-themes.
 *
 * A client component, but a thin one: it renders only a context provider, so
 * nothing below it is pulled onto the client. The theme *toggle* is the leaf
 * that actually needs interactivity.
 *
 * `disableTransitionOnChange` matters more here than it looks. Every colour in
 * this design sits behind a `transition-colors duration-150`, so without it a
 * theme switch animates the entire page at once — a slow, muddy wipe rather
 * than a switch. next-themes suppresses transitions for one frame.
 *
 * `attribute="data-theme"` rather than a class, because the CSS override block
 * keys on `[data-theme="dark"]` and needs `[data-theme="light"]` to be
 * expressible too — that is what lets an explicit light choice beat a dark OS
 * preference. See the DARK MODE block in globals.css.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
