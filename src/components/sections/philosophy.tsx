import {
  AccordionGroup,
  AccordionRow,
  CheckItem,
  CheckList,
  SectionHead,
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
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={philosophy.heading} lede={philosophy.lead} />

        <AccordionGroup>
          {philosophy.questions.map((q, i) => (
            <AccordionRow key={q.question} title={q.question} defaultOpen={i === 0}>
              <CheckList columns={2}>
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
