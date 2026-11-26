import { describe, expect, it } from "vitest";
import { locales } from "./config";
import { href, pageSlugs, switchLocalePath, type PageKey } from "./routes";

describe("href", () => {
  it("builds the home page with a trailing slash", () => {
    expect(href("ro", "home")).toBe("/ro/");
    expect(href("ru", "home")).toBe("/ru/");
  });

  it("uses translated slugs", () => {
    expect(href("ro", "events")).toBe("/ro/evenimente/");
    expect(href("ru", "events")).toBe("/ru/meropriyatiya/");
  });

  it("appends nested segments", () => {
    expect(href("ru", "catalog", "macarons")).toBe("/ru/katalog/macarons/");
  });
});

describe("pageSlugs", () => {
  it("has unique slugs per language", () => {
    for (const locale of locales) {
      const slugs = Object.values(pageSlugs).map((s) => s[locale]);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});

describe("switchLocalePath", () => {
  it("keeps the current page", () => {
    for (const key of Object.keys(pageSlugs) as PageKey[]) {
      expect(switchLocalePath(href("ro", key), "ru")).toBe(href("ru", key));
      expect(switchLocalePath(href("ru", key), "ro")).toBe(href("ro", key));
    }
  });

  it("keeps category and product segments", () => {
    expect(switchLocalePath("/ro/catalog/torturi/tort-fistic/", "ru")).toBe(
      "/ru/katalog/torturi/tort-fistic/",
    );
  });

  it("falls back to home for unknown paths", () => {
    expect(switchLocalePath("/ro/nu-exista/", "ru")).toBe("/ru/");
    expect(switchLocalePath("/", "ru")).toBe("/ru/");
  });
});
