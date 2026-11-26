import { describe, expect, it } from "vitest";
import { parseProducts } from "@/content/catalog";
import { getDictionary } from "@/i18n/dictionaries";
import {
  buildOrderMessage,
  MAX_QTY,
  resolveItems,
  sanitizeStored,
  updateList,
  type ListItem,
} from "./message";

const products = parseProducts([
  {
    slug: "macarons-asortate",
    category: "macarons",
    name: { ro: "Macarons asortate", ru: "Ассорти макаронс" },
    size: { ro: "12 buc", ru: "12 шт" },
    price: { kind: "fixed", amount: 180, unit: "box" },
    allergens: { status: "unverified" },
  },
  {
    slug: "tort-fistic",
    category: "torturi",
    name: { ro: "Tort cu fistic", ru: "Фисташковый торт" },
    price: { kind: "from", amount: 450, unit: "kg" },
    allergens: { status: "unverified" },
  },
]);

const a = { category: "macarons", slug: "macarons-asortate" };
const b = { category: "torturi", slug: "tort-fistic" };

describe("updateList", () => {
  it("adds, increments, sets and removes", () => {
    let list: ListItem[] = [];
    list = updateList(list, { type: "add", ...a });
    list = updateList(list, { type: "add", ...a });
    list = updateList(list, { type: "add", ...b });
    expect(list).toEqual([
      { ...a, qty: 2 },
      { ...b, qty: 1 },
    ]);
    list = updateList(list, { type: "set", ...b, qty: 500 });
    expect(list[1]?.qty).toBe(MAX_QTY);
    list = updateList(list, { type: "set", ...a, qty: 0 });
    expect(list).toEqual([{ ...b, qty: MAX_QTY }]);
    expect(updateList(list, { type: "clear" })).toEqual([]);
  });
});

describe("buildOrderMessage", () => {
  it("lists products with size, quantity and price", () => {
    const lines = resolveItems(
      [
        { ...a, qty: 2 },
        { ...b, qty: 1 },
        { category: "x", slug: "gone", qty: 1 },
      ],
      products,
    );
    expect(lines).toHaveLength(2);
    expect(buildOrderMessage(lines, "ro", getDictionary("ro"))).toBe(
      [
        "Bună! Aș dori să comand:",
        "• Macarons asortate (12 buc) × 2 — 180 lei / cutie",
        "• Tort cu fistic × 1 — de la 450 lei / kg",
        "",
        "Mulțumesc!",
      ].join("\n"),
    );
    expect(buildOrderMessage(lines, "ru", getDictionary("ru"))).toContain(
      "• Фисташковый торт × 1 — от 450 лей / кг",
    );
  });
});

describe("sanitizeStored", () => {
  it("drops malformed entries", () => {
    expect(
      sanitizeStored([
        { ...a, qty: 3 },
        { ...b, qty: -1 },
        { category: 1, slug: "x", qty: 1 },
        "junk",
      ]),
    ).toEqual([{ ...a, qty: 3 }]);
    expect(sanitizeStored({})).toEqual([]);
  });
});
