/**
 * Font data for `ImageResponse`, fetched at build time.
 *
 * Satori (which renders the OG image) needs real font *data* — it cannot use a
 * CSS variable, a system stack, or next/font. That is a problem the rest of the
 * site does not have: the page falls back per-glyph to `--font-jp` for
 * Japanese, but an OG image has no fallback chain. Without a CJK face the
 * Japanese card would render every kana and kanji as a blank box.
 *
 * Two details make this workable:
 *
 * 1. **Subset to the exact string.** Google Fonts' `text=` parameter returns
 *    only the glyphs actually used, so a card with ~40 Japanese characters
 *    fetches a few KB rather than a multi-megabyte CJK face.
 * 2. **Ask for TrueType.** The CSS API serves woff2 to modern browsers, which
 *    satori cannot parse. An old user-agent string gets a `.ttf` back.
 *
 * Noto Sans JP covers Latin as well as kana and kanji, so one family renders
 * both locales' cards and there is no second fetch to fail.
 */

/** Old UA on purpose: it is what makes the CSS API return TrueType, not woff2. */
const TTF_USER_AGENT = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36";

/**
 * Both fetches are bounded. A hung request to fonts.googleapis.com would
 * otherwise stall `next build` with no useful error — one build here died as
 * "Failed to collect page data for /[locale]/opengraph-image", which says
 * nothing about the network. Failing fast into the Latin-only fallback is
 * always better than a deploy that hangs.
 */
const FETCH_TIMEOUT_MS = 5000;

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

/**
 * Fetches a subset of Noto Sans JP covering exactly `text`.
 *
 * Returns `null` rather than throwing if Google Fonts is unreachable. This runs
 * during `next build`, including in CI, and an OG image is not worth failing a
 * deploy over — the caller renders a Latin-only card instead.
 */
export async function loadOgFont(
  text: string,
  weight: 400 | 700,
): Promise<OgFont | null> {
  const url =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@" +
    `${weight}&text=${encodeURIComponent(text)}`;

  try {
    const css = await fetch(url, {
      headers: { "User-Agent": TTF_USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!css.ok) return null;

    const source = await css.text();
    const match = source.match(/src:\s*url\(([^)]+)\)\s*format\(['"]truetype['"]\)/);
    if (!match?.[1]) return null;

    const file = await fetch(match[1], { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!file.ok) return null;

    return {
      name: "Noto Sans JP",
      data: await file.arrayBuffer(),
      weight,
      style: "normal",
    };
  } catch {
    return null;
  }
}
