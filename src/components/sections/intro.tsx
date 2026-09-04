import { HeroField, SectionShell, TerminalHero } from "@/components/primitives";
import type { SiteContent } from "@/content";

/**
 * The hero shows retrieval instead of describing it: `HeroField` is a drift of
 * points that the pointer queries, lighting its nearest neighbours and leaving
 * the rest alone. It replaces the photograph, which moved into ABOUT — see
 * `Portrait` and docs/DECISIONS.md.
 *
 * A consequence worth stating rather than discovering: the LCP element is now
 * the wordmark rather than an image, so the hero's largest paint no longer waits
 * on a network fetch.
 */
export function IntroSection({ content }: { content: SiteContent }) {
  const { intro } = content;
  return (
    <SectionShell
      index={0}
      eyebrow={intro.eyebrow}
      position={1}
      id="intro"
      caption={intro.caption}
      sigil={intro.sigil}
      tone="ink"
      backdrop={<HeroField />}
    >
      <TerminalHero
        status={intro.status}
        title={intro.title}
        lines={[intro.promptLine]}
      />
    </SectionShell>
  );
}
