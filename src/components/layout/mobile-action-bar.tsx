import { MessageCircle, MessagesSquare, Phone, Send } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { channelHref, type Channel } from "@/lib/contact";

const actions: { id: Exclude<Channel, "instagram">; Icon: typeof Phone }[] = [
  { id: "phone", Icon: Phone },
  { id: "telegram", Icon: Send },
  { id: "viber", Icon: MessagesSquare },
  { id: "whatsapp", Icon: MessageCircle },
];

/** Sticky contact bar on mobile (sitemap: global elements, US-04). */
export function MobileActionBar({ dict }: { dict: Dictionary }) {
  return (
    <nav
      aria-label={dict.actionBar.label}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-wine-deep/95 pb-[env(safe-area-inset-bottom)] text-cream backdrop-blur sm:hidden"
    >
      <ul className="grid grid-cols-4">
        {actions.map(({ id, Icon }) => (
          <li key={id}>
            <a
              href={channelHref(id)}
              target={id === "phone" ? undefined : "_blank"}
              rel={id === "phone" ? undefined : "noopener noreferrer"}
              className="flex min-h-14 flex-col items-center justify-center gap-1 text-[0.7rem] tracking-wider uppercase"
            >
              <Icon
                className="size-5 text-gold-bright"
                strokeWidth={1.5}
                aria-hidden
              />
              {id === "phone" ? dict.order.call : dict.order[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
