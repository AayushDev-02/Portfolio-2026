import { Link } from "@/i18n/navigation";
import { type Locale, locales } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABEL: Record<Locale, string> = { en: "EN", ja: "JA" };
/** Each option announced in its own language, per WCAG 3.1.2. */
const LANG_OF: Record<Locale, string> = { en: "en", ja: "ja" };
const NAME_OF: Record<Locale, string> = { en: "English", ja: "日本語" };

/**
 * The `[ EN / JA ]` bracket toggle. Positioned by the header that holds it,
 * alongside the theme toggle, rather than pinning itself.
 *
 * Server component: these are real links, so switching works without JS and
 * the crawler sees both locales. next-intl's middleware writes its locale
 * cookie on the way through, which is what makes the choice stick.
 */
export function LocaleSwitcher({ current, label }: { current: Locale; label: string }) {
  return (
    <nav aria-label={label} className="flex items-center gap-1">
      <span aria-hidden="true" className="text-rule">
        [
      </span>
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 ? (
            <span aria-hidden="true" className="text-rule">
              /
            </span>
          ) : null}
          <Link
            href="/"
            locale={locale}
            hrefLang={LANG_OF[locale]}
            lang={LANG_OF[locale]}
            aria-current={locale === current ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center px-1 transition-colors duration-150",
              locale === current
                ? "text-accent"
                : "text-prose hover:text-ink focus-visible:text-ink",
            )}
          >
            <span className="sr-only">{NAME_OF[locale]}</span>
            <span aria-hidden="true">{LABEL[locale]}</span>
          </Link>
        </span>
      ))}
      <span aria-hidden="true" className="text-rule">
        ]
      </span>
    </nav>
  );
}
