import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CursorCrosshair,
  LocaleSwitcher,
  ThemeProvider,
  ThemeToggle,
} from "@/components/primitives";
import { type Locale, locales, routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { isDeployed, siteUrl } from "@/lib/site-url";
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
  // One entry per scheme, so the browser chrome follows the theme instead of
  // pinning a white bar above a dark page. These are literals because a
  // <meta> tag cannot read a CSS variable; keep them in step with the --color-bg
  // values in globals.css.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  // "light dark" rather than "light": this is what makes form controls,
  // scrollbars and the like follow the theme rather than staying light.
  colorScheme: "light dark",
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
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        {/*
          Marks that JavaScript is running, before first paint.

          The scroll-reveal hidden state in globals.css is scoped to [data-js],
          so a visitor without JavaScript never gets it and reads a complete
          page. Inline and blocking on purpose: deferring it would let one frame
          paint with content already hidden and nothing able to reveal it.

          Same technique next-themes uses for the theme attribute, and it must
          run for the same reason.
        */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: a blocking inline script has no other insertion point; the content is a fixed literal with no interpolation.
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-js','')`,
          }}
        />
      </head>
      {/* suppressHydrationWarning is required by next-themes as well as for the
          reason below: its blocking script stamps data-theme on <html> before
          React hydrates, which React would otherwise report as a mismatch.

          It covers only this element's own attributes,
          not its subtree — a real mismatch inside the app still reports.
          Browser extensions (password managers, ColorZilla's
          cz-shortcut-listen, Grammarly) stamp attributes onto <body> before
          React hydrates, which React counts as a server/client mismatch even
          though nothing in this codebase differs. */}
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <NextIntlClientProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:border focus:border-accent focus:bg-bg focus:px-4 focus:py-2 focus:text-ink"
            >
              {t("skipToContent")}
            </a>
            {/* One header for both controls. Neither positions itself, so they
                cannot drift apart or overlap as either one changes width.

                Offset below the counter row rather than sharing it. SectionShell
                puts "01 / 06" at the section's own `py-10 sm:py-14`, and these
                controls used the identical offsets — so the locale switcher was
                already sitting on top of the counter before dark mode, and a
                second control made it unmissable. Stacking beneath is robust in
                a way that dodging the counter's width would not be: the counter
                is a different component and free to change. */}
            <header className="absolute top-20 right-0 z-20 flex items-center gap-3 px-gutter text-eyebrow tracking-label sm:top-28 sm:px-gutter-lg">
              <ThemeToggle
                label={t("theme")}
                lightLabel={t("themeLight")}
                darkLabel={t("themeDark")}
              />
              <LocaleSwitcher current={locale as Locale} label={t("switchLanguage")} />
            </header>
            {/* Sits above the page but below the header controls (z-10 vs
                z-20) and takes no pointer events, so nothing it crosses
                becomes unclickable. Renders nothing on touch or under
                reduced motion. */}
            <CursorCrosshair />
            <main id="main" className="bg-bg">
              {children}
            </main>
            {/*
            Both are cookie-free and collect no personal data, so the site
            needs no consent banner — which is the reason for choosing them
            over anything session-based. They mount last and load after
            hydration, so neither is on the critical path.

            Mounted only on a real host. Their scripts are served from
            /_vercel/... by the platform, so off-platform — local `next start`,
            and CI, where Lighthouse runs — they 404 into the console. That is
            noise in development and a real best-practices failure in CI, for
            beacons that could not have reported anything there anyway.
          */}
            {isDeployed ? (
              <>
                <Analytics />
                <SpeedInsights />
              </>
            ) : null}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
