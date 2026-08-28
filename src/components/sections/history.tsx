import { RankBar, RankList, SectionShell } from "@/components/primitives";
import { history, privacyRound } from "@/content/reference";

export function HistorySection() {
  return (
    <SectionShell
      index={5}
      eyebrow={history.eyebrow}
      position={6}
      total={6}
      id="history"
      caption={history.caption}
      sigil={history.sigil}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-display leading-none tracking-display text-balance">
            {history.heading}
          </h2>
          <p className="max-w-prose text-body text-dim">{history.lead}</p>
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
      </div>
    </SectionShell>
  );
}
