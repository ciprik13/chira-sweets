import { z } from "zod";
import { allergenKeys, units, type ProductInput } from "./schema";

/*
 * The catalog file edited in the CMS (content/catalog/catalog.json).
 * Shaped for editors (simple fields, a "verified" checkbox for allergens,
 * optional slug); converted here to the strict product model in schema.ts.
 */

export const categoryIcons = [
  "macaron",
  "cake",
  "cheesecake",
  "croissant",
  "dessert",
  "strawberry",
  "gift",
  "coffee",
] as const;
export type CategoryIcon = (typeof categoryIcons)[number];

const text = z.object({ ro: z.string().trim(), ru: z.string().trim() });
const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase-with-dashes");

export const catalogFileSchema = z.object({
  categories: z
    .array(
      z.object({
        slug,
        icon: z.enum(categoryIcons),
        name: z.object({
          ro: z.string().trim().min(1),
          ru: z.string().trim().min(1),
        }),
        order: z.number().int().default(0),
      }),
    )
    .min(1),
  products: z.array(
    z.object({
      slug: z.union([slug, z.literal("")]).optional(),
      category: slug,
      name: text,
      description: text.optional(),
      size: text.optional(),
      price: z.object({
        kind: z.enum(["fixed", "from", "onRequest"]),
        amount: z.number().nullish(),
        unit: z.enum(units).nullish(),
      }),
      allergens: z.object({
        verified: z.boolean().default(false),
        contains: z.array(z.enum(allergenKeys)).nullish(),
      }),
      images: z
        .array(
          z.object({
            src: z
              .string()
              .trim()
              .regex(
                /^\/.+\.(jpe?g|png|webp|avif)$/i,
                "photo must be JPG, PNG, WEBP or AVIF (export iPhone HEIC photos as JPG)",
              ),
            alt: text.optional(),
          }),
        )
        .nullish(),
      bestseller: z.boolean().nullish(),
      draft: z.boolean().nullish(),
    }),
  ),
});

export type CatalogFile = z.infer<typeof catalogFileSchema>;

/** "Tort cu fistic și zmeură" → "tort-cu-fistic-si-zmeura". */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyToUndefined = (t?: { ro: string; ru: string }) =>
  t && (t.ro || t.ru) ? t : undefined;

export function fromCatalogFile(file: CatalogFile) {
  const categories = [...file.categories]
    .sort((a, b) => a.order - b.order)
    .map(({ slug, icon, name }) => ({ slug, icon, name }));

  const productInputs: ProductInput[] = file.products.map((p) => {
    const price: ProductInput["price"] =
      p.price.kind === "onRequest"
        ? { kind: "onRequest" }
        : {
            kind: p.price.kind,
            amount: p.price.amount ?? 0, // 0 fails validation with a clear error
            unit: p.price.unit ?? "piece",
          };
    return {
      slug: p.slug || slugify(p.name.ro),
      category: p.category,
      name: p.name,
      description: emptyToUndefined(p.description),
      size: emptyToUndefined(p.size),
      price,
      allergens: p.allergens.verified
        ? { status: "verified", contains: p.allergens.contains ?? [] }
        : { status: "unverified" },
      images: (p.images ?? []).map((img) => ({
        src: img.src,
        // Missing alt text falls back to the product name (never empty).
        alt: {
          ro: img.alt?.ro || p.name.ro,
          ru: img.alt?.ru || p.name.ru,
        },
      })),
      bestseller: p.bestseller ?? false,
      draft: p.draft ?? false,
    };
  });

  return { categories, productInputs };
}
