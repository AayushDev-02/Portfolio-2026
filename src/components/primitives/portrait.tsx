import { heroImage } from "@/lib/images";

/**
 * The framed image beside the ABOUT copy.
 *
 * It moved here when the hero became a canvas (stage 17). Two things changed
 * with the move, and both are the point:
 *
 * **It is no longer decoration, so `alt` is no longer empty.** As a full-bleed
 * hero backdrop it was texture behind a headline and correctly hidden from
 * assistive technology. In a frame beside the copy it is content, and the alt
 * text comes from `content/*.ts` so it translates like everything else.
 *
 * **Only the portrait crop is used.** The hero art-directed between a landscape
 * and a portrait crop because it was full-bleed at every width; here the frame
 * is portrait-shaped at every width, so the landscape file is simply not
 * referenced. `hero-backdrop.tsx` and `lib/images.ts` are both still in the
 * tree and still correct — nothing about the hero's two-crop reasoning was
 * wrong, it just no longer has a hero to apply to.
 *
 * `loading="lazy"`: ABOUT is below the fold, and the whole reason the hero was
 * replaced is that this file used to be the LCP element. It must not become a
 * competing fetch on the critical path a second time.
 *
 * `hero-image` carries no colour of its own — it applies `--hero-image-filter`,
 * which is `none` in light and dims the image in dark, so this component still
 * knows nothing about themes.
 */
export function Portrait({ alt }: { alt: string }) {
  const { mobile } = heroImage;

  return (
    <figure className="m-0 border border-rule p-2">
      <picture>
        <source type="image/avif" srcSet={mobile.avif} />
        {/* The <img> src is the WebP crop, so a browser that understands
            neither <picture> nor AVIF still gets the image. */}
        <img
          src={mobile.webp}
          alt={alt}
          width={mobile.width}
          height={mobile.height}
          loading="lazy"
          decoding="async"
          className="hero-image block h-full w-full object-cover"
        />
      </picture>
    </figure>
  );
}
