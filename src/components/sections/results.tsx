import {
  BracketButton,
  RankBar,
  RankList,
  SectionHead,
  SectionShell,
} from "@/components/primitives";
import type { SiteContent } from "@/content";
import { Link } from "@/i18n/navigation";

export function ResultsSection({ content }: { content: SiteContent }) {
  const { privacyRound, results } = content;
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
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={results.heading} lede={results.lead} />

        <div className="flex flex-col items-center gap-1">
          <p className="label text-accent">{privacyRound.label}</p>
          <p className="text-ui tabular-nums text-prose">{privacyRound.stats}</p>
        </div>

        <RankList>
          {privacyRound.ranking.map((r, i) => (
            <RankBar key={r.label} rank={i + 1} label={r.label} value={r.value} />
          ))}
        </RankList>

        <div className="flex flex-col items-center gap-4">
          <BracketButton>{results.ctaLabel}</BracketButton>
          <Link
            href={results.deleteLinkHref}
            className="inline-flex min-h-11 items-center font-sans text-label text-prose underline underline-offset-4 transition-colors duration-150 hover:text-accent"
          >
            {results.deleteLinkLabel}
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
