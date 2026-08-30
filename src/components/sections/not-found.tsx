import { BracketButton, SectionHead, SectionShell } from "@/components/primitives";
import type { SiteContent } from "@/content";

/**
 * The 404, in the site's own frame rather than Next's default.
 *
 * A recruiter who mistypes the URL, or follows a stale link from a CV sent
 * months earlier, currently lands on a bare white page in a system font — which
 * reads as broken rather than as "wrong address". This is the same
 * `SectionShell` every real section uses, so the mistake still looks like part
 * of the site.
 *
 * The counter reads 0 of 6 on purpose: this is not one of the six sections, and
 * pretending otherwise would be the kind of detail that undermines the rest.
 *
 * Copy is English regardless of where the visitor came from. Next resolves
 * `notFound()` to the *root* boundary, which sits outside `[locale]/layout.tsx`
 * and therefore has no locale to read. A correct 404 status matters more than
 * localised copy on a page whose only real job is the link home; rendering the
 * localised version from a catch-all page instead would return 200, and a
 * soft-404 is a genuine SEO problem where this is only a cosmetic one.
 */
export function NotFoundSection({ content }: { content: SiteContent }) {
  const { notFound } = content;

  return (
    <SectionShell
      index={0}
      eyebrow={notFound.eyebrow}
      position={0}
      total={6}
      id="not-found"
      caption={notFound.caption}
      sigil={notFound.sigil}
    >
      <div className="flex flex-col items-center gap-10">
        <p className="font-display text-hero sm:text-hero-lg font-bold leading-none tracking-tight text-accent">
          {notFound.code}
        </p>

        <SectionHead heading={notFound.heading} lede={notFound.lead} />

        {/*
          A plain <a>, not the i18n Link: this page renders at the app root,
          outside `[locale]`, where next-intl has no request context to read a
          locale from. `/` is the right target anyway — the middleware sends it
          back to whichever locale the visitor's browser asks for.
        */}
        <BracketButton href="/" external>
          {notFound.homeLabel}
        </BracketButton>
      </div>
    </SectionShell>
  );
}
