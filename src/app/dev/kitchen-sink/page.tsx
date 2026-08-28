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
    <section className="flex flex-col gap-6 border-b border-rule py-14">
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
      <header className="flex flex-col gap-3 border-b border-rule-strong pb-8">
        <span className="label text-dim">DEV — not indexed</span>
        <h1 className="font-display text-display leading-none tracking-display">
          Kitchen Sink
        </h1>
        <p className="text-body text-dim">
          Every primitive, every state. Token changes must propagate here with no
          component edits.
        </p>
      </header>

      <Bay name="Typography">
        <p className="font-display text-display leading-none tracking-display">
          Display 48px
        </p>
        <p className="text-body">
          Body 16px — the quick brown fox jumps over the lazy dog.
        </p>
        <p className="text-body" lang="ja">
          本文 16px — 日本語のテキストはこのように表示されます。行間と字間が変わります。
        </p>
        <p className="label text-dim">Label 12px uppercase</p>
        <p className="text-micro tracking-label uppercase text-faint">Micro 10px</p>
      </Bay>

      <Bay name="Colour tokens">
        <div className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-4">
          {[
            ["bg", "bg-bg"],
            ["surface", "bg-surface"],
            ["fg", "bg-fg"],
            ["dim", "bg-dim"],
            ["faint", "bg-faint"],
            ["rule", "bg-rule"],
            ["rule-strong", "bg-rule-strong"],
            ["accent", "bg-accent"],
          ].map(([name, cls]) => (
            <div key={name} className="bg-bg p-3">
              <div className={`${cls} mb-2 h-10 w-full border border-rule`} />
              <span className="text-micro tracking-label uppercase text-faint">
                {name}
              </span>
            </div>
          ))}
        </div>
      </Bay>

      <Bay name="Terminal hero">
        <TerminalHero
          status="System ready"
          title="Wordmark"
          lines={["A line that types itself out at the prompt"]}
        />
      </Bay>

      <Bay name="Bracket buttons">
        <div className="flex flex-wrap gap-4">
          <BracketButton>Default</BracketButton>
          <BracketButton tone="accent">Accent →</BracketButton>
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
            <CheckList>
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
              <span className="label text-faint">
                Static poster — 3D lands at stage 10
              </span>
            </div>
          }
        />
      </Bay>
    </div>
  );
}
