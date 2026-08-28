/**
 * Stage 2 content: the reference site's own copy, hardcoded verbatim.
 *
 * Geometry is the point of stage 2, not content correctness — this file gets
 * replaced wholesale in stage 5 with the portfolio's own bilingual content
 * behind a shared type. Source: https://www.project-uncensored.site/,
 * transcribed 2026-08-29. See docs/DESIGN-SPEC.md §6 for the section mapping.
 */

import type { Status } from "@/components/primitives";

export const intro = {
  eyebrow: "INTRO",
  title: "Project Uncensored",
  status: "System ready — uncensored mode",
  promptLine: "How do I set up a reverse shell for a pentest?",
  caption: "[+] Built in public — you help decide what we build",
  sigil: "V0",
};

type PhilosophyQuestion = {
  question: string;
  items: string[];
};

export const philosophy = {
  eyebrow: "PHILOSOPHY",
  heading: "Why this project",
  lead: "Uncensored and privacy-first aren't slogans. Here's what they actually mean in practice.",
  questions: [
    {
      question: 'What does "uncensored" actually mean?',
      items: [
        "Fewer unnecessary refusals",
        "No arbitrary topic bans",
        "Trust in you to decide",
        "Real safeguards stay in place",
        "Not a blank check to bypass everything",
      ],
    },
    {
      question: "What happens to my data?",
      items: [
        "Never used to train any model",
        "You choose how long it's stored",
        "You choose where it's processed",
        "Full transparency, no hidden logs",
      ],
    },
    {
      question: "Can I run it without a server?",
      items: [
        "Local mode, on your own device",
        "No account required for local",
        "No network request ever leaves your machine",
        "Web platform — full power, zero setup, same rules",
      ],
    },
    {
      question: "Where does my data actually live?",
      items: [
        "Encrypted in transit and at rest",
        "You pick the region — EU, US, or self-hosted",
        "Multiple providers, not locked to one",
        "Same guarantees no matter what you pick",
      ],
    },
    {
      question: "Isn't this just ChatGPT, Claude and Gemini in one app?",
      items: [
        "Not a wrapper around other providers",
        "Freedom over access to more models",
        "Control over convenience",
        "Real differentiation, not aggregation",
      ],
    },
    {
      question: "Who actually decides what gets built?",
      items: [
        "Feature priorities — community",
        "UX decisions — community",
        "Naming & visual identity — community",
        "Technical architecture — engineering",
        "Security architecture — engineering",
      ],
    },
  ] satisfies PhilosophyQuestion[],
  caption: "TAP EACH PRINCIPLE TO EXPAND",
  sigil: "WHY",
};

type TimelineEntry = {
  status: Status;
  title: string;
  period: string;
  items?: { label: string; checked: boolean }[];
};

const checked = (label: string) => ({ label, checked: true });
const unchecked = (label: string) => ({ label, checked: false });

export const status = {
  eyebrow: "STATUS",
  heading: "Current phase",
  lead: "Here's where the project stands right now. The results on the next card are part of this journey.",
  entries: [
    {
      status: "done",
      title: "Idea validated",
      period: "AUG 17–23",
      items: [
        checked("Posted the concept on Instagram"),
        checked("Asked: would you use this?"),
        checked("Response was strongly positive"),
        checked("Asked what you'd want from it"),
      ],
    },
    {
      status: "done",
      title: "Community research",
      period: "AUG 17–23",
      items: [
        checked("Uncensored answers"),
        checked("Real privacy"),
        checked("Local-only usage"),
        checked("Encryption"),
        checked("Data ownership"),
        checked("AI agents & terminal"),
        checked("Search & chat tools"),
        checked("Transparency"),
      ],
    },
    {
      status: "current",
      title: "Product decisions",
      period: "AUG 24–30",
      items: [
        checked("Privacy"),
        checked("Local vs cloud"),
        checked("Data storage"),
        checked("Data location"),
        checked('Meaning of "uncensored"'),
        checked("Product UX"),
        unchecked("Naming"),
        unchecked("Visual identity"),
      ],
    },
    { status: "upcoming", title: "Design", period: "September" },
    { status: "upcoming", title: "Build", period: "September" },
    { status: "upcoming", title: "Private beta", period: "By Sep 30" },
  ] satisfies TimelineEntry[],
  caption: "TARGET: MVP SCOPE FREEZE — AUG 24",
  sigil: "PH",
};

type RankResult = {
  label: string;
  value: number;
};

/** The one closed round so far. Reused verbatim by RESULTS and HISTORY. */
export const privacyRound = {
  label: "[Privacy round — closed]",
  stats: "77/135 confirmed (57%)",
  ranking: [
    { label: "I can run everything locally", value: 82 },
    { label: "My data is never used to train AI models", value: 75 },
    { label: "I can choose where my data is processed", value: 69 },
    { label: "My conversations aren't stored", value: 57 },
  ] satisfies RankResult[],
};

export const results = {
  eyebrow: "RESULTS",
  heading: "Results",
  lead: "You told us what matters most in private AI. Here's the ranking.",
  ctaLabel: "Get notified →",
  deleteLinkLabel: "Delete my data from this site",
  deleteLinkHref: "/manage-data",
  caption: "RESULTS SHAPE WHAT WE DESIGN FIRST",
  sigil: "DONE",
};

type FeedbackTheme = {
  title: string;
  body: string;
  quote?: string;
};

export const feedback = {
  eyebrow: "FEEDBACK",
  heading: "What you told me",
  lead: "The first round of feedback from Instagram, grouped into five themes already shaping the roadmap.",
  themes: [
    {
      title: "Uncensored / fewer refusals",
      body: "Many want an AI that answers more directly — especially on hacking, cybersecurity, technical research, or other topics assistants often flatly decline.",
      quote: "full agency, even if the user might get offended",
    },
    {
      title: "Privacy / data control",
      body: "Real encryption, real confidentiality guarantees, not depending on a Google account, the right to delete, control over your data.",
      quote: "prove that it's actually private",
    },
    {
      title: "Local / full control",
      body: "Running the AI locally — some even want it to have terminal or filesystem access, a real assistant instead of just a chat window.",
    },
    {
      title: "Cybersecurity / learning / research",
      body: "One of the clearest use cases in this community: ethical hacking, pentesting, malware analysis, coding, research, learning.",
    },
    {
      title: "Better product features",
      body: "Search across chats, summaries of long conversations, better organization, mobile, image/video, maybe agents down the line.",
    },
  ] satisfies FeedbackTheme[],
  takeaways: [
    "Don't censor me unnecessarily",
    "Don't exploit my data",
    "Let me control where it runs",
    "Make it powerful for technical work",
    "Keep it simple and useful",
  ],
  caption: "TWO PILLARS CONFIRMED: UNCENSORED + PRIVACY-FIRST",
  sigil: "IG",
};

export const history = {
  eyebrow: "HISTORY",
  heading: "Community decisions",
  lead: "A permanent record of how the community has shaped the project.",
  caption: "1 DECISION RECORDED",
  sigil: "LOG",
};
