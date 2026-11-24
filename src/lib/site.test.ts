import { describe, expect, it } from "vitest";
import { absoluteUrl } from "./site";

describe("absoluteUrl", () => {
  it("joins a path that starts with a slash", () => {
    expect(absoluteUrl("/ro/catalog/")).toBe(
      "https://chirasweets.md/ro/catalog/",
    );
  });

  it("adds the missing leading slash", () => {
    expect(absoluteUrl("ro")).toBe("https://chirasweets.md/ro");
  });
});
