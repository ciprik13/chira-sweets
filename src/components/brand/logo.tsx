import { cn } from "@/lib/utils";

/**
 * Approved logo files (D-001), served from /public/brand.
 * Plain <img>: the SVGs are large single paths, so caching them as files beats inlining.
 */
const files = {
  "horizontal-goldfoil": {
    src: "/brand/logo-horizontal-goldfoil.svg",
    w: 8494,
    h: 2854,
  },
  "horizontal-cream": {
    src: "/brand/logo-horizontal-cream.svg",
    w: 8494,
    h: 2854,
  },
  "round-goldfoil": { src: "/brand/logo-round-goldfoil.svg", w: 4386, h: 4453 },
  "round-wine": { src: "/brand/logo-round-wine.svg", w: 4386, h: 4453 },
} as const;

type LogoProps = {
  variant: keyof typeof files;
  className?: string;
  /** Empty when the logo sits next to visible text that already names the shop. */
  alt?: string;
  priority?: boolean;
};

export function Logo({
  variant,
  className,
  alt = "Chira Sweets",
  priority,
}: LogoProps) {
  const file = files[variant];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, SVG needs no optimisation
    <img
      src={file.src}
      width={file.w}
      height={file.h}
      alt={alt}
      className={cn("h-auto", className)}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
