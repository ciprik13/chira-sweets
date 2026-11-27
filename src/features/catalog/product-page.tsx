import { Info } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderSheet } from "@/components/contact/order-sheet";
import { PageHeader } from "@/components/layout/page-header";
import {
  categories,
  getCategory,
  getProduct,
  getProducts,
  getProductsByCategory,
} from "@/content/catalog";
import type { Product } from "@/content/schema";
import { localeTags, locales, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { fill, formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";
import { ProductGrid } from "./product-card";
import { ProductVisual } from "./product-visual";

export type ProductParams = { category: string; product: string };

/**
 * `output: "export"` refuses an empty list. Until the owner's products are in
 * (drafts are hidden in production), one unreachable placeholder path is
 * generated; it renders the 404 page. "_empty" can never be a real slug
 * (slugs are kebab-case, see content/schema.ts).
 */
export const EMPTY_PRODUCT_SLUG = "_empty";

export function productStaticParams(): ProductParams[] {
  const params = getProducts().map((p) => ({
    category: p.category,
    product: p.slug,
  }));
  if (params.length > 0) return params;
  const first = getCategory("macarons") ?? categories[0];
  return first ? [{ category: first.slug, product: EMPTY_PRODUCT_SLUG }] : [];
}

export function productMetadata(
  locale: Locale,
  params: ProductParams,
): Metadata {
  const product = getProduct(params.category, params.product);
  if (!product) return {};
  const path = (l: Locale) =>
    href(l, "catalog", product.category, product.slug);
  return {
    title: product.name[locale],
    description: product.description?.[locale] ?? product.name[locale],
    alternates: {
      canonical: path(locale),
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeTags[l], path(l)])),
        "x-default": path("ro"),
      },
    },
    // Draft samples are never indexed, even on a preview deployment.
    robots: product.draft ? { index: false, follow: false } : undefined,
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0].src }] }
      : undefined,
  };
}

export function ProductPage({
  locale,
  params,
}: {
  locale: Locale;
  params: ProductParams;
}) {
  const product = getProduct(params.category, params.product);
  const category = getCategory(params.category);
  if (!product || !category) notFound();

  const dict = getDictionary(locale);
  const t = dict.catalog;
  const name = product.name[locale];
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <PageHeader
        title={name}
        crumbsLabel={t.breadcrumb}
        crumbs={[
          { label: t.title, href: href(locale, "catalog") },
          {
            label: category.name[locale],
            href: href(locale, "catalog", category.slug),
          },
          { label: name },
        ]}
      />

      <section className="bg-ivory py-10 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-10 lg:gap-14">
          <div className="relative self-start overflow-hidden rounded-3xl border border-oak/30">
            <ProductVisual
              product={product}
              locale={locale}
              noPhotoLabel={t.noPhoto}
              priority
              className="aspect-[4/3] sm:aspect-square"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            {product.draft && (
              <span className="absolute top-4 left-4 rounded-full bg-ivory/95 px-3 py-1 text-xs font-medium tracking-wider text-wine uppercase">
                {t.draftBadge}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-7">
            <dl className="grid gap-6">
              <div>
                <dt className="eyebrow text-gold-ink">{t.price}</dt>
                <dd className="mt-2 font-serif text-3xl text-wine">
                  {formatPrice(product.price, locale, t)}
                </dd>
              </div>
              {product.size && (
                <div>
                  <dt className="eyebrow text-gold-ink">{t.size}</dt>
                  <dd className="mt-2 text-ink">{product.size[locale]}</dd>
                </div>
              )}
              {product.description && (
                <div>
                  <dt className="eyebrow text-gold-ink">{t.description}</dt>
                  <dd className="mt-2 leading-relaxed text-brown">
                    {product.description[locale]}
                  </dd>
                </div>
              )}
            </dl>

            <AllergenBlock product={product} dict={dict} />

            <div className="foil-rule" />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <OrderSheet
                dict={dict}
                variant="wine"
                message={fill(t.orderMessage, { name })}
                className="w-full sm:w-auto"
              >
                {t.orderThis}
              </OrderSheet>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="fluted py-12 sm:py-16" aria-labelledby="related">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2
              id="related"
              className="mb-8 text-2xl tracking-[0.1em] text-wine uppercase"
            >
              {t.related}
            </h2>
            <ProductGrid products={related} locale={locale} dict={dict} />
          </div>
        </section>
      )}

      {!product.draft && <ProductJsonLd product={product} locale={locale} />}
    </>
  );
}

/** US-03: allergens only from owner-verified data; otherwise "ask us". */
function AllergenBlock({
  product,
  dict,
}: {
  product: Product;
  dict: Dictionary;
}) {
  const t = dict.catalog;
  const a = product.allergens;
  return (
    <div className="rounded-2xl border border-oak/40 bg-white p-5">
      <h2 className="eyebrow text-gold-ink">{t.allergens}</h2>
      {a.status === "unverified" ? (
        <p className="mt-3 flex gap-3 text-sm leading-relaxed text-brown">
          <Info className="mt-0.5 size-4 shrink-0 text-wine" aria-hidden />
          {t.allergensUnverified}
        </p>
      ) : a.contains.length === 0 ? (
        <p className="mt-3 text-sm text-brown">{t.allergensNone}</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {a.contains.map((key) => (
            <li
              key={key}
              className="rounded-full border border-wine/25 px-3 py-1 text-xs font-medium text-wine"
            >
              {dict.allergenNames[key]}
            </li>
          ))}
        </ul>
      )}
      {a.status === "verified" && (
        <p className="mt-3 text-xs text-brown/80">{t.allergensNote}</p>
      )}
    </div>
  );
}

/** schema.org Product (US-10). Offers only when a real price exists. */
function ProductJsonLd({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const url = absoluteUrl(
    href(locale, "catalog", product.category, product.slug),
  );
  const price = product.price.kind === "onRequest" ? undefined : product.price;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    description: product.description?.[locale],
    image: product.images.map((i) => absoluteUrl(i.src)),
    url,
    brand: { "@type": "Brand", name: "Chira Sweets" },
    ...(price && {
      offers: {
        "@type": price.kind === "from" ? "AggregateOffer" : "Offer",
        priceCurrency: "MDL",
        ...(price.kind === "from"
          ? { lowPrice: price.amount }
          : { price: price.amount }),
        availability: "https://schema.org/InStock",
        url,
      },
    }),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
