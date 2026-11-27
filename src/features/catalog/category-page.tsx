import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderSheet } from "@/components/contact/order-sheet";
import { PageHeader } from "@/components/layout/page-header";
import {
  categories,
  getCategory,
  getProductsByCategory,
} from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { pluralize } from "@/lib/format";
import { CakeForm } from "@/features/forms/cake-form";
import { ProductGrid } from "./product-card";

/** Category that hosts the custom-cake request form. */
export const CAKE_CATEGORY = "torturi";

export type CategoryParams = { category: string };

export function categoryStaticParams(): CategoryParams[] {
  return categories.map((c) => ({ category: c.slug }));
}

export function categoryMetadata(locale: Locale, slug: string): Metadata {
  const category = getCategory(slug);
  if (!category) return {};
  const dict = getDictionary(locale);
  const other: Locale = locale === "ro" ? "ru" : "ro";
  return {
    title: category.name[locale],
    description: `${category.name[locale]} — Chira Sweets, ${dict.home.hero.eyebrow}.`,
    alternates: {
      canonical: href(locale, "catalog", slug),
      languages: {
        [locale === "ro" ? "ro-MD" : "ru-MD"]: href(locale, "catalog", slug),
        [other === "ro" ? "ro-MD" : "ru-MD"]: href(other, "catalog", slug),
        "x-default": href("ro", "catalog", slug),
      },
    },
  };
}

export function CategoryPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const category = getCategory(slug);
  if (!category) notFound();

  const dict = getDictionary(locale);
  const t = dict.catalog;
  const products = getProductsByCategory(slug);

  return (
    <>
      <PageHeader
        eyebrow={
          products.length
            ? pluralize(products.length, locale, t.products)
            : t.eyebrow
        }
        title={category.name[locale]}
        crumbsLabel={t.breadcrumb}
        crumbs={[
          { label: "Chira Sweets", href: href(locale, "home") },
          { label: t.title, href: href(locale, "catalog") },
          { label: category.name[locale] },
        ]}
      />
      <section className="fluted py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {products.length > 0 ? (
            <ProductGrid products={products} locale={locale} dict={dict} />
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-oak/30 bg-white/85 p-8 text-center">
              <p className="leading-relaxed text-brown">{t.emptyCategory}</p>
              <OrderSheet dict={dict} variant="wine" className="mt-6" />
            </div>
          )}
        </div>
      </section>
      {slug === CAKE_CATEGORY && (
        <section
          id="cake-request"
          className="scroll-mt-24 bg-ivory py-14 sm:py-20"
          aria-labelledby="cake-request-title"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <p className="eyebrow text-gold-ink">
              {dict.pages.cakeForm.eyebrow}
            </p>
            <h2
              id="cake-request-title"
              className="mt-3 text-2xl tracking-[0.1em] text-wine uppercase sm:text-3xl"
            >
              {dict.pages.cakeForm.title}
            </h2>
            <p className="mt-3 mb-8 text-brown">{dict.pages.cakeForm.lead}</p>
            <CakeForm
              locale={locale}
              dict={{
                pages: {
                  cakeForm: dict.pages.cakeForm,
                  form: dict.pages.form,
                },
              }}
              privacyHref={href(locale, "privacy")}
            />
          </div>
        </section>
      )}
    </>
  );
}
