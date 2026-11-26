"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import type { Category } from "@/content/categories";
import type { Product } from "@/content/schema";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  emptyFilters,
  filterProducts,
  filtersFromQuery,
  filtersToQuery,
  freeFromOptions,
  isActive,
  type CatalogFilters,
} from "./filter";
import { ProductGrid } from "./product-card";

/** Client-side search over the build-time catalog; state mirrored in the URL. */
export function CatalogSearch({
  products,
  categories,
  locale,
  dict,
  children,
}: {
  products: Product[];
  categories: readonly Category[];
  locale: Locale;
  dict: Dictionary;
  /** Shown when no search or filter is active (the category grid). */
  children: ReactNode;
}) {
  const t = dict.search;
  const id = useId();
  const [filters, setFilters] = useState<CatalogFilters>(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const slugs = useMemo(() => categories.map((c) => c.slug), [categories]);

  // Read the URL once on mount (static export: no server-side search params).
  useEffect(() => {
    const initial = filtersFromQuery(window.location.search, slugs);
    if (isActive(initial)) {
      // One-time sync from the URL after hydration; the static HTML has no query.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters(initial);
      if (
        initial.freeFrom.length ||
        initial.withPrice ||
        initial.maxPrice !== null
      )
        setShowFilters(true);
    }
  }, [slugs]);

  useEffect(() => {
    const url = `${window.location.pathname}${filtersToQuery(filters)}`;
    window.history.replaceState(window.history.state, "", url);
  }, [filters]);

  const active = isActive(filters);
  const results = useMemo(
    () => (active ? filterProducts(products, categories, filters) : []),
    [active, products, categories, filters],
  );
  const update = (patch: Partial<CatalogFilters>) =>
    setFilters((f) => ({ ...f, ...patch }));

  return (
    <>
      <div className="border-b border-oak/40 bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6">
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2"
          >
            <label htmlFor={`${id}-q`} className="sr-only">
              {t.label}
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-brown"
                aria-hidden
              />
              <input
                id={`${id}-q`}
                type="search"
                value={filters.q}
                onChange={(e) => update({ q: e.target.value.slice(0, 100) })}
                placeholder={t.placeholder}
                autoComplete="off"
                className="h-12 w-full rounded-full border border-wine/20 bg-white pr-4 pl-11 text-ink placeholder:text-brown/60 focus-visible:border-wine"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              aria-controls={`${id}-filters`}
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-full border px-4 text-sm text-wine",
                showFilters
                  ? "border-wine bg-wine/5"
                  : "border-wine/20 bg-white",
              )}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              <span className="hidden sm:inline">{t.filters}</span>
            </button>
          </form>

          <div
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
            role="group"
            aria-label={dict.catalog.title}
          >
            <Chip
              pressed={!filters.category}
              onClick={() => update({ category: null })}
            >
              {t.allCategories}
            </Chip>
            {categories.map((c) => (
              <Chip
                key={c.slug}
                pressed={filters.category === c.slug}
                onClick={() =>
                  update({
                    category: filters.category === c.slug ? null : c.slug,
                  })
                }
              >
                {c.name[locale]}
              </Chip>
            ))}
          </div>

          {showFilters && (
            <div
              id={`${id}-filters`}
              className="grid gap-5 rounded-2xl border border-oak/40 bg-white p-5 sm:grid-cols-[2fr_1fr]"
            >
              <fieldset>
                <legend className="text-sm font-medium text-ink">
                  {t.freeFrom}
                </legend>
                <p className="mt-1 text-xs text-brown">{t.freeFromHint}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {freeFromOptions.map((a) => {
                    const checked = filters.freeFrom.includes(a);
                    return (
                      <label
                        key={a}
                        className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-wine/20 px-4 text-sm has-[:checked]:border-wine has-[:checked]:bg-wine/5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-bright"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            update({
                              freeFrom: checked
                                ? filters.freeFrom.filter((x) => x !== a)
                                : [...filters.freeFrom, a],
                            })
                          }
                          className="accent-[#6b151e]"
                        />
                        {dict.allergenNames[a]}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div className="grid content-start gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.withPrice}
                    onChange={(e) => update({ withPrice: e.target.checked })}
                    className="accent-[#6b151e]"
                  />
                  {t.withPrice}
                </label>
                <label className="grid gap-1 text-sm">
                  <span>{t.maxPrice} (lei)</span>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={filters.maxPrice ?? ""}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      update({ maxPrice: e.target.value && v > 0 ? v : null });
                    }}
                    className="h-11 rounded-xl border border-wine/20 bg-ivory px-3"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {active ? (
        <section
          className="fluted py-10 sm:py-14"
          aria-labelledby={`${id}-results`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2
                id={`${id}-results`}
                className="text-sm tracking-[0.14em] text-wine uppercase"
                aria-live="polite"
              >
                {t.results}:{" "}
                {pluralize(results.length, locale, dict.catalog.products)}
              </h2>
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="inline-flex items-center gap-1 text-sm text-wine underline-offset-4 hover:underline"
              >
                <X className="size-4" aria-hidden /> {t.reset}
              </button>
            </div>
            {results.length ? (
              <ProductGrid products={results} locale={locale} dict={dict} />
            ) : (
              <p className="mx-auto max-w-xl rounded-2xl border border-oak/30 bg-white/85 p-8 text-center text-brown">
                {t.noResults}
              </p>
            )}
          </div>
        </section>
      ) : (
        children
      )}
    </>
  );
}

function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-10 shrink-0 rounded-full border px-4 text-xs tracking-[0.12em] whitespace-nowrap uppercase transition-colors",
        pressed
          ? "border-wine bg-wine text-cream"
          : "border-wine/20 bg-white text-wine hover:border-wine/50",
      )}
    >
      {children}
    </button>
  );
}
