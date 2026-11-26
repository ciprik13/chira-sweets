import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import type { PageKey } from "@/i18n/routes";
import { pageAlternates } from "./metadata";

/** Title, description, canonical and hreflang for a static page. */
export function staticPageMetadata(
  locale: Locale,
  page: PageKey,
  meta: { metaTitle: string; metaDescription: string },
): Metadata {
  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    alternates: pageAlternates(locale, page),
  };
}
