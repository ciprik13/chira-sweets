export const locales = ["ro", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ro";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
  ro: "RO",
  ru: "RU",
};

/** BCP 47 tags for <html lang>, hreflang and Intl formatting. */
export const localeTags: Record<Locale, string> = {
  ro: "ro-MD",
  ru: "ru-MD",
};
