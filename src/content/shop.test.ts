import { describe, expect, it } from "vitest";
import { bakeryJsonLd } from "@/lib/seo";
import { shop } from "./shop";

describe("public e-mail (#9)", () => {
  it("stays unset until Email Routing works", () => {
    // When Email Routing delivers a test message, set the address in shop.ts
    // and update this test.
    expect(shop.email).toBeNull();
  });

  it("is left out of the Bakery JSON-LD while unset", () => {
    expect(bakeryJsonLd("ro")).not.toHaveProperty("email");
  });
});
