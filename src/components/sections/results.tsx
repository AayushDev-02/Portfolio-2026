import Link from "next/link";
import { BracketButton, RankBar, RankList, SectionShell } from "@/components/primitives";
import { privacyRound, results } from "@/content/reference";

export function ResultsSection() {
  return (
    <SectionShell
      index={3}
      eyebrow={results.eyebrow}
      position={4}
      total={6}
      id="results"
      caption={results.caption}
      sigil={results.sigil}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-display leading-none tracking-display text-balance">
            {results.heading}
          </h2>
          <p className="max-w-prose text-body text-dim">{results.lead}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="label text-dim">{privacyRound.label}</p>
          <p className="text-body tabular-nums text-dim">{privacyRound.stats}</p>
        </div>

        <RankList>
          {privacyRound.ranking.map((r, i) => (
            <RankBar key={r.label} rank={i + 1} label={r.label} value={r.value} />
          ))}
        </RankList>

        <div className="flex flex-wrap items-center gap-6">
          <BracketButton tone="accent">{results.ctaLabel}</BracketButton>
          <Link
            href={results.deleteLinkHref}
            className="text-body text-dim underline decoration-rule-strong underline-offset-4 transition-colors duration-150 hover:text-accent"
          >
            {results.deleteLinkLabel}
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
