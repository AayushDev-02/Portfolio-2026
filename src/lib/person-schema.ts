import type { SiteContent } from "@/content";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl } from "./site-url";

/**
 * JSON-LD `Person` for the homepage.
 *
 * This is the piece of stage 8 that does real work for a job search: it is what
 * lets a search engine connect the name a recruiter types to this page, to the
 * GitHub profile, and to the LinkedIn profile, as one identity rather than
 * three unrelated results. The name is given in both scripts for the same
 * reason — a Japanese recruiter is as likely to search 「ヤダフ アーユシュ」 as
 * "Aayush Yadav".
 *
 * **Every field is derived from what the page already displays.** Nothing is
 * asserted here that a visitor cannot read for themselves, which is both an
 * accuracy rule (structured data that disagrees with the page is a manual-action
 * risk) and a privacy one — the address is the city only, never the street, and
 * the phone number that stage 5 kept out of `public/` does not reappear here.
 *
 * `worksFor` is deliberately absent. The employers are named in EXPERIENCE, but
 * nothing in the content model marks which engagement is current, and a stale
 * or wrong employer is worse than none.
 */

/** The name in the other script, so both are searchable. */
const ALTERNATE_NAME: Record<Locale, string> = {
  en: "ヤダフ アーユシュ",
  ja: "Aayush Yadav",
};

const JOB_TITLE: Record<Locale, string> = {
  en: "Software Engineer",
  ja: "ソフトウェアエンジニア",
};

const ADDRESS_LOCALITY: Record<Locale, string> = {
  en: "Tokyo",
  ja: "東京都",
};

export function buildPersonSchema(
  content: SiteContent,
  locale: Locale,
  description: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl(`/${locale}`)}#person`,
    name: content.intro.title,
    alternateName: ALTERNATE_NAME[locale],
    jobTitle: JOB_TITLE[locale],
    description,
    url: absoluteUrl(`/${locale}`),
    email: `mailto:${content.contact.email}`,
    address: {
      "@type": "PostalAddress",
      // City and country only. There is a home address in the 履歴書 that stage
      // 5 refused to publish; it does not get in through the back door here.
      addressLocality: ADDRESS_LOCALITY[locale],
      addressCountry: "JP",
    },
    knowsLanguage: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Japanese", alternateName: "ja" },
    ],
    // The profiles the page already links to. `sameAs` is the property that
    // actually merges these into one entity in a knowledge graph.
    sameAs: content.contact.links.map((link) => link.href),
  };
}
