/* eslint-disable @next/next/no-img-element -- static export: images are pre-optimised at build time */
import { BrandIcon } from "@/components/brand/icons";
import { getCategory } from "@/content/catalog";
import type { Product } from "@/content/schema";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Product photo, or a branded placeholder until the owner's photos arrive (C-04). */
export function ProductVisual({
  product,
  locale,
  noPhotoLabel,
  priority,
  className,
}: {
  product: Product;
  locale: Locale;
  noPhotoLabel: string;
  priority?: boolean;
  className?: string;
}) {
  const image = product.images[0];

  if (image) {
    return (
      <img
        src={image.src}
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
      <div
        aria-hidden
        className="absolute inset-x-[18%] bottom-[16%] h-[14%] rounded-[50%] bg-[#a8454d]"
      />
      <BrandIcon name={icon} className="relative size-1/3" />
      <span className="eyebrow relative text-[0.65rem] text-cream/70">
        {noPhotoLabel}
      </span>
    </div>
  );
}
