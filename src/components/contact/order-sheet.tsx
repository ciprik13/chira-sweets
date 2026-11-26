"use client";

import { MessageCircle, MessagesSquare, Phone, Send } from "lucide-react";
import type { ReactNode } from "react";
import { InstagramIcon } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { shop } from "@/content/shop";
import type { Dictionary } from "@/i18n/dictionaries";
import { channelHref, type Channel } from "@/lib/contact";

type Props = {
  dict: Pick<Dictionary, "order" | "nav">;
  /** Pre-filled message (WhatsApp only), e.g. the product name. */
  message?: string;
  variant?: "gold" | "wine";
  size?: "md" | "lg" | "sm";
  className?: string;
  children?: ReactNode;
};

const channels: { id: Channel; icon: ReactNode }[] = [
  { id: "phone", icon: <Phone aria-hidden /> },
  { id: "telegram", icon: <Send aria-hidden /> },
  { id: "viber", icon: <MessagesSquare aria-hidden /> },
  { id: "whatsapp", icon: <MessageCircle aria-hidden /> },
  { id: "instagram", icon: <InstagramIcon className="size-5" /> },
];

/** "Comandă acum": opens every contact channel in one sheet (US-04). */
export function OrderSheet({
  dict,
  message,
  variant = "gold",
  size = "lg",
  className,
  children,
}: Props) {
  const label = (id: Channel) =>
    id === "phone" ? dict.order.call : dict.order[id];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {children ?? dict.order.cta}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        closeLabel={dict.nav.close}
        className="mx-auto max-w-lg px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:bottom-6 sm:rounded-3xl"
      >
        <SheetTitle className="pr-10 font-sans text-lg font-medium tracking-[0.12em] text-wine uppercase">
          {dict.order.title}
        </SheetTitle>
        <SheetDescription className="mt-2 text-sm text-brown">
          {dict.order.description}
        </SheetDescription>
        <div className="foil-rule my-6" />
        <ul className="grid gap-3">
          {channels.map(({ id, icon }) => (
            <li key={id}>
              <a
                href={channelHref(id, message)}
                target={id === "phone" ? undefined : "_blank"}
                rel={id === "phone" ? undefined : "noopener noreferrer"}
                className="flex min-h-12 items-center gap-4 rounded-2xl border border-wine/15 bg-white px-4 py-3 text-ink transition-colors hover:border-wine/40 [&_svg]:size-5 [&_svg]:text-wine"
              >
                {icon}
                <span className="font-medium">{label(id)}</span>
                {id === "phone" && (
                  <span className="ml-auto text-sm text-brown">
                    {shop.phone.display}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
