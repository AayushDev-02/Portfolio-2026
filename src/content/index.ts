import type { Locale } from "@/i18n/routing";
import { en } from "./en";
import { ja } from "./ja";
import type { ContactFormCopy, SiteContent } from "./types";

const content: Record<Locale, SiteContent> = { en, ja };

/** The one place a section reaches for copy. */
export function getContent(locale: Locale): SiteContent {
  return content[locale];
}

export type { ContactFormCopy, SiteContent };
