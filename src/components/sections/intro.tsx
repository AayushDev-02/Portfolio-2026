import { SectionShell, TerminalHero } from "@/components/primitives";
import { intro } from "@/content/reference";

export function IntroSection() {
  return (
    <SectionShell
      index={0}
      eyebrow={intro.eyebrow}
      position={1}
      total={6}
      id="intro"
      caption={intro.caption}
      sigil={intro.sigil}
    >
      <TerminalHero
        status={intro.status}
        title={intro.title}
        lines={[intro.promptLine]}
      />
    </SectionShell>
  );
}
