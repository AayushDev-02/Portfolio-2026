import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // "as-needed" would leave English unprefixed. We prefix both so the two
  // locales are symmetric: /en and /ja, with hreflang pointing at real URLs
  // rather than one bare path and one prefixed. `/` redirects by
  // Accept-Language, and the cookie next-intl sets survives a manual switch.
  localePrefix: "always",
});
