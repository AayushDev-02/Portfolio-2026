import { GeistMono } from "geist/font/mono";
import { Silkscreen } from "next/font/google";

/**
 * Body / UI face. Matches the reference exactly.
 * Shipped by the `geist` package, self-hosted by next/font — no network hop.
 */
export const mono = GeistMono;

/**
 * Pixel display face for headings.
 *
 * The reference uses a font called "minecraft", which is not freely
 * licensed. Silkscreen is the closest open equivalent on Google Fonts and is
 * self-hosted at build time by next/font — no request to fonts.gstatic.com
 * at runtime.
 *
 * IMPORTANT: Silkscreen has no CJK glyphs. Japanese headings fall back to
 * --font-jp. Never set font-display on a heading that can contain Japanese
 * without that fallback in the stack. See docs/DECISIONS.md.
 */
export const pixel = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
  fallback: ["ui-monospace", "monospace"],
});

/** Class string to put on <html>. */
export const fontVariables = `${mono.variable} ${pixel.variable}`;
