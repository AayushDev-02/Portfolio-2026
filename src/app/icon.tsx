import { ImageResponse } from "next/og";

/**
 * Favicon: the INTRO section's own sigil on the terminal ground.
 *
 * It existed nowhere until stage 8's Lighthouse pass caught `/favicon.ico`
 * 404ing — which is both a console error and, more to the point, a blank tab
 * for anyone who keeps the site open while they read it.
 *
 * Generated at build rather than checked in as a binary so it stays in step
 * with the palette; stage 11's dark mode will not need to touch it, since the
 * ground here is the terminal panel's black in both themes.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#ef4444",
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: "-0.05em",
      }}
    >
      AY
    </div>,
    size,
  );
}
