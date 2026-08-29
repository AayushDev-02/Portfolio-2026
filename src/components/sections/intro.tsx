import { HeroBackdrop, SectionShell, TerminalHero } from "@/components/primitives";
import { intro } from "@/content/reference";
import { type HeroImage, heroImage } from "@/lib/images";

type Props = {
  /** Backdrop candidate. Defaults to whatever the live site uses. */
  image?: HeroImage;
  /**
   * Anchor id. Overridable only so /dev/hero can stack several copies without
   * duplicating the id that aria-labelledby points at.
   */
  id?: string;
};

export function IntroSection({ image = heroImage, id = "intro" }: Props = {}) {
  return (
    <SectionShell
      index={0}
      eyebrow={intro.eyebrow}
      position={1}
      total={6}
      id={id}
      caption={intro.caption}
      sigil={intro.sigil}
      tone="ink"
      backdrop={<HeroBackdrop image={image} />}
    >
      <TerminalHero
        status={intro.status}
        title={intro.title}
        lines={[intro.promptLine]}
      />
    </SectionShell>
  );
}
