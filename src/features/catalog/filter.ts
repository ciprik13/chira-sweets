import type { Category } from "@/content/categories";
import type { AllergenKey, Product } from "@/content/schema";

export type CatalogFilters = {
  q: string;
  category: string | null;
  freeFrom: AllergenKey[];
  withPrice: boolean;
  maxPrice: number | null;
};

export const emptyFilters: CatalogFilters = {
  q: "",
  category: null,
  freeFrom: [],
  withPrice: false,
  maxPrice: null,
};

/** Allergens offered as "free from" filters — the common ones in a pastry shop. */
export const freeFromOptions: AllergenKey[] = [
  "gluten",
  "nuts",
  "milk",
  "eggs",
];

/** Lowercase, no diacritics: "Căpșuni" and "capsuni" match; works for Cyrillic. */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

export function isActive(f: CatalogFilters): boolean {
  return Boolean(
    f.q.trim() ||
    f.category ||
    f.freeFrom.length ||
    f.withPrice ||
    f.maxPrice !== null,
  );
}

function priceOf(p: Product): number | null {
  return p.price.kind === "onRequest" ? null : p.price.amount;
}

export function filterProducts(
  products: Product[],
  categories: readonly Category[],
  f: CatalogFilters,
): Product[] {
  const terms = normalize(f.q).split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    if (f.category && p.category !== f.category) return false;

    if (f.freeFrom.length) {
      // Unverified allergen data never counts as "free from" (US-03).
      if (p.allergens.status !== "verified") return false;
      const contains = p.allergens.contains;
      if (f.freeFrom.some((a) => contains.includes(a))) return false;
    }

    const price = priceOf(p);
    if ((f.withPrice || f.maxPrice !== null) && price === null) return false;
    if (f.maxPrice !== null && price !== null && price > f.maxPrice)
      return false;

    if (terms.length) {
      const category = categories.find((c) => c.slug === p.category);
      const haystack = normalize(
        [
          p.name.ro,
          p.name.ru,
          p.description?.ro,
          p.description?.ru,
          category?.name.ro,
          category?.name.ru,
        ]
          .filter(Boolean)
          .join(" "),
      );
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });
}

/** URL query <-> filters, so a filtered view can be shared. */
export function filtersToQuery(f: CatalogFilters): string {
  const params = new URLSearchParams();
  if (f.q.trim()) params.set("q", f.q.trim());
  if (f.category) params.set("cat", f.category);
  if (f.freeFrom.length) params.set("fara", f.freeFrom.join(","));
  if (f.withPrice) params.set("pret", "1");
  if (f.maxPrice !== null) params.set("max", String(f.maxPrice));
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function filtersFromQuery(
  search: string,
  categorySlugs: readonly string[],
): CatalogFilters {
  const params = new URLSearchParams(search);
  const cat = params.get("cat");
  const max = Number(params.get("max"));
  return {
    q: (params.get("q") ?? "").slice(0, 100),
    category: cat && categorySlugs.includes(cat) ? cat : null,
    freeFrom: (params.get("fara") ?? "")
      .split(",")
      .filter((a): a is AllergenKey =>
        (freeFromOptions as string[]).includes(a),
      ),
    withPrice: params.get("pret") === "1",
    maxPrice: Number.isFinite(max) && max > 0 ? max : null,
  };
}
