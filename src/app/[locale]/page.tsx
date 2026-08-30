import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  AboutSection,
  ContactSection,
  ExperienceSection,
  IntroSection,
  ProjectsSection,
  SkillsSection,
} from "@/components/sections";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { buildPersonSchema } from "@/lib/person-schema";

/**
 * The homepage: six sections plus the JSON-LD that ties this page, the GitHub
 * profile and the LinkedIn profile together as one identity for a search
 * engine. See lib/person-schema.ts.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const content = getContent(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const personSchema = buildPersonSchema(content, locale, t("description"));

  return (
    <>
      {/*
        Rendered server-side into the static HTML, so it costs no client JS and
        is present in the very first response a crawler sees. The payload is
        built from typed content, never from user input, so there is no string
        to escape — but the `<` in any future value would still need care.
      */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other insertion point; the value is JSON-serialised typed content, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <IntroSection content={content} />
      <AboutSection content={content} />
      <ExperienceSection content={content} />
      <SkillsSection content={content} />
      <ProjectsSection content={content} />
      <ContactSection content={content} locale={locale} />
    </>
  );
}
