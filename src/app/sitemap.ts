import type { MetadataRoute } from "next";
import { categories, getProducts } from "@/content/catalog";
import { localeTags, locales, type Locale } from "@/i18n/config";
import { href, pageSlugs, type PageKey } from "@/i18n/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

function entry(
  path: (l: Locale) => string,
  priority: number,
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: absoluteUrl(path(locale)),
    changeFrequency: "weekly",
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [localeTags[l], absoluteUrl(path(l))]),
      ),
    },
  }));
}

/** US-10: every public page in both languages, with hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = (Object.keys(pageSlugs) as PageKey[]).flatMap((page) =>
    entry(
      (l) => href(l, page),
      page === "home" ? 1 : page === "privacy" ? 0.2 : 0.7,
    ),
  );
  const cats = categories.flatMap((c) =>
    entry((l) => href(l, "catalog", c.slug), 0.8),
  );
  const products = getProducts()
    .filter((p) => !p.draft)
    .flatMap((p) => entry((l) => href(l, "catalog", p.category, p.slug), 0.6));
  return [...pages, ...cats, ...products];
}
