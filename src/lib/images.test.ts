import { describe, expect, it } from "vitest";
import { isOptimisable, responsiveImage, variantPath } from "./images";

describe("responsive images", () => {
  it("only handles uploaded photos", () => {
    expect(isOptimisable("/uploads/tort.JPG")).toBe(true);
    expect(isOptimisable("/uploads/logo.svg")).toBe(false);
    expect(isOptimisable("/brand/logo.png")).toBe(false);
  });

  it("builds variant paths", () => {
    expect(variantPath("/uploads/a/tort-fistic.jpeg", 480)).toBe(
      "/_img/480/uploads/a/tort-fistic.webp",
    );
  });

  it("uses variants in production and the original in development", () => {
    expect(responsiveImage("/uploads/tort.jpg", false)).toEqual({
      src: "/uploads/tort.jpg",
    });
    expect(responsiveImage("/uploads/tort.jpg", true)).toEqual({
      src: "/_img/960/uploads/tort.webp",
      srcSet:
        "/_img/480/uploads/tort.webp 480w, /_img/960/uploads/tort.webp 960w, /_img/1600/uploads/tort.webp 1600w",
    });
  });
});
