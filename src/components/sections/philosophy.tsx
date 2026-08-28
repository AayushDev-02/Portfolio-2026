import {
  AccordionGroup,
  AccordionRow,
  CheckItem,
  CheckList,
  SectionShell,
} from "@/components/primitives";
import { philosophy } from "@/content/reference";

export function PhilosophySection() {
  return (
    <SectionShell
      index={1}
      eyebrow={philosophy.eyebrow}
      position={2}
      total={6}
      id="philosophy"
      caption={philosophy.caption}
      sigil={philosophy.sigil}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-display leading-none tracking-display text-balance">
            {philosophy.heading}
          </h2>
          <p className="max-w-prose text-body text-dim">{philosophy.lead}</p>
        </div>

        <AccordionGroup>
          {philosophy.questions.map((q) => (
            <AccordionRow key={q.question} title={q.question}>
              <CheckList>
                {q.items.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </CheckList>
            </AccordionRow>
          ))}
        </AccordionGroup>
      </div>
    </SectionShell>
  );
}
