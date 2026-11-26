import type { ReactNode } from "react";
import { cormorant, jost } from "@/app/fonts";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { MobileActionBar } from "./mobile-action-bar";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/**
 * Root document for one language. Each language folder (src/app/ro, src/app/ru)
 * is its own root layout so <html lang> is correct in the static export.
 */
export function LocaleShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${jost.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#content"
          className="sr-only z-50 rounded-full bg-gold-bright px-4 py-2 text-wine-deep focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.skipToContent}
        </a>
        <SiteHeader locale={locale} dict={dict} />
        <main id="content">{children}</main>
        <SiteFooter locale={locale} dict={dict} />
        <MobileActionBar dict={dict} />
      </body>
    </html>
  );
}
