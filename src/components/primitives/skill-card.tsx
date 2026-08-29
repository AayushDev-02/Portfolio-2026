import { CheckItem, CheckList } from "./check-item";

/**
 * One skill category in the SKILLS grid.
 *
 * This is what replaced the reference's rank bars. A percentage beside a skill
 * is a self-rating, not a measurement — see docs/DECISIONS.md. The category is
 * the claim; the projects section is the evidence.
 */
export function SkillCard({ name, items }: { name: string; items: string[] }) {
  return (
    <section className="flex flex-col gap-4 bg-bg p-gutter">
      <h3 className="text-ui font-bold text-ink">{name}</h3>
      <CheckList>
        {items.map((item) => (
          <CheckItem key={item}>{item}</CheckItem>
        ))}
      </CheckList>
    </section>
  );
}
