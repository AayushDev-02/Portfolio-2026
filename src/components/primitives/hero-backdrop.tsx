import Image from "next/image";
import { heroImage } from "@/lib/images";

/**
 * Full-bleed hero photograph with a gradient fading its lower third into the
 * page. Decorative: empty alt, and hidden from assistive tech.
 *
 * Two crops rather than one responsive source — the desktop frame is
 * landscape, the mobile one portrait, so `sizes` alone can't do it.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Image
        src={heroImage.mobile.src}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover sm:hidden"
      />
      <Image
        src={heroImage.desktop.src}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="hidden object-cover sm:block"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-bg" />
    </div>
  );
}
