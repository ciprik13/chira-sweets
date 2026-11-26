import { catalogContent } from "./categories";
import type { ProductInput } from "./schema";

/**
 * Product list, edited in the CMS (content/catalog/catalog.json).
 * Rules (content-plan): no invented prices or allergens. Draft samples use
 * "price on request" and unverified allergens, and never reach production.
 */
export const productInputs: ProductInput[] = catalogContent.productInputs;
