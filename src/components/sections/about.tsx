import {
  AccordionGroup,
  AccordionRow,
  CheckItem,
  CheckList,
  Portrait,
  SectionHead,
  SectionShell,
} from "@/components/primitives";
import type { SiteContent } from "@/content";

/**
 * ABOUT gained the framed image in stage 17, when the hero became a canvas.
 *
 * One column of image against one of copy, in the hairline idiom the rest of
 * the page uses. It sits beside the accordion rather than above the heading so
 * the section still opens on words: this is the first thing after the hero, and
 * a picture is not the claim being made.
 *
 * Below `lg` the image stacks under the copy rather than beside it. Putting it
 * first on a phone would push the lede off the fold, which is the one thing a
 * fifteen-second skim cannot afford.
 */
export function AboutSection({ content }: { content: SiteContent }) {
  const { about } = content;

  return (
    <SectionShell
      index={1}
      eyebrow={about.eyebrow}
      position={2}
      id="about"
      caption={about.caption}
      sigil={about.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={about.heading} lede={about.lead} />

        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start lg:gap-14">
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

          <div className="order-last mx-auto w-full max-w-xs lg:order-none lg:max-w-none">
            <Portrait alt={about.portraitAlt} />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
