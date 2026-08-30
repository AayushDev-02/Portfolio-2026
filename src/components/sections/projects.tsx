import {
  MicroLabel,
  PipelineDiagram,
  PullQuote,
  Reveal,
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

/** One of the five non-featured entries. */
function ProjectCard({ project, index }: { project: ProjectEntry; index: number }) {
  return (
    <article className="flex flex-col gap-2 bg-bg py-6 sm:px-6 lg:first:pl-0">
      <MicroLabel>{String(index).padStart(3, "0")}</MicroLabel>
      <h3 className="text-ui font-bold text-ink">{project.title}</h3>
      {project.org ? <p className="text-label text-prose">{project.org}</p> : null}
      <p className="mt-1 font-sans text-ui leading-6 text-prose">{project.body}</p>
      <div className="mt-2">
        <Tags items={project.tags} />
      </div>
    </article>
  );
}

/**
 * PROJECTS, rebuilt for stage 13 §A and §B.
 *
 * Two changes from the accordion this replaces.
 *
 * **Evidence.** The featured entry shows its architecture. The brief called
 * this the highest-value item on the list, because a portfolio belonging to
 * someone who builds retrieval systems previously contained no diagram, image
 * or screenshot at all — nothing a reader could judge the engineering by.
 *
 * **Asymmetry.** The rest sit in a 1.35/1/1 grid and then a 1/1.35, rather than
 * a uniform stack. Combined with the section running taller than its
 * neighbours, this is where the page stops being six identical frames.
 *
 * The accordion is gone deliberately: content behind a disclosure is content a
 * fifteen-second skim never sees, and this is the section that most needs to be
 * seen. The pull quotes it used to hide are kept on the featured entry only.
 */
export function ProjectsSection({ content }: { content: SiteContent }) {
  const { projects } = content;

  const featured = projects.items.find((item) => item.featured);
  const rest = projects.items.filter((item) => !item.featured);
  const firstRow = rest.slice(0, 3);
  const secondRow = rest.slice(3);

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
      <div className="flex w-full flex-col gap-10">
        {/* Heading beside the lede rather than stacked and centred — the first
            visible break from the frame every other section uses. */}
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-end lg:gap-16">
          <h2 className="font-display text-head sm:text-head-lg font-bold uppercase leading-none tracking-tight text-ink">
            {projects.heading}
          </h2>
          <p className="max-w-xl font-sans text-lede leading-6 text-prose">
            {projects.lead}
          </p>
        </Reveal>

        {featured ? (
          <Reveal className="grid gap-8 border-t border-accent pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,720px)] lg:gap-12">
            <div className="flex flex-col gap-3">
              <MicroLabel className="text-accent">001</MicroLabel>
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
        ) : null}

        <Reveal stagger>
          <div className="grid grid-cols-1 gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
            {firstRow.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i + 2} />
            ))}
          </div>
        </Reveal>

        {secondRow.length > 0 ? (
          <Reveal stagger>
            <div className="grid grid-cols-1 gap-px border-b border-rule bg-rule sm:grid-cols-2 lg:grid-cols-[1fr_1.35fr]">
              {secondRow.map((project, i) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={i + 2 + firstRow.length}
                />
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </SectionShell>
  );
}
