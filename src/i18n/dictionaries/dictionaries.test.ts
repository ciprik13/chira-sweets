import { describe, expect, it } from "vitest";
import { ro } from "./ro";
import { ru } from "./ru";

/** Paths of every leaf ("home.hero.line1", "pages.faq.items[]q", …). */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return value.length ? shape(value[0], `${path}[]`) : [`${path}[]`];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      shape(v, path ? `${path}.${k}` : k),
    );
  }
  return [path];
}

function emptyLeaves(value: unknown, path = ""): string[] {
  if (Array.isArray(value))
    return value.flatMap((v, i) => emptyLeaves(v, `${path}[${i}]`));
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) =>
      emptyLeaves(v, path ? `${path}.${k}` : k),
    );
  return typeof value === "string" && !value.trim() ? [path] : [];
}

describe("site copy (content/copy)", () => {
  it("RO and RU have exactly the same fields", () => {
    expect(shape(ru).sort()).toEqual(shape(ro).sort());
  });

  it("has no empty text in either language", () => {
    expect(emptyLeaves(ro)).toEqual([]);
    expect(emptyLeaves(ru)).toEqual([]);
  });

  it("keeps list lengths equal (FAQ, steps, features…)", () => {
    const lengths = (v: unknown, p = ""): string[] =>
      Array.isArray(v)
        ? [`${p}:${v.length}`, ...v.flatMap((x, i) => lengths(x, `${p}[${i}]`))]
        : v && typeof v === "object"
          ? Object.entries(v).flatMap(([k, x]) =>
              lengths(x, p ? `${p}.${k}` : k),
            )
          : [];
    expect(lengths(ru)).toEqual(lengths(ro));
  });
});
