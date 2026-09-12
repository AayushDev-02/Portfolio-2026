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

/**
 * One fact in the hero's scan strip.
 *
 * The hero used to end in a dark terminal panel typing "What have you actually
 * shipped?" — a rhetorical question asked of the reader, on a page whose entire
 * job is answering it. These are the four things a recruiter checks before
 * anything else, set flat on the page where they can be read in one pass.
 *
 * Four, and the number is load-bearing: they lay out as one row above `sm` and
 * two below it, and a fifth breaks both.
 */
export type HeroFact = {
  /** Micro-label, e.g. "BASED". Uppercase in English; plain in Japanese. */
  label: string;
  value: string;
};

/**
 * One call to action under the hero.
 *
 * `href` is an in-page anchor (`#projects`), never a route. It is rendered
 * through `BracketButton external`, because the locale-aware `Link` would
 * rewrite a bare hash into `/en#projects` and reload the page to reach an
 * element already on it.
 */
export type HeroAction = {
  label: string;
  href: string;
};

/** One role on the EXPERIENCE rail. */
export type TimelineEntry = {
  status: Status;
  title: string;
  /**
   * The display string, e.g. "JUN 2025 – PRESENT" or 「2025年6月〜現在」.
   * Translatable, and the only date a reader ever sees.
   */
  period: string;
  /**
   * ISO year-month, e.g. "2025-06". Not shown to anyone — this is what places
   * the marker on the rail.
   *
   * Deliberately separate from `period`: a position computed from a localised
   * display string would either break on the Japanese one or force both locales
   * into an English date format. Keeping them apart means positions are
   * identical in both locales and hand-placing a marker is impossible.
   */
  start: string;
  /** Same format. `null` means the role is current and the bar runs open. */
  end: string | null;
  items?: { label: string; checked: boolean }[];
};

/**
 * One horizontal band of the SKILLS stack diagram.
 *
 * This replaced `SkillGroup` in stage 17. Nine flat categories made SKILLS the
 * tallest section on the page at ~1676px, and nine bulleted lists say nothing
 * about how the pieces relate — a reader had to already know which of them sit
 * on top of which. Five layers in build order say it without a sentence.
 *
 * Nothing was invented and nothing dropped in the move: every entry from the
 * old nine lists sits in one of the five, and the only merges are where the
 * lists repeated each other (the old AI and Search categories both claimed
 * vector search).
 */
export type SkillLayer = {
  /** Layer name, e.g. "AI & Retrieval". */
  name: string;
  /** One short line saying what this layer does. */
  note: string;
  items: string[];
  /**
   * Exactly one layer sets this, and it is AI & Retrieval: it is what the whole
   * page argues for, so the diagram draws it on the terminal ground the way the
   * pipeline diagram marks where the answer is produced.
   *
   * Required rather than optional on purpose. Optional would let one locale
   * quietly emphasise a different band; required makes a mismatch a compile
   * error, which is the guarantee the rest of this file exists for.
   */
  emphasis: boolean;
};

/**
 * The stack diagram's accessible name and description.
 *
 * Not decoration: these are what a screen reader is given *instead of* the
 * drawing, so they carry the argument rather than captioning it. Same contract
 * as `PipelineDiagram["title"]` / `["desc"]`.
 */
export type StackDiagram = {
  title: string;
  desc: string;
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
  /**
   * Cover art for the row's hover preview. Optional on purpose: a project with
   * no image still renders its row, it simply raises nothing on hover. The
   * layout must never wait on art that does not exist yet.
   */
  image?: ProjectImage;
};

/**
 * The cover image behind one project row.
 *
 * `src` is a complete path under `/images/projects/`, currently pointing at the
 * placeholder cards `scripts/make-project-placeholders.mjs` generates. When
 * real screenshots land they become `.avif` with a `.webp` sibling served
 * through `<picture>` — the pattern and the reasoning are in
 * `src/components/primitives/hero-backdrop.tsx` and `src/lib/images.ts` — and
 * each file stays under 60KB.
 *
 * `width` and `height` are the intrinsic dimensions, so the browser can reserve
 * the box before the bytes arrive.
 *
 * **`alt` is never empty, and it is per locale.** This is not decoration the
 * way the hero photograph was: it is the only picture of the work on the page.
 * The following layer is `aria-hidden` and drops the alt, because the row it
 * shadows already carries the project's name; the reduced-motion thumbnail
 * inside the row is a real image and uses it.
 */
export type ProjectImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
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

/**
 * Labels for the nearest-neighbour exhibit in PROJECTS.
 *
 * Separate from `PipelineDiagram` rather than folded into it: they are two
 * drawings with two accessible descriptions, and merging them would make a
 * screen reader announce one picture where there are two.
 */
export type FieldExhibitCopy = {
  /** Micro-label above the panel, e.g. "NEAREST-NEIGHBOUR SEARCH". */
  label: string;
  /** One line saying what the pointer does. Sentence case, not a heading. */
  caption: string;
  title: string;
  desc: string;
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
    /**
     * The role line, under the wordmark. Also the subtitle on the OG card —
     * see app/[locale]/opengraph-image.tsx — so it has to stand alone.
     */
    status: string;
    /**
     * One sentence saying what he builds and for whom. The thing the hero
     * previously did not say.
     */
    statement: string;
    facts: HeroFact[];
    actions: HeroAction[];
    caption: string;
    sigil: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    lead: string;
    /**
     * Alt text for the framed image beside the copy, which moved here from the
     * hero in stage 17. Not empty, because it is no longer decoration.
     *
     * NOTE: the file behind it is still the abstract placeholder study the hero
     * shipped with — there is no photograph of Aayush in the repo yet. This
     * string describes what is actually on screen, and must be rewritten in
     * both locales at the same time as the file is replaced. See
     * docs/PROGRESS.md.
     */
    portraitAlt: string;
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
    layers: SkillLayer[];
    diagram: StackDiagram;
    /** Heading for the block under the diagram, e.g. "Certifications". */
    certificationsLabel: string;
    /** Not a layer of anything, so deliberately not one of the five. */
    certifications: string[];
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
    /**
     * The live nearest-neighbour exhibit that sits under the pipeline diagram.
     *
     * It moved here from the hero in stage 18, where it was a full-bleed
     * backdrop and read as page texture rather than as a picture of retrieval.
     * `title` and `desc` are what a screen reader is given *instead of* the
     * drawing, the same contract `PipelineDiagram` has — so they carry the
     * argument rather than captioning it.
     */
    field: FieldExhibitCopy;
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
