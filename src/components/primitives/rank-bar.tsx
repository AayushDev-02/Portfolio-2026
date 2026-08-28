import { pad } from "@/lib/utils";

type Props = {
  /** One-based rank, rendered as "01." */
  rank: number;
  label: string;
  /** 0–100. */
  value: number;
};

/** A ranked result row with a hairline fill bar: "01. Label ......... 82%". */
export function RankBar({ rank, label, value }: Props) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-label sm:text-ui">
          <span className="tabular-nums text-prose">{pad(rank)}.</span>{" "}
          <span className="text-ink">{label}</span>
        </span>
        <span className="text-label sm:text-ui tabular-nums text-accent">{clamped}%</span>
      </div>

      {/* biome-ignore lint/a11y/useSemanticElements: native <meter> can't be styled to match the reference's hairline fill bar */}
      <div
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-px w-full bg-rule"
      >
        <div className="h-px bg-accent" style={{ width: `${clamped}%` }} />
      </div>
    </li>
  );
}

export function RankList({ children }: { children: React.ReactNode }) {
  return <ul className="flex w-full max-w-xl flex-col gap-6">{children}</ul>;
}
