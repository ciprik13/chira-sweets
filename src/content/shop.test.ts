import { describe, expect, it } from "vitest";
import raw from "../../content/settings/shop.json";
import { bakeryJsonLd } from "@/lib/seo";
import { shop, shopSchema, toShop } from "./shop";

describe("shop settings", () => {
  it("parses the CMS file", () => {
    expect(() => shopSchema.parse(raw)).not.toThrow();
  });

  it("hides an empty e-mail and accepts a real one", () => {
    const base = shopSchema.parse(raw);
    expect(toShop({ ...base, email: "" }).email).toBeNull();
    expect(toShop({ ...base, email: "contact@chirasweets.md" }).email).toBe(
      "contact@chirasweets.md",
    );
    expect(() => shopSchema.parse({ ...raw, email: "not-an-email" })).toThrow();
  });
});

describe("public e-mail (#9)", () => {
  it("stays unset until Email Routing works", () => {
    // When Email Routing delivers a test message, fill in "E-mail public" in
    // the CMS (content/settings/shop.json) and update this test.
    expect(shop.email).toBeNull();
  });

  it("is left out of the Bakery JSON-LD while unset", () => {
    expect(bakeryJsonLd("ro")).not.toHaveProperty("email");
  });
});
