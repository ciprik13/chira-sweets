import { describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { formatPrice, pluralize } from "@/lib/format";
import { parseProducts } from "./catalog";
import { categories } from "./categories";
import { productInputs } from "./products";

describe("product data", () => {
  it("is valid and uses known categories", () => {
    expect(() => parseProducts(productInputs)).not.toThrow();
  });

  it("has unique category slugs", () => {
    const slugs = categories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("rejects unknown categories and duplicates", () => {
    const base = {
      slug: "x",
      category: "macarons",
      name: { ro: "X", ru: "X" },
      price: { kind: "onRequest" as const },
      allergens: { status: "unverified" as const },
    };
    expect(() => parseProducts([base, base])).toThrow(/duplicate/);
    expect(() => parseProducts([{ ...base, category: "nope" }])).toThrow(
      /unknown category/,
    );
  });

  it("rejects a product without a Russian name", () => {
    expect(() =>
      parseProducts([
        {
          slug: "x",
          category: "macarons",
          name: { ro: "X", ru: "" },
          price: { kind: "onRequest" },
          allergens: { status: "unverified" },
        },
      ]),
    ).toThrow();
  });
});

describe("formatPrice", () => {
  const ro = getDictionary("ro").catalog;
  const ru = getDictionary("ru").catalog;

  it("formats fixed, from and on-request prices", () => {
    expect(
      formatPrice({ kind: "fixed", amount: 45, unit: "piece" }, "ro", ro),
    ).toBe("45 lei / buc");
    expect(
      formatPrice({ kind: "from", amount: 450, unit: "kg" }, "ro", ro),
    ).toBe("de la 450 lei / kg");
    expect(
      formatPrice({ kind: "from", amount: 450, unit: "kg" }, "ru", ru),
    ).toBe("от 450 лей / кг");
    expect(formatPrice({ kind: "onRequest" }, "ru", ru)).toBe(
      "Цена по запросу",
    );
  });
});

describe("pluralize", () => {
  it("uses Romanian and Russian plural forms", () => {
    const ro = getDictionary("ro").catalog.products;
    const ru = getDictionary("ru").catalog.products;
    expect(pluralize(1, "ro", ro)).toBe("1 produs");
    expect(pluralize(3, "ro", ro)).toBe("3 produse");
    expect(pluralize(20, "ro", ro)).toBe("20 de produse");
    expect(pluralize(1, "ru", ru)).toBe("1 товар");
    expect(pluralize(3, "ru", ru)).toBe("3 товара");
    expect(pluralize(5, "ru", ru)).toBe("5 товаров");
  });
});
