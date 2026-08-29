import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import {
  FeedbackSection,
  HistorySection,
  IntroSection,
  PhilosophySection,
  ResultsSection,
  StatusSection,
} from "@/components/sections";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";

/**
 * The reference cloned one-to-one, in both locales. Content swaps to the
 * portfolio's own copy in stage 5 — see docs/DESIGN-SPEC.md §7.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const content = getContent(locale);

  return (
    <>
      <IntroSection content={content} />
      <PhilosophySection content={content} />
      <StatusSection content={content} />
      <ResultsSection content={content} />
      <FeedbackSection content={content} />
      <HistorySection content={content} />
    </>
  );
}
