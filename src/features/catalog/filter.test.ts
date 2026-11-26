import { describe, expect, it } from "vitest";
import { categories } from "@/content/categories";
import { parseProducts } from "@/content/catalog";
import {
  emptyFilters,
  filterProducts,
  filtersFromQuery,
  filtersToQuery,
  isActive,
} from "./filter";

const products = parseProducts([
  {
    slug: "capsuni-in-ciocolata",
    category: "fructe-in-ciocolata",
    name: { ro: "Căpșuni în ciocolată", ru: "Клубника в шоколаде" },
    price: { kind: "fixed", amount: 250, unit: "box" },
    allergens: { status: "verified", contains: ["milk"] },
  },
  {
    slug: "tort-fistic",
    category: "torturi",
    name: { ro: "Tort cu fistic", ru: "Фисташковый торт" },
    price: { kind: "from", amount: 450, unit: "kg" },
    allergens: {
      status: "verified",
      contains: ["gluten", "nuts", "milk", "eggs"],
    },
  },
  {
    slug: "macarons",
    category: "macarons",
    name: { ro: "Macarons asortate", ru: "Ассорти макаронс" },
    price: { kind: "onRequest" },
    allergens: { status: "unverified" },
  },
]);

const slugs = (list: { slug: string }[]) => list.map((p) => p.slug);
const run = (f: Partial<typeof emptyFilters>) =>
  slugs(filterProducts(products, categories, { ...emptyFilters, ...f }));

describe("filterProducts", () => {
  it("returns everything without filters", () => {
    expect(run({})).toHaveLength(3);
    expect(isActive(emptyFilters)).toBe(false);
  });

  it("searches names in both languages, ignoring diacritics and case", () => {
    expect(run({ q: "capsuni" })).toEqual(["capsuni-in-ciocolata"]);
    expect(run({ q: "КЛУБНИКА" })).toEqual(["capsuni-in-ciocolata"]);
    expect(run({ q: "torturi la comanda" })).toEqual(["tort-fistic"]);
  });

  it("filters by category", () => {
    expect(run({ category: "macarons" })).toEqual(["macarons"]);
  });

  it("never treats unverified allergens as free-from", () => {
    expect(run({ freeFrom: ["gluten"] })).toEqual(["capsuni-in-ciocolata"]);
    expect(run({ freeFrom: ["milk"] })).toEqual([]);
  });

  it("filters by price", () => {
    expect(run({ withPrice: true })).toEqual([
      "capsuni-in-ciocolata",
      "tort-fistic",
    ]);
    expect(run({ maxPrice: 300 })).toEqual(["capsuni-in-ciocolata"]);
  });
});

describe("query string", () => {
  it("round-trips and ignores unknown values", () => {
    const f = {
      ...emptyFilters,
      q: "tort",
      category: "torturi",
      freeFrom: ["nuts" as const],
      maxPrice: 500,
    };
    const qs = filtersToQuery(f);
    expect(
      filtersFromQuery(
        qs,
        categories.map((c) => c.slug),
      ),
    ).toEqual(f);
    expect(
      filtersFromQuery(
        "?cat=nope&fara=gluten,arsenic&max=-3",
        categories.map((c) => c.slug),
      ),
    ).toEqual({ ...emptyFilters, freeFrom: ["gluten"] });
  });
});
