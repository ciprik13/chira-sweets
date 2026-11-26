import type { Metadata } from "next";
import { localeTags, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href, type PageKey } from "@/i18n/routes";
import { SITE_NAME, SITE_URL } from "./site";

/** Base metadata for a language root layout; pages override title/description. */
export function localeMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.title, template: `%s · ${SITE_NAME}` },
    description: dict.meta.description,
    openGraph: {
      siteName: SITE_NAME,
      locale: localeTags[locale].replace("-", "_"),
      type: "website",
    },
    icons: { icon: "/brand/logo-round-wine.svg" },
  };
}

/** Canonical + hreflang alternates for a static page. */
export function pageAlternates(
  locale: Locale,
  page: PageKey,
): Metadata["alternates"] {
  return {
    canonical: href(locale, page),
    languages: {
      ...Object.fromEntries(locales.map((l) => [localeTags[l], href(l, page)])),
      "x-default": href("ro", page),
    },
  };
}
