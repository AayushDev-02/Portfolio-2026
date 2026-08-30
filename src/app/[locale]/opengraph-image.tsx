import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { type Locale, locales } from "@/i18n/routing";
import { loadOgFont } from "@/lib/og-font";
import { siteUrl } from "@/lib/site-url";

/**
 * The share card, one per locale.
 *
 * Deliberately the dark terminal panel rather than the hero photograph: the
 * card is usually seen small, in a feed or a Slack unfurl, where a photograph
 * reduces to mud and the name is the only thing that has to survive. This is
 * the one surface where the site's own idiom — mono, hairlines, one red accent
 * — is doing legibility work rather than decoration.
 *
 * Generated at build time for both locales, so it costs nothing at request time.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Aayush Yadav — Software Engineer, Tokyo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Tokens are duplicated here as literals because satori resolves no CSS
// variables — it never sees globals.css. Keep them in step with @theme.
const INK = "#ededed";
const DIM = "#8b8b8b";
const ACCENT = "#dc2626";
const BG = "#0a0a0a";
const RULE = "rgba(237, 237, 237, 0.18)";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = (locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "en";

  const content = getContent(active);

  const name = content.intro.title;
  const role = content.intro.status;
  const availability = content.contact.availability;
  const eyebrow = active === "ja" ? "ポートフォリオ" : "PORTFOLIO";
  const host = siteUrl.replace(/^https?:\/\//, "");

  // One subset covering every glyph the card actually draws.
  const glyphs = `${name}${role}${availability}${eyebrow}${host}EN / JA`;
  const [regular, bold] = await Promise.all([
    loadOgFont(glyphs, 400),
    loadOgFont(glyphs, 700),
  ]);
  const fonts = [regular, bold].filter((f) => f !== null);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BG,
        padding: "72px 80px",
        // A monospace stack is named even when the fetch failed: satori falls
        // back to its built-in face, which still renders Latin correctly.
        fontFamily: fonts.length > 0 ? "Noto Sans JP" : "monospace",
      }}
    >
      {/* Corner marks, the same device every section on the site uses. */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 22,
            letterSpacing: "0.2em",
            color: ACCENT,
            fontWeight: 700,
          }}
        >
          [ {eyebrow} ]
        </span>
        <span style={{ fontSize: 22, letterSpacing: "0.2em", color: DIM }}>EN / JA</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: name.length > 18 ? 76 : 96,
            fontWeight: 700,
            color: ACCENT,
            lineHeight: 1.1,
            letterSpacing: active === "ja" ? "normal" : "-0.02em",
          }}
        >
          {name}
        </span>
        <span
          style={{
            marginTop: 24,
            fontSize: 34,
            color: INK,
            lineHeight: 1.4,
          }}
        >
          {role}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: `1px solid ${RULE}`,
          paddingTop: 28,
        }}
      >
        <span style={{ fontSize: 26, color: DIM }}>{availability}</span>
        <span style={{ fontSize: 26, color: DIM }}>{host}</span>
      </div>
    </div>,
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
