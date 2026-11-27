import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href, type PageKey } from "@/i18n/routes";

const mainPages = [
  "catalog",
  "events",
  "delivery",
  "about",
  "faq",
  "contact",
] as const satisfies readonly PageKey[];

export function mainNav(locale: Locale, dict: Dictionary) {
  return mainPages.map((page) => ({
    page,
    href: href(locale, page),
    label: dict.nav[page],
  }));
}
