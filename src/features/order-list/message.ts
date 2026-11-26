import type { Product } from "@/content/schema";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatPrice } from "@/lib/format";

export type ListItem = { category: string; slug: string; qty: number };

export const MAX_QTY = 99;

export const itemKey = (i: { category: string; slug: string }) =>
  `${i.category}/${i.slug}`;

/** Resolves stored items against the current catalog; unknown products are dropped. */
export function resolveItems(items: ListItem[], products: Product[]) {
  return items.flatMap((item) => {
    const product = products.find(
      (p) => p.category === item.category && p.slug === item.slug,
    );
    return product ? [{ item, product }] : [];
  });
}

/** One plain-text message listing the products, for any messenger. */
export function buildOrderMessage(
  lines: { item: ListItem; product: Product }[],
  locale: Locale,
  dict: Dictionary,
): string {
  const t = dict.orderList;
  const rows = lines.map(({ item, product }) => {
    const size = product.size ? ` (${product.size[locale]})` : "";
    const price = formatPrice(product.price, locale, dict.catalog);
    return `• ${product.name[locale]}${size} × ${item.qty} — ${price}`;
  });
  return [t.greeting, ...rows, "", t.footer].join("\n");
}

/** Pure reducer used by the store (and tests). */
export function updateList(
  items: ListItem[],
  action:
    | { type: "add"; category: string; slug: string }
    | { type: "set"; category: string; slug: string; qty: number }
    | { type: "remove"; category: string; slug: string }
    | { type: "clear" },
): ListItem[] {
  switch (action.type) {
    case "clear":
      return [];
    case "remove":
      return items.filter((i) => itemKey(i) !== itemKey(action));
    case "add": {
      const existing = items.find((i) => itemKey(i) === itemKey(action));
      if (existing)
        return items.map((i) =>
          i === existing ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) } : i,
        );
      return [
        ...items,
        { category: action.category, slug: action.slug, qty: 1 },
      ];
    }
    case "set": {
      const qty = Math.max(0, Math.min(MAX_QTY, Math.round(action.qty)));
      if (qty === 0) return items.filter((i) => itemKey(i) !== itemKey(action));
      return items.map((i) =>
        itemKey(i) === itemKey(action) ? { ...i, qty } : i,
      );
    }
  }
}

/** Accepts only well-formed items from storage (it can be edited by anyone). */
export function sanitizeStored(value: unknown): ListItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (v): v is ListItem =>
        typeof v === "object" &&
        v !== null &&
        typeof (v as ListItem).category === "string" &&
        typeof (v as ListItem).slug === "string" &&
        Number.isInteger((v as ListItem).qty) &&
        (v as ListItem).qty > 0,
    )
    .map((v) => ({
      category: v.category,
      slug: v.slug,
      qty: Math.min(MAX_QTY, v.qty),
    }))
    .slice(0, 50);
}
