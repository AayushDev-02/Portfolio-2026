import type { Status } from "@/components/primitives";

/**
 * The shape every locale's content file must satisfy.
 *
 * This is the guarantee stage 4 rests on: a key that exists in English and not
 * in Japanese is a compile error, not a blank section found in production.
 */

/** One "[+] question" row that expands to a checklist. ABOUT. */
export type AccordionRowContent = {
  question: string;
  items: string[];
};

/** One numbered milestone card. EXPERIENCE. */
export type TimelineEntry = {
  status: Status;
  title: string;
  period: string;
  items?: { label: string; checked: boolean }[];
};

/** One category in the skills grid. SKILLS. */
export type SkillGroup = {
  name: string;
  items: string[];
};

/** One project write-up. PROJECTS. */
export type ProjectEntry = {
  title: string;
  body: string;
  /** Optional pull quote — the detail worth remembering. */
  quote?: string;
};

/** An external profile or mail link. CONTACT. */
export type ContactLink = {
  label: string;
  href: string;
  /** What the user sees, e.g. "github.com/AayushDev-02". */
  display: string;
};

/**
 * A downloadable document. Only ever redacted, web-safe copies.
 * The 履歴書 is deliberately NOT representable here — it is offered as prose,
 * with no file behind it. See docs/CONTENT-STAGE5.md §1.
 */
export type DocumentLink = {
  label: string;
  href: string;
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
  about: {
    eyebrow: string;
    heading: string;
    lead: string;
    rows: AccordionRowContent[];
    caption: string;
    sigil: string;
  };
  experience: {
    eyebrow: string;
    heading: string;
    lead: string;
    entries: TimelineEntry[];
    caption: string;
    sigil: string;
  };
  skills: {
    eyebrow: string;
    heading: string;
    lead: string;
    groups: SkillGroup[];
    caption: string;
    sigil: string;
  };
  projects: {
    eyebrow: string;
    heading: string;
    lead: string;
    items: ProjectEntry[];
    caption: string;
    sigil: string;
  };
  contact: {
    eyebrow: string;
    heading: string;
    lead: string;
    email: string;
    links: ContactLink[];
    locationLabel: string;
    location: string;
    availabilityLabel: string;
    availability: string;
    documentsLabel: string;
    /** Empty until redacted copies exist. The section renders the note instead. */
    documents: DocumentLink[];
    /** Covers the 履歴書, and stands alone while `documents` is empty. */
    documentsNote: string;
    caption: string;
    sigil: string;
  };
};
