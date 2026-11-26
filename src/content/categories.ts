import type { Locale } from "@/i18n/config";
import raw from "../../content/catalog/catalog.json";
import {
  catalogFileSchema,
  fromCatalogFile,
  type CategoryIcon,
} from "./catalog-file";

export type { CategoryIcon };

export type Category = {
  slug: string;
  icon: CategoryIcon;
  name: Record<Locale, string>;
};

/** Parsed once; edited in the CMS (content/catalog/catalog.json). */
export const catalogContent = fromCatalogFile(catalogFileSchema.parse(raw));

/** Catalog categories (D-012), in the order set in the CMS. Slugs are shared by both languages. */
export const categories: readonly Category[] = catalogContent.categories;
