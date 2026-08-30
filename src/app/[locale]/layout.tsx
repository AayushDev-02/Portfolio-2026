import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleSwitcher } from "@/components/primitives";
import { type Locale, locales, routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/site-url";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: t("titleTemplate") },
    description: t("description"),
    robots: { index: true, follow: true },
    alternates: {
      canonical: `/${locale}`,
      // Every locale advertises every other, plus x-default for the
      // unprefixed root. Without these the two locales compete as duplicates.
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": `/${routing.defaultLocale}`,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Opts this route into static rendering; without it every page becomes
  // dynamic the moment a translation is read.
  setRequestLocale(locale);

  const t = await getTranslations("nav");

  return (
    <html lang={locale} className={fontVariables}>
      {/* suppressHydrationWarning covers only this element's own attributes,
          not its subtree — a real mismatch inside the app still reports.
          Browser extensions (password managers, ColorZilla's
          cz-shortcut-listen, Grammarly) stamp attributes onto <body> before
          React hydrates, which React counts as a server/client mismatch even
          though nothing in this codebase differs. */}
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:border focus:border-accent focus:bg-bg focus:px-4 focus:py-2 focus:text-ink"
          >
            {t("skipToContent")}
          </a>
          <LocaleSwitcher current={locale as Locale} label={t("switchLanguage")} />
          <main id="main" className="bg-bg">
            {children}
          </main>
          {/*
            Both are cookie-free and collect no personal data, so the site
            needs no consent banner — which is the reason for choosing them
            over anything session-based. They mount last and load after
            hydration, so neither is on the critical path.

            Rendered only on Vercel. Their scripts are served from
            /_vercel/... by the platform, so off-platform — local `next start`,
            and CI, where Lighthouse runs — they 404 into the console. That is
            noise in development and a real best-practices failure in CI, for
            beacons that could not have reported anything there anyway.
          */}
          {process.env.VERCEL ? (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          ) : null}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
