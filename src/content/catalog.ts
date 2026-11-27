import { categories, type Category } from "./categories";
import { productInputs } from "./products";
import { productSchema, type Product, type ProductInput } from "./schema";

/**
 * Drafts are shown in development and in preview builds with
 * NEXT_PUBLIC_SHOW_DRAFTS=1, never in a normal production build.
 */
export function isDraftVisible(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_SHOW_DRAFTS === "1"
  );
}

/** Validates the raw list; throws with every problem at once (fails the build). */
export function parseProducts(
  inputs: ProductInput[],
  knownCategories: readonly Category[] = categories,
): Product[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  const products: Product[] = [];

  inputs.forEach((input, i) => {
    const result = productSchema.safeParse(input);
    if (!result.success) {
      errors.push(`#${i} ${input.slug ?? "?"}: ${result.error.message}`);
      return;
    }
    const p = result.data;
    if (!knownCategories.some((c) => c.slug === p.category)) {
      errors.push(`${p.slug}: unknown category "${p.category}"`);
    }
    const key = `${p.category}/${p.slug}`;
    if (seen.has(key)) errors.push(`${key}: duplicate slug`);
    seen.add(key);
    products.push(p);
  });

  if (errors.length) {
    throw new Error(`Invalid product data:\n${errors.join("\n")}`);
  }
  return products;
}

const allProducts = parseProducts(productInputs);

export function getProducts(): Product[] {
  const showDrafts = isDraftVisible();
  return allProducts.filter((p) => showDrafts || !p.draft);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return getProducts().filter((p) => p.category === slug);
}

export function getProduct(
  category: string,
  slug: string,
): Product | undefined {
  return getProducts().find((p) => p.category === category && p.slug === slug);
}

export function getBestsellers(): Product[] {
  return getProducts().filter((p) => p.bestseller);
}

export { categories };
