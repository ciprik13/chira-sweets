import { shop } from "@/content/shop";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/routes";
import { instagramHref } from "./contact";
import { absoluteUrl } from "./site";

/** schema.org Bakery (US-10). Address/hours are added once the owner confirms them. */
export function bakeryJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: shop.name,
    url: absoluteUrl(href(locale, "home")),
    logo: absoluteUrl("/brand/logo-round-wine.svg"),
    image: absoluteUrl("/og-default.png"),
    telephone: shop.phone.e164,
    email: shop.email,
    sameAs: [instagramHref()],
    areaServed: { "@type": "City", name: "Chișinău" },
    ...(shop.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: shop.address[locale],
        addressLocality: "Chișinău",
        addressCountry: "MD",
      },
    }),
  };
}

export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

/** Serialises JSON-LD safely for an inline <script> ("<" escaped). */
export function jsonLdHtml(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
