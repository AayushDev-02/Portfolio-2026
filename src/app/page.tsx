import { BracketButton, SectionShell, TerminalHero } from "@/components/primitives";

/**
 * Stage 0 placeholder. Stage 2 replaces this with the six cloned sections.
 */
export default function Home() {
  return (
    <SectionShell
      index={0}
      eyebrow="Intro"
      position={1}
      total={6}
      id="intro"
      caption="Stage 0 — foundation"
      sigil="V0"
    >
      <TerminalHero
        status="System ready — build in progress"
        title="Aayush Yadav"
        lines={["Software engineer in Japan. Portfolio under construction."]}
      />

      <div className="mt-12 flex flex-wrap gap-4">
        <BracketButton href="/dev/kitchen-sink" tone="accent">
          Kitchen sink →
        </BracketButton>
      </div>
    </SectionShell>
  );
}
