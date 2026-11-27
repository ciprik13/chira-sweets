import {
  Cake,
  CakeSlice,
  Candy,
  Cherry,
  Coffee,
  Cookie,
  Croissant,
  Gift,
  Wheat,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { CategoryIcon } from "@/content/categories";

const iconMap: Record<CategoryIcon | "wheat", LucideIcon> = {
  macaron: Cookie,
  cake: Cake,
  cheesecake: CakeSlice,
  croissant: Croissant,
  dessert: Candy,
  strawberry: Cherry,
  gift: Gift,
  coffee: Coffee,
  wheat: Wheat,
};

export function BrandIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = iconMap[name as keyof typeof iconMap] ?? Cake;
  return <Icon strokeWidth={1.25} aria-hidden {...props} />;
}

/** Instagram glyph (lucide v1 no longer ships brand icons). */
export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
