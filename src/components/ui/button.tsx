import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans text-sm font-medium uppercase tracking-[0.16em] transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Gold on wine — primary action on dark sections. */
        gold: "bg-gold-bright text-wine-deep hover:bg-[#e6bb6a]",
        /** Wine on light — primary action on cream sections. */
        wine: "bg-wine text-cream hover:bg-wine-soft",
        /** Outline on dark backgrounds. */
        outlineLight:
          "border border-gold/60 text-cream hover:border-gold-bright hover:bg-white/5",
        /** Outline on light backgrounds. */
        outlineDark:
          "border border-wine/30 text-wine hover:border-wine hover:bg-wine/5",
        link: "rounded-none px-0 text-wine underline-offset-8 hover:underline",
      },
      size: {
        md: "h-11 px-6",
        lg: "h-12 px-8",
        sm: "h-9 px-4 text-xs",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "wine", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
