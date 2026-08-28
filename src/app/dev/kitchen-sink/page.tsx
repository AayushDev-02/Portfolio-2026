import type { Metadata } from "next";
import {
  AccordionGroup,
  AccordionRow,
  BracketButton,
  CheckItem,
  CheckList,
  RankBar,
  RankList,
  StatusBadge,
  TerminalHero,
  TimelineCard,
  TimelineGrid,
} from "@/components/primitives";
import { CanvasSlot } from "@/components/three/canvas-slot";

export const metadata: Metadata = {
  title: "Kitchen sink",
  robots: { index: false, follow: false },
};

function Bay({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-start gap-6 border-b border-rule py-14">
      <h2 className="label text-accent">{name}</h2>
      {children}
    </section>
  );
}

/**
 * Every primitive in every state, on one page.
 *
 * This is the stage 1 acceptance surface: if changing a token in globals.css
 * does not change this page correctly, the token system is wrong.
 * Noindexed, and deleted before launch.
 */
export default function KitchenSink() {
  return (
    <div className="mx-auto max-w-5xl px-gutter py-16 sm:px-gutter-lg">
      <header className="flex flex-col gap-3 border-b border-rule pb-8">
        <span className="label text-accent">DEV — not indexed</span>
        <h1 className="font-display text-head sm:text-head-lg font-bold uppercase leading-none tracking-tight text-ink">
          Kitchen Sink
        </h1>
        <p className="max-w-xl font-sans text-lede leading-6 text-prose">
          Every primitive, every state. Token changes must propagate here with no
          component edits.
        </p>
      </header>

      <Bay name="Typography">
        <p className="font-display text-hero sm:text-hero-lg font-bold uppercase leading-none tracking-tight text-accent">
          Hero 48/72
        </p>
        <p className="font-display text-head sm:text-head-lg font-bold uppercase leading-none tracking-tight text-ink">
          Head 36/60
        </p>
        <p className="max-w-xl font-sans text-lede sm:text-lede-lg leading-6 text-prose">
          Lede 16/18 sans — the quick brown fox jumps over the lazy dog.
        </p>
        <p className="max-w-xl font-sans text-lede leading-6 text-prose" lang="ja">
          本文 16px — 日本語のテキストはこのように表示されます。行間と字間が変わります。
        </p>
        <p className="text-ui text-ink">UI 14px mono — accordion titles</p>
        <p className="label text-accent">Eyebrow 11px · 0.2em</p>
        <p className="text-micro tracking-label uppercase text-prose">Micro 10px</p>
        <p className="text-badge font-bold tracking-label text-ink-deep">Badge 9px</p>
      </Bay>

      <Bay name="Colour tokens">
        <div className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-4">
          {[
            ["bg", "bg-bg"],
            ["ink", "bg-ink"],
            ["ink-deep", "bg-ink-deep"],
            ["prose", "bg-prose"],
            ["accent", "bg-accent"],
            ["rule", "bg-rule"],
            ["terminal-bg", "bg-terminal-bg"],
            ["terminal-fg", "bg-terminal-fg"],
          ].map(([name, cls]) => (
            <div key={name} className="bg-bg p-3">
              <div className={`${cls} mb-2 h-10 w-full border border-rule`} />
              <span className="text-micro tracking-label uppercase text-prose">
                {name}
              </span>
            </div>
          ))}
        </div>
      </Bay>

      <Bay name="Terminal hero">
        <div className="w-full">
          <TerminalHero
            status="System ready"
            title="Wordmark"
            lines={["A line that types itself out at the prompt"]}
          />
        </div>
      </Bay>

      <Bay name="Bracket buttons">
        <div className="flex flex-wrap items-center gap-6">
          <BracketButton>Bare →</BracketButton>
          <BracketButton variant="boxed">Boxed</BracketButton>
          <BracketButton disabled>Disabled</BracketButton>
          <BracketButton href="/">As link</BracketButton>
        </div>
      </Bay>

      <Bay name="Status badges">
        <div className="flex flex-wrap gap-6">
          <StatusBadge status="done" />
          <StatusBadge status="current" />
          <StatusBadge status="upcoming" />
        </div>
      </Bay>

      <Bay name="Check list">
        <CheckList>
          <CheckItem>Checked item</CheckItem>
          <CheckItem>Another checked item</CheckItem>
          <CheckItem checked={false}>Unchecked item</CheckItem>
        </CheckList>
      </Bay>

      <Bay name="Accordion">
        <AccordionGroup>
          <AccordionRow title="First row, open by default" defaultOpen>
            <CheckList columns={2}>
              <CheckItem>Reveals a checklist</CheckItem>
              <CheckItem>Keyboard operable</CheckItem>
              <CheckItem>aria-expanded wired up</CheckItem>
            </CheckList>
          </AccordionRow>
          <AccordionRow title="Second row, closed">
            <CheckList>
              <CheckItem>Panel stays in the DOM when hidden</CheckItem>
              <CheckItem checked={false}>So in-page search still finds it</CheckItem>
            </CheckList>
          </AccordionRow>
          <AccordionRow title="日本語の行はここで折り返しの挙動を確認します">
            <CheckList>
              <CheckItem>日本語のチェック項目</CheckItem>
            </CheckList>
          </AccordionRow>
        </AccordionGroup>
      </Bay>

      <Bay name="Timeline cards">
        <TimelineGrid>
          <TimelineCard index={1} status="done" title="Foundation" period="AUG 28">
            <CheckItem>Scaffold</CheckItem>
            <CheckItem>Vercel connected</CheckItem>
          </TimelineCard>
          <TimelineCard index={2} status="current" title="Design system" period="AUG 29">
            <CheckItem>Tokens</CheckItem>
            <CheckItem checked={false}>Fonts subset</CheckItem>
          </TimelineCard>
          <TimelineCard index={3} status="upcoming" title="Clone" period="SEPTEMBER" />
        </TimelineGrid>
      </Bay>

      <Bay name="Rank bars">
        <RankList>
          <RankBar rank={1} label="TypeScript" value={88} />
          <RankBar rank={2} label="Python" value={76} />
          <RankBar rank={3} label="Next.js" value={71} />
          <RankBar rank={4} label="AWS" value={54} />
        </RankList>
      </Bay>

      <Bay name="Canvas slot (Three.js seam)">
        <CanvasSlot
          className="border border-rule"
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <span className="label text-prose">
                Static poster — 3D lands at stage 10
              </span>
            </div>
          }
        />
      </Bay>
    </div>
  );
}
