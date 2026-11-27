import { z } from "zod";

/**
 * Content model (D-018): typed data files, shaped like CMS collections so a
 * headless CMS can replace them later. Validated in tests and at build time.
 */

export const localized = z.object({
  ro: z.string().trim().min(1),
  ru: z.string().trim().min(1),
});
export type Localized = z.infer<typeof localized>;

export const units = ["piece", "kg", "box", "set", "portion"] as const;

/** D-011: fixed unit price for display products, "from" price for cakes and custom work. */
export const priceSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("fixed"),
    amount: z.number().positive(),
    unit: z.enum(units),
  }),
  z.object({
    kind: z.literal("from"),
    amount: z.number().positive(),
    unit: z.enum(units),
  }),
  z.object({ kind: z.literal("onRequest") }),
]);
export type Price = z.infer<typeof priceSchema>;

/** The 14 allergens of EU Regulation 1169/2011, Annex II. */
export const allergenKeys = [
  "gluten",
  "crustaceans",
  "eggs",
  "fish",
  "peanuts",
  "soy",
  "milk",
  "nuts",
  "celery",
  "mustard",
  "sesame",
  "sulphites",
  "lupin",
  "molluscs",
] as const;
export type AllergenKey = (typeof allergenKeys)[number];

/**
 * Allergens come only from the owner (D-017). Until verified, the product shows
 * "ask us about allergens" and is never treated as "free from" anything.
 */
export const allergensSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("verified"),
    contains: z.array(z.enum(allergenKeys)),
  }),
  z.object({ status: z.literal("unverified") }),
]);
export type Allergens = z.infer<typeof allergensSchema>;

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug");

export const productSchema = z.object({
  slug,
  category: slug,
  name: localized,
  description: localized.optional(),
  /** Free text such as "12 buc · 150 g" / "12 шт · 150 г". */
  size: localized.optional(),
  price: priceSchema,
  allergens: allergensSchema,
  images: z
    .array(z.object({ src: z.string().startsWith("/"), alt: localized }))
    .default([]),
  bestseller: z.boolean().default(false),
  /**
   * Sample entry used to build and review the pages before owner data arrives.
   * Drafts are excluded from production builds (see `isDraftVisible`).
   */
  draft: z.boolean().default(false),
});
export type Product = z.infer<typeof productSchema>;
export type ProductInput = z.input<typeof productSchema>;
