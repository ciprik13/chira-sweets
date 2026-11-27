import type { TinaField } from "tinacms";

/**
 * Builds the TinaCMS fields for the site copy (content/copy/*.json) from the
 * Romanian file itself, so every text on the site is editable without
 * hand-maintaining hundreds of field definitions. New keys added in code
 * show up in the CMS automatically.
 */

/** Romanian labels for the top-level sections; deeper keys are humanised. */
const sectionLabels: Record<string, string> = {
  meta: "SEO (titlu și descriere Google)",
  skipToContent: "Link „Sari la conținut” (accesibilitate)",
  nav: "Meniu",
  order: "Butoane de comandă",
  actionBar: "Bara de contact (mobil)",
  home: "Pagina principală",
  catalog: "Catalog",
  allergenNames: "Denumiri alergeni",
  orderList: "Lista mea",
  search: "Căutare în catalog",
  footer: "Subsol",
  pages: "Pagini",
};

export function humanize(key: string): string {
  const words = key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function firstText(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) {
      const t = firstText(v);
      if (t) return t;
    }
  }
  return undefined;
}

export function fieldsFromSample(
  sample: Record<string, unknown>,
  depth = 0,
): TinaField[] {
  return Object.entries(sample).map(([name, value]): TinaField => {
    const label = (depth === 0 && sectionLabels[name]) || humanize(name);

    if (typeof value === "string") {
      return {
        type: "string",
        name,
        label,
        required: true,
        ...(value.length > 70 ? { ui: { component: "textarea" } } : {}),
      };
    }

    if (Array.isArray(value)) {
      const first = value[0];
      if (typeof first === "string" || first === undefined) {
        return { type: "string", name, label, list: true };
      }
      return {
        type: "object",
        name,
        label,
        list: true,
        fields: fieldsFromSample(first as Record<string, unknown>, depth + 1),
        ui: {
          itemProps: (item: Record<string, unknown>) => ({
            label: firstText(item)?.slice(0, 60) ?? label,
          }),
        },
      };
    }

    return {
      type: "object",
      name,
      label,
      fields: fieldsFromSample(value as Record<string, unknown>, depth + 1),
    };
  });
}
