import { Mail, MessageCircle, MessagesSquare, Phone, Send } from "lucide-react";
import type { ReactNode } from "react";
import { InstagramIcon } from "@/components/brand/icons";
import { shop } from "@/content/shop";
import type { Dictionary } from "@/i18n/dictionaries";
import { channelHref, instagramHref, type Channel } from "@/lib/contact";

/** All contact channels as large cards (contact page). Instagram has both DM and profile. */
export function ContactChannels({ dict }: { dict: Dictionary }) {
  const items: { id: Channel; icon: ReactNode; detail?: string }[] = [
    { id: "phone", icon: <Phone aria-hidden />, detail: shop.phone.display },
    { id: "telegram", icon: <Send aria-hidden /> },
    { id: "viber", icon: <MessagesSquare aria-hidden /> },
    { id: "whatsapp", icon: <MessageCircle aria-hidden /> },
    {
      id: "instagram",
      icon: <InstagramIcon className="size-6" />,
      detail: `@${shop.social.instagram}`,
    },
  ];

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ id, icon, detail }) => (
        <li key={id}>
          <a
            href={channelHref(id)}
            target={id === "phone" ? undefined : "_blank"}
            rel={id === "phone" ? undefined : "noopener noreferrer"}
            className="flex min-h-20 items-center gap-4 rounded-2xl border border-oak/40 bg-white p-5 transition hover:border-wine/50 hover:shadow-md [&>svg]:size-6 [&>svg]:shrink-0 [&>svg]:text-wine"
          >
            {icon}
            <span className="flex flex-col">
              <span className="font-medium tracking-wide text-wine">
                {id === "phone" ? dict.order.call : dict.order[id]}
              </span>
              {detail && <span className="text-sm text-brown">{detail}</span>}
            </span>
          </a>
          {id === "instagram" && (
            <a
              href={instagramHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block px-1 text-xs text-gold-ink underline-offset-4 hover:underline"
            >
              {dict.home.instagram.cta} →
            </a>
          )}
        </li>
      ))}
      <li>
        <a
          href={`mailto:${shop.email}`}
          className="flex min-h-20 items-center gap-4 rounded-2xl border border-oak/40 bg-white p-5 transition hover:border-wine/50 hover:shadow-md"
        >
          <Mail className="size-6 shrink-0 text-wine" aria-hidden />
          <span className="flex flex-col">
            <span className="font-medium tracking-wide text-wine">
              {dict.pages.contact.email}
            </span>
            <span className="text-sm text-brown">{shop.email}</span>
          </span>
        </a>
      </li>
    </ul>
  );
}
