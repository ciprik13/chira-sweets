"use client";

import {
  ClipboardList,
  MessageCircle,
  MessagesSquare,
  Minus,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { InstagramIcon } from "@/components/brand/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Product } from "@/content/schema";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/i18n/routes";
import { channelHref, type Channel } from "@/lib/contact";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buildOrderMessage, itemKey, resolveItems } from "./message";
import { dispatch, useOrderList } from "./store";

type Props = {
  locale: Locale;
  dict: Dictionary;
  products: Product[];
};

const copyChannels: {
  id: Exclude<Channel, "phone" | "whatsapp">;
  icon: ReactNode;
}[] = [
  { id: "telegram", icon: <Send aria-hidden /> },
  { id: "viber", icon: <MessagesSquare aria-hidden /> },
  { id: "instagram", icon: <InstagramIcon className="size-4" /> },
];

/** "Lista mea": several products sent as one messenger message (no checkout, D-009). */
export function OrderListSheet({ locale, dict, products }: Props) {
  const t = dict.orderList;
  const list = useOrderList();
  const lines = resolveItems(list, products);
  const count = lines.reduce((n, l) => n + l.item.qty, 0);
  const message = buildOrderMessage(lines, locale, dict);
  const [notice, setNotice] = useState<"copied" | "failed" | null>(null);

  async function copyAndOpen(channel: Channel) {
    // Start the copy while this page still has focus, then open the chat
    // synchronously in the same click (popup blockers).
    const copy = navigator.clipboard?.writeText(message);
    window.open(channelHref(channel), "_blank", "noopener,noreferrer");
    try {
      if (!copy) throw new Error("no clipboard");
      await copy;
      setNotice("copied");
    } catch {
      setNotice("failed");
    }
  }

  return (
    <Sheet onOpenChange={() => setNotice(null)}>
      <SheetTrigger
        className="relative inline-flex size-10 items-center justify-center rounded-full text-cream/90 hover:text-gold-bright"
        aria-label={`${t.open}${count ? ` (${count})` : ""}`}
      >
        <ClipboardList className="size-5" aria-hidden />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-gold-bright px-1 text-[0.65rem] font-semibold text-wine-deep">
            {count}
          </span>
        )}
      </SheetTrigger>

      <SheetContent closeLabel={dict.nav.close} className="w-[min(94vw,440px)]">
        <div className="border-b border-oak/40 px-6 pt-6 pb-4">
          <SheetTitle className="text-lg tracking-[0.12em] text-wine uppercase">
            {t.title}
          </SheetTitle>
          <SheetDescription className="mt-1 text-xs text-brown">
            {t.note}
          </SheetDescription>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
            <ClipboardList
              className="size-10 text-oak"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="text-brown">{t.empty}</p>
            <Link
              href={href(locale, "catalog")}
              className={buttonVariants({ variant: "wine" })}
            >
              {t.browse}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-oak/30 overflow-y-auto px-6">
              {lines.map(({ item, product }) => (
                <li
                  key={itemKey(item)}
                  className="flex items-center gap-3 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={href(
                        locale,
                        "catalog",
                        product.category,
                        product.slug,
                      )}
                      className="block truncate font-medium text-wine hover:underline"
                    >
                      {product.name[locale]}
                    </Link>
                    <p className="text-xs text-brown">
                      {formatPrice(product.price, locale, dict.catalog)}
                    </p>
                  </div>
                  <div
                    className="flex items-center rounded-full border border-wine/20"
                    role="group"
                    aria-label={`${t.quantity}: ${product.name[locale]}`}
                  >
                    <QtyButton
                      label={t.decrease}
                      onClick={() =>
                        dispatch({ type: "set", ...item, qty: item.qty - 1 })
                      }
                    >
                      <Minus aria-hidden />
                    </QtyButton>
                    <span
                      className="w-7 text-center text-sm tabular-nums"
                      aria-live="polite"
                    >
                      {item.qty}
                    </span>
                    <QtyButton
                      label={t.increase}
                      onClick={() => dispatch({ type: "add", ...item })}
                    >
                      <Plus aria-hidden />
                    </QtyButton>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "remove", ...item })}
                    className="inline-flex size-9 items-center justify-center rounded-full text-brown hover:bg-wine/5 hover:text-wine"
                    aria-label={`${t.remove}: ${product.name[locale]}`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            <div className="grid gap-3 border-t border-oak/40 bg-white px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <p className="eyebrow text-gold-ink">{t.sendTitle}</p>
              <a
                href={channelHref("whatsapp", message)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "wine" }), "w-full")}
              >
                <MessageCircle aria-hidden /> WhatsApp
              </a>
              <div className="grid grid-cols-3 gap-2">
                {copyChannels.map(({ id, icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => copyAndOpen(id)}
                    className={cn(
                      buttonVariants({ variant: "outlineDark", size: "sm" }),
                      "px-2 tracking-[0.08em]",
                    )}
                  >
                    {icon} {dict.order[id]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-brown">{t.sendHint}</p>
              {notice === "copied" && (
                <p role="status" className="text-sm font-medium text-wine">
                  {t.copied}
                </p>
              )}
              {notice === "failed" && (
                <div role="status" className="grid gap-2">
                  <p className="text-sm text-wine">{t.copyFailed}</p>
                  <textarea
                    readOnly
                    value={message}
                    rows={5}
                    className="rounded-xl border border-wine/20 bg-ivory p-3 text-xs"
                    onFocus={(e) => e.currentTarget.select()}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => dispatch({ type: "clear" })}
                className="justify-self-start text-xs text-brown underline-offset-4 hover:underline"
              >
                {t.clear}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function QtyButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-full text-wine hover:bg-wine/5 [&_svg]:size-3.5"
    >
      {children}
    </button>
  );
}
