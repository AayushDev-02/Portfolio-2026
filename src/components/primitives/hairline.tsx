import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * A rule that draws itself in from the left as it enters view. Stage 12 §C.
 *
 * A real element rather than a `border`, because `transform` cannot touch a
 * border and the brief forbids animating `width` — width would force layout on
 * every frame, which is exactly what the 0.05 CLS budget and the INP budget are
 * protecting. `scaleX` is compositor-only.
 *
 * A Server Component: the observer lives in `Reveal`, and nothing here needs
 * the client.
 *
 * `index` staggers rules that share a section, 40ms apart.
 */
export function Hairline({
  tone = "rule",
  index = 0,
  className,
}: {
  tone?: "rule" | "accent";
  index?: number;
  className?: string;
}) {
  return (
    <Reveal variant="rule" index={index} amount={0} className={className}>
      <div
        aria-hidden="true"
        className={cn(
          "h-px w-full origin-left",
          tone === "accent" ? "bg-accent" : "bg-rule",
        )}
      />
    </Reveal>
  );
}
