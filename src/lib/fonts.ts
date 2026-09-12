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
 *
 * ## `adjustFontFallback: false`, and it is a CLS fix
 *
 * next/font's default is to synthesise a `Silkscreen Fallback` @font-face with
 * `size-adjust` derived from Silkscreen's own metrics, so the pre-swap and
 * post-swap text occupy similar space. That works for a normal text face. It
 * fails for a pixel face, whose cap height and advance widths are nothing like
 * a system monospace: the computed adjustment rendered the fallback wordmark
 * large enough to **wrap onto two lines** at 390px, and the swap then pulled
 * the entire hero up by 33px. Measured at 0.078 CLS against a 0.05 budget —
 * `scratchpad/fontdiff.mjs` diffs the geometry with and without the webfont.
 *
 * Unadjusted, the fallback renders at the declared size, "AAYUSH YADAV" fits on
 * one line either way, and the swap changes the glyphs without moving anything
 * below them. A heading that is briefly the wrong font is a smaller problem
 * than a page that jumps once it arrives, and `display: "swap"` survives —
 * which `display: "optional"` would not have: that would have left a slow first
 * load showing the wordmark in plain monospace for the whole visit.
 */
export const pixel = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "monospace"],
});

/** Class string to put on <html>. */
export const fontVariables = `${mono.variable} ${pixel.variable}`;
