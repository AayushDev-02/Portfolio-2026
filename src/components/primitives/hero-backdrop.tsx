import { heroImage } from "@/lib/images";

/**
 * Full-bleed hero photograph with a gradient fading its lower third into the
 * page. Decorative: empty alt, and hidden from assistive tech.
 *
 * Two crops rather than one responsive source — the desktop frame is
 * landscape, the mobile one portrait, so `sizes` alone cannot do it.
 *
 * This is the LCP element, so how the browser *chooses* between them is the
 * whole point. The previous version rendered both `next/image`s and hid one
 * with `sm:hidden`, which does not cancel a fetch — and `priority` preloaded
 * both on top of that, so a phone downloaded 264KB to display 80KB of it.
 *
 * `hero-image` carries no colour of its own — it applies `--hero-image-filter`,
 * which is `none` in light and dims the photograph in dark, so this component
 * still knows nothing about themes.
 *
 * `<picture>` resolves the choice in the preload scanner, before a single byte
 * is requested: exactly one `<source>` matches, and only that file is fetched.
 * AVIF is offered first with a WebP sibling behind it, so the format is
 * negotiated in the same pass. `fetchPriority="high"` restores the head start
 * that `priority` used to give, without preloading anything twice.
 */
export function HeroBackdrop() {
  const { desktop, mobile, desktopMedia, alt } = heroImage;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <picture>
        <source media={desktopMedia} type="image/avif" srcSet={desktop.avif} />
        <source media={desktopMedia} type="image/webp" srcSet={desktop.webp} />
        <source type="image/avif" srcSet={mobile.avif} />
        {/* Final fallback: the <img> src below is the WebP mobile crop, so a
            browser that understands neither <picture> nor AVIF still gets art
            rather than a blank panel. */}
        <img
          src={mobile.webp}
          alt={alt}
          width={mobile.width}
          height={mobile.height}
          fetchPriority="high"
          decoding="async"
          className="hero-image absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-bg" />
    </div>
  );
}
