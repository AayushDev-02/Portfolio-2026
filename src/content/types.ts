import type { Status } from "@/components/primitives";

/**
 * The shape every locale's content file must satisfy.
 *
 * This is the guarantee that stage 4 rests on: a missing or renamed Japanese
 * key is a compile error, not a blank section discovered in production.
 */

export type PhilosophyQuestion = {
  question: string;
  items: string[];
};

export type TimelineEntry = {
  status: Status;
  title: string;
  period: string;
  items?: { label: string; checked: boolean }[];
};

export type RankResult = {
  label: string;
  value: number;
};

export type FeedbackTheme = {
  title: string;
  body: string;
  quote?: string;
};

export type SiteContent = {
  intro: {
    eyebrow: string;
    title: string;
    status: string;
    promptLine: string;
    caption: string;
    sigil: string;
  };
  philosophy: {
    eyebrow: string;
    heading: string;
    lead: string;
    questions: PhilosophyQuestion[];
    caption: string;
    sigil: string;
  };
  status: {
    eyebrow: string;
    heading: string;
    lead: string;
    entries: TimelineEntry[];
    caption: string;
    sigil: string;
  };
  privacyRound: {
    label: string;
    stats: string;
    ranking: RankResult[];
  };
  results: {
    eyebrow: string;
    heading: string;
    lead: string;
    ctaLabel: string;
    deleteLinkLabel: string;
    deleteLinkHref: string;
    caption: string;
    sigil: string;
  };
  feedback: {
    eyebrow: string;
    heading: string;
    lead: string;
    themes: FeedbackTheme[];
    takeaways: string[];
    caption: string;
    sigil: string;
  };
  history: {
    eyebrow: string;
    heading: string;
    lead: string;
    caption: string;
    sigil: string;
  };
};
