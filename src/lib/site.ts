export const SITE_NAME = "Chira Sweets";
export const SITE_URL = "https://chirasweets.md";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
