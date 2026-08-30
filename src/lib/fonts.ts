import { Geist_Mono, Silkscreen } from "next/font/google";

/**
 * Body / UI face. Matches the reference exactly.
 *
 * Loaded through next/font/google rather than the `geist` package, which ships
 * the variable font whole: 70KB over the wire, nearly as much as the hero
 * photograph, for a site that renders no glyph outside Latin in this face
 * (Japanese falls through to --font-jp by design). next/font subsets to latin
 * at build time and still self-hosts the result, so there is no request to
 * fonts.gstatic.com at runtime. See docs/DECISIONS.md.
 */
export const mono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

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
