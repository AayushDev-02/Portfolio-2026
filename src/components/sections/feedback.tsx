import {
  AccordionGroup,
  AccordionRow,
  NumberedItem,
  NumberedList,
  PullQuote,
  SectionHead,
  SectionShell,
} from "@/components/primitives";
import { feedback } from "@/content/reference";

export function FeedbackSection() {
  return (
    <SectionShell
      index={4}
      eyebrow={feedback.eyebrow}
      position={5}
      total={6}
      id="feedback"
      caption={feedback.caption}
      sigil={feedback.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <SectionHead heading={feedback.heading} lede={feedback.lead} />

        <AccordionGroup>
          {feedback.themes.map((theme, i) => (
            <AccordionRow key={theme.title} title={theme.title} defaultOpen={i === 0}>
              <div className="flex flex-col gap-4">
                <p className="max-w-xl font-sans text-ui leading-6 text-prose">
                  {theme.body}
                </p>
                {theme.quote ? <PullQuote>{theme.quote}</PullQuote> : null}
              </div>
            </AccordionRow>
          ))}
        </AccordionGroup>

        <NumberedList className="max-w-xl">
          {feedback.takeaways.map((item, i) => (
            <NumberedItem key={item} index={i + 1}>
              {item}
            </NumberedItem>
          ))}
        </NumberedList>
      </div>
    </SectionShell>
  );
}
