import {
  AccordionGroup,
  AccordionRow,
  CheckItem,
  CheckList,
  SectionHead,
  SectionShell,
} from "@/components/primitives";
import type { SiteContent } from "@/content";

export function AboutSection({ content }: { content: SiteContent }) {
  const { about } = content;

  return (
    <SectionShell
      index={1}
      eyebrow={about.eyebrow}
      position={2}
      total={6}
      id="about"
      caption={about.caption}
      sigil={about.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={about.heading} lede={about.lead} />

        <AccordionGroup>
          {about.rows.map((row, i) => (
            <AccordionRow key={row.question} title={row.question} defaultOpen={i === 0}>
              <CheckList columns={2}>
                {row.items.map((item) => (
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
