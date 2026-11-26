import { describe, expect, it } from "vitest";
import { parseProducts } from "./catalog";
import { catalogFileSchema, fromCatalogFile, slugify } from "./catalog-file";

const base = {
  categories: [
    {
      slug: "torturi",
      icon: "cake",
      name: { ro: "Torturi", ru: "Торты" },
      order: 2,
    },
    {
      slug: "macarons",
      icon: "macaron",
      name: { ro: "Macarons", ru: "Макаронс" },
      order: 1,
    },
  ],
  products: [
    {
      category: "torturi",
      name: { ro: "Tort cu fistic și zmeură", ru: "Торт с фисташкой" },
      size: { ro: "", ru: "" },
      price: { kind: "from", amount: 450, unit: "kg" },
      allergens: { verified: true, contains: ["nuts", "milk"] },
      images: [{ src: "/uploads/tort.jpg" }],
    },
    {
      slug: "",
      category: "macarons",
      name: { ro: "Macarons", ru: "Макаронс" },
      price: { kind: "onRequest", amount: null, unit: null },
      allergens: { verified: false, contains: ["gluten"] },
    },
  ],
};

describe("catalog file (CMS) → product model", () => {
  it("slugifies Romanian names", () => {
    expect(slugify("Tort cu fistic și zmeură")).toBe(
      "tort-cu-fistic-si-zmeura",
    );
    expect(slugify("  Căpșuni în ciocolată! ")).toBe("capsuni-in-ciocolata");
  });

  it("converts editor fields and fills defaults", () => {
    const { categories, productInputs } = fromCatalogFile(
      catalogFileSchema.parse(base),
    );
    expect(categories.map((c) => c.slug)).toEqual(["macarons", "torturi"]);
    const [tort, macarons] = parseProducts(productInputs, categories);
    expect(tort?.slug).toBe("tort-cu-fistic-si-zmeura");
    expect(tort?.size).toBeUndefined();
    expect(tort?.price).toEqual({ kind: "from", amount: 450, unit: "kg" });
    expect(tort?.allergens).toEqual({
      status: "verified",
      contains: ["nuts", "milk"],
    });
    expect(tort?.images[0]?.alt.ro).toBe("Tort cu fistic și zmeură");
    expect(macarons?.slug).toBe("macarons");
    // Unverified allergens are never published, even if boxes were ticked.
    expect(macarons?.allergens).toEqual({ status: "unverified" });
  });

  it("rejects a fixed price without an amount", () => {
    const bad = structuredClone(base);
    bad.products[0]!.price = {
      kind: "fixed",
      amount: null as unknown as number,
      unit: "piece",
    };
    const { categories, productInputs } = fromCatalogFile(
      catalogFileSchema.parse(bad),
    );
    expect(() => parseProducts(productInputs, categories)).toThrow(/amount/);
  });

  it("rejects HEIC photos with a clear message", () => {
    const bad = structuredClone(base);
    bad.products[0]!.images = [{ src: "/uploads/IMG_0001.HEIC" }];
    expect(() => catalogFileSchema.parse(bad)).toThrow(/HEIC/);
  });
});
