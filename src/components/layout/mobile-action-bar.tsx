import { MessageCircle, MessagesSquare, Phone, Send } from "lucide-react";
import type { ComponentType } from "react";
import { InstagramIcon } from "@/components/brand/icons";
import type { Dictionary } from "@/i18n/dictionaries";
import { channelHref, type Channel } from "@/lib/contact";

const actions: { id: Channel; Icon: ComponentType<{ className?: string }> }[] =
  [
    { id: "phone", Icon: Phone },
    { id: "telegram", Icon: Send },
    { id: "viber", Icon: MessagesSquare },
    { id: "whatsapp", Icon: MessageCircle },
    { id: "instagram", Icon: InstagramIcon },
  ];

/** Sticky contact bar on mobile (sitemap: global elements, US-04). Instagram opens a DM. */
export function MobileActionBar({ dict }: { dict: Dictionary }) {
  return (
    <nav
      aria-label={dict.actionBar.label}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-wine-deep pb-[env(safe-area-inset-bottom)] text-cream sm:hidden"
    >
      <ul className="grid grid-cols-5">
        {actions.map(({ id, Icon }) => (
          <li key={id}>
            <a
              href={channelHref(id)}
              target={id === "phone" ? undefined : "_blank"}
              rel={id === "phone" ? undefined : "noopener noreferrer"}
              className="flex min-h-14 flex-col items-center justify-center gap-1 text-[0.62rem] tracking-wide uppercase"
            >
              <Icon className="size-5 text-gold-bright" />
              {id === "phone" ? dict.order.call : dict.order[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
