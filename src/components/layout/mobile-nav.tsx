"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  items: { href: string; label: string }[];
  labels: { menu: string; close: string };
};

export function MobileNav({ items, labels }: Props) {
  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex size-11 items-center justify-center rounded-full text-cream xl:hidden"
        aria-label={labels.menu}
      >
        <Menu className="size-6" aria-hidden />
      </SheetTrigger>
      <SheetContent closeLabel={labels.close} className="bg-wine text-cream">
        <SheetTitle className="sr-only">{labels.menu}</SheetTitle>
        <div className="px-6 pt-6">
          <Logo variant="round-goldfoil" className="w-16" alt="" />
        </div>
        <nav className="mt-8 px-6">
          <ul className="grid">
            {items.map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className="block border-b border-gold/20 py-4 text-sm tracking-[0.22em] uppercase hover:text-gold-bright"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
