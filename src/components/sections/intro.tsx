import { HeroGradient, HeroIntro, SectionShell } from "@/components/primitives";
import type { SiteContent } from "@/content";

/**
 * INTRO, rebuilt in stage 18. Two changes, and they are separate decisions that
 * happen to land in the same section.
 *
 * **The ground moves.** `HeroGradient` is the grainy grey field the hero shipped
 * with through stage 16 — `public/images/hero-bg.*` — brought back as a WebGL
 * shader rather than a 99KB photograph, so it drifts and the pointer bends it.
 * Every visitor gets a still CSS version of the same field; the canvas is laid
 * over it only where it is worth the frames. See the component.
 *
 * **The dark terminal panel is gone.** It typed "What have you actually
 * shipped?" at a prompt — a rhetorical question, asked of the recruiter, on the
 * page that exists to answer it. `HeroIntro` answers it instead. See that
 * component and docs/DECISIONS.md.
 *
 * The point field that briefly lived here has moved to PROJECTS, where it sits
 * beside the retrieval pipeline diagram as a captioned exhibit rather than as
 * texture behind a wordmark.
 *
 * The LCP element is unchanged: the wordmark, not an image, so the hero's
 * largest paint still waits on no network fetch.
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
      backdrop={<HeroGradient />}
    >
      <HeroIntro
        title={intro.title}
        status={intro.status}
        statement={intro.statement}
        facts={intro.facts}
        actions={intro.actions}
      />
    </SectionShell>
  );
}
