import {
  AccordionGroup,
  AccordionRow,
  NumberedItem,
  NumberedList,
  PullQuote,
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
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-display leading-none tracking-display text-balance">
            {feedback.heading}
          </h2>
          <p className="max-w-prose text-body text-dim">{feedback.lead}</p>
        </div>

        <AccordionGroup>
          {feedback.themes.map((theme) => (
            <AccordionRow key={theme.title} title={theme.title}>
              <div className="flex flex-col gap-4">
                <p className="max-w-prose text-body text-dim">{theme.body}</p>
                {theme.quote ? <PullQuote>{theme.quote}</PullQuote> : null}
              </div>
            </AccordionRow>
          ))}
        </AccordionGroup>

        <NumberedList>
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
