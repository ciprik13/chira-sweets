/* eslint-disable @next/next/no-img-element -- static export: images are pre-optimised at build time */
import { BrandIcon } from "@/components/brand/icons";
import { getCategory } from "@/content/catalog";
import type { Product } from "@/content/schema";
import type { Locale } from "@/i18n/config";
import { responsiveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Product photo, or a branded placeholder until the owner's photos arrive (C-04). */
export function ProductVisual({
  product,
  locale,
  noPhotoLabel,
  priority,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw",
}: {
  product: Product;
  locale: Locale;
  noPhotoLabel: string;
  priority?: boolean;
  className?: string;
  /** Rendered width hint for the browser's srcset choice. */
  sizes?: string;
}) {
  const image = product.images[0];

  if (image) {
    const { src, srcSet } = responsiveImage(image.src);
    return (
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={image.alt[locale]}
        className={cn("aspect-square w-full object-cover", className)}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    );
  }

  const icon = getCategory(product.category)?.icon ?? "cake";
  return (
    <div
      className={cn(
        "relative flex aspect-square w-full flex-col items-center justify-center gap-3 overflow-hidden bg-wine text-gold-bright",
        className,
      )}
    >
      <div aria-hidden className="glow absolute inset-0" />
      <BrandIcon name={icon} className="relative size-1/3" />
      <span className="eyebrow relative px-3 text-center text-[0.6rem] tracking-[0.14em] text-cream/70 sm:text-[0.65rem] sm:tracking-[0.28em]">
        {noPhotoLabel}
      </span>
    </div>
  );
}
