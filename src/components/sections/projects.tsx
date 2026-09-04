import {
  Hairline,
  MicroLabel,
  PipelineDiagram,
  ProjectHoverMedia,
  PullQuote,
  Reveal,
  ScrambleText,
  SectionShell,
} from "@/components/primitives";
import type { ProjectEntry, SiteContent } from "@/content";

/** Stack chips. Scanned, not read — so they stay short and unlinked. */
function Tags({ items, accent = false }: { items?: string[]; accent?: boolean }) {
  if (!items?.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((tag) => (
        <li
          key={tag}
          className={
            accent
              ? "border border-accent/35 px-2 py-0.5 text-badge text-accent"
              : "border border-rule px-2 py-0.5 text-badge text-prose"
          }
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

/**
 * One non-featured project, as a full-width row.
 *
 * This replaces the card grid. Six cards each carrying a paragraph is six
 * paragraphs nobody reads; a row is scanned in the time a skim actually
 * lasts, and the body copy it drops was never doing work at that size. What
 * carries the detail now is the cover art that follows the pointer.
 *
 * `data-project-row` is the hover target for `ProjectHoverMedia` and is set
 * only when the project has art, so a row with no image raises nothing rather
 * than leaving the previous cover hanging. `data-cursor-label` is the same
 * ordinal, so the cursor pill names the row you are on.
 *
 * `data-project-thumb` is an empty slot, `display: none` until a reduced-motion
 * visitor has JavaScript, at which point globals.css reserves its box and the
 * layer portals a static thumbnail in. Keeping the slot empty in the server
 * markup is what makes "no cover is fetched on a phone" a property of the
 * markup rather than a hope about how `display: none` treats a lazy image.
 *
 * Below `sm` this is two lines: index and title, then organisation and tags on
 * one truncated line. The organisation is hidden between `sm` and `lg`, where
 * the row is wide enough for tags but not for a third column.
 */
function ProjectRow({ project, ordinal }: { project: ProjectEntry; ordinal: string }) {
  return (
    <li className="border-b border-rule">
      <div
        data-cursor-label={ordinal}
        data-project-row={project.image ? ordinal : undefined}
        className="group flex min-h-24 flex-col justify-center gap-1 py-6 sm:flex-row sm:items-center sm:gap-6"
      >
        <div className="flex min-w-0 items-center gap-4 sm:flex-1">
          <span className="shrink-0 font-display text-lede-lg font-bold tabular-nums text-prose transition-colors duration-150 group-hover:text-accent sm:text-index">
            {ordinal}
          </span>
          <span data-project-thumb={ordinal} className="shrink-0" />
          <h3 className="min-w-0 truncate text-ui font-bold text-ink sm:text-lede">
            {project.title}
          </h3>
        </div>

        {/* `sm:contents` dissolves this wrapper above the breakpoint, so the
            two lines become two columns of the row without either string being
            written twice. */}
        <div className="flex min-w-0 items-baseline gap-x-3 overflow-hidden pl-14 sm:contents">
          {project.org ? (
            <p className="shrink-0 truncate text-label text-prose sm:hidden lg:block lg:w-44 lg:shrink-0">
              {project.org}
            </p>
          ) : null}
          {project.tags?.length ? (
            <p className="truncate text-badge text-prose sm:shrink-0 sm:overflow-visible sm:text-right sm:whitespace-normal">
              {project.tags.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

/**
 * PROJECTS.
 *
 * **Evidence.** The featured entry shows its architecture. The brief called
 * this the highest-value item on the list, because a portfolio belonging to
 * someone who builds retrieval systems previously contained no diagram, image
 * or screenshot at all — nothing a reader could judge the engineering by.
 *
 * **The rest are a list, not a grid.** Stage 16 replaced the asymmetric card
 * grid with full-width rows separated by hairlines. The cards were competing
 * with the featured entry for the same kind of attention and losing; a rail of
 * rows reads as an index, which is what five supporting projects are.
 *
 * The accordion these all replaced is gone deliberately: content behind a
 * disclosure is content a fifteen-second skim never sees, and this is the
 * section that most needs to be seen. The pull quotes it used to hide are kept
 * on the featured entry only.
 */
export function ProjectsSection({ content }: { content: SiteContent }) {
  const { projects } = content;

  const featured = projects.items.find((item) => item.featured);
  const ordinalOf = (item: ProjectEntry) =>
    String(projects.items.indexOf(item) + 1).padStart(3, "0");
  const rest = projects.items.filter((item) => !item.featured);

  // The rows only. The featured entry is deliberately not a hover target: it
  // already shows its architecture, and a cover sliding over a diagram is noise
  // rather than evidence.
  const media = rest
    .filter((item) => item.image)
    .map((item) => ({
      ordinal: ordinalOf(item),
      image: item.image as NonNullable<ProjectEntry["image"]>,
    }));

  return (
    <SectionShell
      index={4}
      eyebrow={projects.eyebrow}
      position={5}
      id="projects"
      caption={projects.caption}
      sigil={projects.sigil}
    >
      <div className="flex w-full flex-col gap-10">
        {/* Heading beside the lede rather than stacked and centred — the first
            visible break from the frame every other section uses. */}
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-end lg:gap-16">
          <h2 className="font-display text-head font-bold uppercase leading-none tracking-tight text-ink sm:text-head-lg">
            <ScrambleText text={projects.heading} />
          </h2>
          <p className="max-w-xl font-sans text-lede leading-6 text-prose">
            {projects.lead}
          </p>
        </Reveal>

        {featured ? (
          <>
            <Hairline tone="accent" />
            <Reveal className="grid gap-8 pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,720px)] lg:gap-12">
              <div
                data-cursor-label={ordinalOf(featured)}
                className="flex flex-col gap-3"
              >
                <MicroLabel className="text-accent">{ordinalOf(featured)}</MicroLabel>
                <h3 className="text-lede font-bold text-ink">{featured.title}</h3>
                {featured.org ? (
                  <p className="text-label text-prose">{featured.org}</p>
                ) : null}
                <p className="mt-1 font-sans text-ui leading-6 text-prose">
                  {featured.body}
                </p>
                {featured.quote ? <PullQuote>{featured.quote}</PullQuote> : null}
                <div className="mt-2">
                  <Tags items={featured.tags} accent />
                </div>
              </div>

              <figure className="m-0 border border-rule p-5 sm:p-6">
                <figcaption className="mb-4 flex items-baseline justify-between">
                  <MicroLabel>{projects.diagramLabel}</MicroLabel>
                </figcaption>
                <PipelineDiagram labels={projects.diagram} />
              </figure>
            </Reveal>
          </>
        ) : null}

        <Reveal stagger>
          <ul className="border-t border-rule">
            {rest.map((project) => (
              <ProjectRow
                key={project.title}
                project={project}
                ordinal={ordinalOf(project)}
              />
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Mounted once for the whole section, not once per row. Renders nothing
          at all on touch, so no cover is ever fetched there. */}
      <ProjectHoverMedia items={media} />
    </SectionShell>
  );
}
