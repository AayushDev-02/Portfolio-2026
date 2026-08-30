import type { MetadataRoute } from "next";
import { locales, routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site-url";

/**
 * One entry per locale, each advertising the others through `alternates`.
 *
 * The site is a single page per locale, so this is small on purpose — its job
 * is to state that `/en` and `/ja` are translations of one another rather than
 * two thin pages competing for the same queries. `/` is not listed: it is a
 * redirect, and `/dev/kitchen-sink` is not listed because it is `noindex`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    lastModified,
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(`/${l}`)])),
    },
  }));
}
