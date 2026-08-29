import {
  AccordionGroup,
  AccordionRow,
  PullQuote,
  SectionHead,
  SectionShell,
} from "@/components/primitives";
import type { SiteContent } from "@/content";

export function ProjectsSection({ content }: { content: SiteContent }) {
  const { projects } = content;

  return (
    <SectionShell
      index={4}
      eyebrow={projects.eyebrow}
      position={5}
      total={6}
      id="projects"
      caption={projects.caption}
      sigil={projects.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={projects.heading} lede={projects.lead} />

        <AccordionGroup>
          {projects.items.map((item, i) => (
            <AccordionRow key={item.title} title={item.title} defaultOpen={i === 0}>
              <div className="flex flex-col gap-4">
                <p className="max-w-xl font-sans text-ui leading-6 text-prose">
                  {item.body}
                </p>
                {item.quote ? <PullQuote>{item.quote}</PullQuote> : null}
              </div>
            </AccordionRow>
          ))}
        </AccordionGroup>
      </div>
    </SectionShell>
  );
}
