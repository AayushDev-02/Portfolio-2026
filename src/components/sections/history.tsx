import { RankBar, RankList, SectionHead, SectionShell } from "@/components/primitives";
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
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={history.heading} lede={history.lead} />

        <div className="flex flex-col items-center gap-1">
          <p className="label text-accent">{privacyRound.label}</p>
          <p className="text-ui tabular-nums text-prose">{privacyRound.stats}</p>
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
