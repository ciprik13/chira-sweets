import type { Price } from "@/content/schema";
import { localeTags, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type CatalogDict = Dictionary["catalog"];

export function formatAmount(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(localeTags[locale], {
    maximumFractionDigits: 2,
  }).format(amount);
}

/** "45 lei / buc", "de la 450 lei / kg", "Preț la cerere" (D-011). */
export function formatPrice(
  price: Price,
  locale: Locale,
  t: CatalogDict,
): string {
  if (price.kind === "onRequest") return t.priceOnRequest;
  const template = price.kind === "from" ? t.priceFrom : t.priceFixed;
  const amount = template.replace(
    "{amount}",
    formatAmount(price.amount, locale),
  );
  return `${amount} / ${t.units[price.unit]}`;
}

/** Romanian and Russian plural forms via Intl.PluralRules. */
export function pluralize(
  count: number,
  locale: Locale,
  forms: Dictionary["catalog"]["products"],
): string {
  const rule = new Intl.PluralRules(localeTags[locale]).select(count);
  const form = forms[rule as keyof typeof forms] ?? forms.other;
  return `${count} ${form}`;
}

export function fill(template: string, values: Record<string, string>): string {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key: string) => values[key] ?? `{${key}}`,
  );
}
