import { isLocale, locales, type Locale } from "./config";

/**
 * Static pages and their translated slugs (docs/sitemap.md).
 * Category and product slugs below /catalog are shared by both languages.
 */
export const pageSlugs = {
  home: { ro: "", ru: "" },
  catalog: { ro: "catalog", ru: "katalog" },
  events: { ro: "evenimente", ru: "meropriyatiya" },
  delivery: { ro: "livrare", ru: "dostavka" },
  about: { ro: "despre", ru: "o-nas" },
  faq: { ro: "intrebari", ru: "voprosy" },
  contact: { ro: "contact", ru: "kontakty" },
  privacy: { ro: "confidentialitate", ru: "konfidentsialnost" },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof pageSlugs;

/** Builds an internal URL with a trailing slash (next.config `trailingSlash: true`). */
export function href(locale: Locale, page: PageKey, ...rest: string[]): string {
  const parts = [locale, pageSlugs[page][locale], ...rest].filter(Boolean);
  return `/${parts.join("/")}/`;
}

function pageKeyForSlug(locale: Locale, slug: string): PageKey | undefined {
  return (Object.keys(pageSlugs) as PageKey[]).find(
    (key) => pageSlugs[key][locale] === slug,
  );
}

/**
 * Maps the current path to the same page in another language.
 * Unknown paths fall back to the target language's home page.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const [first, second, ...rest] = pathname.split("/").filter(Boolean);
  if (!first || !isLocale(first)) return href(target, "home");
  if (!second) return href(target, "home");

  const key = pageKeyForSlug(first, second);
  if (!key) return href(target, "home");
  return href(target, key, ...rest);
}

/** Every static page path in every language, for sitemap and hreflang. */
export function allStaticPaths(): {
  page: PageKey;
  paths: Record<Locale, string>;
}[] {
  return (Object.keys(pageSlugs) as PageKey[]).map((page) => ({
    page,
    paths: Object.fromEntries(
      locales.map((locale) => [locale, href(locale, page)]),
    ) as Record<Locale, string>,
  }));
}
