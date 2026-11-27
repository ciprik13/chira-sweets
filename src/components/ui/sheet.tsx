"use client";

import { X } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "right" | "bottom";
  closeLabel: string;
};

export function SheetContent({
  side = "right",
  className,
  children,
  closeLabel,
  ...props
}: SheetContentProps) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-wine-deep/60 backdrop-blur-[2px] data-[state=open]:animate-in" />
      <SheetPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-ivory text-ink shadow-2xl outline-none",
          side === "right" && "inset-y-0 right-0 w-[min(88vw,380px)]",
          side === "bottom" && "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-3xl",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full text-current opacity-80 hover:opacity-100"
          aria-label={closeLabel}
        >
          <X className="size-5" aria-hidden />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export const SheetTitle = SheetPrimitive.Title;
export const SheetDescription = SheetPrimitive.Description;
