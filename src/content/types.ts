import type { Status } from "@/components/primitives";
import type { ContactErrorCode } from "@/lib/contact-contract";

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
  /** Client or employer, shown under the title. Omitted for personal work. */
  org?: string;
  body: string;
  /** Optional pull quote — the detail worth remembering. */
  quote?: string;
  /** Stack chips. Kept short: these are scanned, not read. */
  tags?: string[];
  /**
   * Exactly one entry may set this. The featured project gets the wide column
   * and the architecture diagram; the rest share the asymmetric grid below it.
   */
  featured?: boolean;
};

/**
 * One measured outcome, pulled out of project prose into the RESULTS band.
 *
 * Split into three parts rather than one string because the display face
 * renders only the figure — the unit and the sentence are set in mono and sans
 * respectively, at a fraction of the size. See docs/STAGE13-DESIGN.md §C.
 */
export type ResultFigure = {
  /** The number alone, e.g. "1,400". Rendered in the pixel display face. */
  value: string;
  /** Unit line beneath it, e.g. "hours / year". */
  unit: string;
  /** One sentence saying what produced it. */
  caption: string;
};

/**
 * Labels for the retrieval-pipeline diagram.
 *
 * Every string the SVG draws lives here so the diagram translates with the rest
 * of the site — a diagram that stays English on the Japanese page is worse than
 * no diagram, because it looks like an oversight rather than a choice.
 *
 * `title` and `desc` are the accessible name and description, not decoration:
 * they are what a screen reader reads instead of the drawing.
 */
export type PipelineDiagram = {
  title: string;
  desc: string;
  ingestRow: string;
  queryRow: string;
  scale: string;
  documents: string;
  documentsSub: string;
  chunker: string;
  chunkerSub: string;
  embeddings: string;
  embeddingsSub: string;
  index: string;
  indexSub: string;
  question: string;
  embedQuery: string;
  retriever: string;
  retrieverSub: string;
  answer: string;
  answerSub: string;
  returnLabel: string;
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

/**
 * Every string the contact form can show, including one per failure mode.
 *
 * This lives in the content layer rather than the next-intl catalogue because
 * `errors` is keyed by `ContactErrorCode`: adding a code in `lib/contact-contract.ts`
 * without writing both translations is then a compile error, which is the same
 * guarantee `SiteContent` gives the rest of the page. See docs/DECISIONS.md.
 */
export type ContactFormCopy = {
  /** Heading above the form itself, below the details list. */
  heading: string;
  intro: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  /** Hint under the message field: the 20-character minimum. */
  messageHint: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  /** Screen-reader-only label on the honeypot. Humans never read it. */
  honeypotLabel: string;
  /** Where the message goes and what is stored. Sits under the button. */
  privacyNote: string;
  errors: Record<ContactErrorCode, string>;
};

/** The in-style 404. Content, not chrome, so it stays typed per locale. */
export type NotFoundContent = {
  eyebrow: string;
  code: string;
  heading: string;
  lead: string;
  /** Label on the link back to the homepage. */
  homeLabel: string;
  caption: string;
  sigil: string;
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
  /**
   * The numbers band. Deliberately not a full-height section — it is half the
   * height of its neighbours, and that break in rhythm is the point.
   * See docs/STAGE13-DESIGN.md §A and §C.
   */
  results: {
    eyebrow: string;
    /** Sits opposite the eyebrow, e.g. "From delivered work, not estimates". */
    note: string;
    figures: ResultFigure[];
    caption: string;
    sigil: string;
  };
  projects: {
    eyebrow: string;
    heading: string;
    lead: string;
    items: ProjectEntry[];
    /** Small heading above the diagram, e.g. "Retrieval pipeline". */
    diagramLabel: string;
    diagram: PipelineDiagram;
    caption: string;
    sigil: string;
  };
  notFound: NotFoundContent;
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
    form: ContactFormCopy;
    caption: string;
    sigil: string;
  };
};
