import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BrandIcon } from "@/components/brand/icons";
import { PageHeader } from "@/components/layout/page-header";
import {
  categories,
  getProducts,
  getProductsByCategory,
} from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { pluralize } from "@/lib/format";
import { pageAlternates } from "@/lib/metadata";
import { CatalogSearch } from "./catalog-search";

export function catalogMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale).catalog;
  return {
    title: t.title,
    description: t.metaDescription,
    alternates: pageAlternates(locale, "catalog"),
  };
}

export function CatalogPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.catalog;

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        crumbsLabel={t.breadcrumb}
        crumbs={[
          { label: "Chira Sweets", href: href(locale, "home") },
          { label: t.title },
        ]}
      />
      <CatalogSearch
        products={getProducts()}
        categories={categories}
        locale={locale}
        dict={dict}
      >
        <section className="fluted py-12 sm:py-16">
          <ul className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {categories.map((c) => {
              const count = getProductsByCategory(c.slug).length;
              return (
                <li key={c.slug}>
                  <Link
                    href={href(locale, "catalog", c.slug)}
                    className="group flex h-full items-center gap-4 rounded-2xl border border-oak/30 bg-white/85 p-5 transition hover:border-oak hover:shadow-lg hover:shadow-wine/5 sm:flex-col sm:items-start sm:p-7"
                  >
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-wine text-gold-bright ring-1 ring-gold/40 ring-offset-4 ring-offset-white">
                      <BrandIcon name={c.icon} className="size-6" />
                    </span>
                    <span className="flex flex-1 flex-col gap-1">
                      <span className="text-sm font-medium tracking-[0.14em] text-wine uppercase">
                        {c.name[locale]}
                      </span>
                      {count > 0 && (
                        <span className="text-xs text-brown">
                          {pluralize(count, locale, t.products)}
                        </span>
                      )}
                    </span>
                    <ArrowRight
                      className="size-4 text-gold-ink transition group-hover:translate-x-1 sm:self-end"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </CatalogSearch>
    </>
  );
}
