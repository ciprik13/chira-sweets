import Link from "next/link";
import type { Product } from "@/content/schema";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { AddToListButton } from "@/features/order-list/add-to-list";
import { formatPrice } from "@/lib/format";
import { ProductVisual } from "./product-visual";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.catalog;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-oak/30 bg-white transition hover:-translate-y-0.5 hover:border-oak hover:shadow-lg hover:shadow-wine/5">
      <ProductVisual
        product={product}
        locale={locale}
        noPhotoLabel={t.noPhoto}
        className="transition duration-500 group-hover:scale-[1.02]"
      />
      {product.draft && (
        <span className="absolute top-3 left-3 rounded-full bg-ivory/95 px-3 py-1 text-[0.65rem] font-medium tracking-wider text-wine uppercase">
          {t.draftBadge}
        </span>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="text-sm leading-snug font-medium tracking-[0.04em] break-words text-wine uppercase sm:tracking-[0.08em]">
          <Link
            href={href(locale, "catalog", product.category, product.slug)}
            className="after:absolute after:inset-0"
          >
            {product.name[locale]}
          </Link>
        </h3>
        {product.size && (
          <p className="text-xs text-brown">{product.size[locale]}</p>
        )}
        <p className="mt-auto pt-2 font-serif text-lg text-gold-ink">
          {formatPrice(product.price, locale, t)}
        </p>
        <AddToListButton
          category={product.category}
          slug={product.slug}
          labels={dict.orderList}
          className="mt-2 h-auto min-h-10 w-full px-2 py-2 text-[0.65rem] leading-tight tracking-[0.06em] whitespace-normal sm:text-[0.7rem] sm:tracking-[0.1em]"
        />
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  locale,
  dict,
}: {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <li key={`${p.category}/${p.slug}`}>
          <ProductCard product={p} locale={locale} dict={dict} />
        </li>
      ))}
    </ul>
  );
}
