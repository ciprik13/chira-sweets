import { shop } from "@/content/shop";

export type Channel = "phone" | "telegram" | "viber" | "whatsapp" | "instagram";

const digits = (e164: string) => e164.replace(/\D/g, "");

export function phoneHref(e164: string = shop.phone.e164): string {
  return `tel:${e164}`;
}

/** WhatsApp is the only channel that supports a pre-filled message to a person. */
export function whatsappHref(
  e164: string = shop.messengers.whatsapp.value,
  text?: string,
): string {
  const base = `https://wa.me/${digits(e164)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function viberHref(e164: string = shop.messengers.viber.value): string {
  return `viber://chat?number=${encodeURIComponent(`+${digits(e164)}`)}`;
}

/** t.me/+<number> opens a chat by phone number; a username is used as-is. */
export function telegramHref(
  value: string = shop.messengers.telegram.value,
): string {
  return value.startsWith("+")
    ? `https://t.me/+${digits(value)}`
    : `https://t.me/${value.replace(/^@/, "")}`;
}

export function instagramHref(handle: string = shop.social.instagram): string {
  return `https://www.instagram.com/${handle.replace(/^@/, "")}/`;
}

export function channelHref(channel: Channel, text?: string): string {
  switch (channel) {
    case "phone":
      return phoneHref();
    case "telegram":
      return telegramHref();
    case "viber":
      return viberHref();
    case "whatsapp":
      return whatsappHref(undefined, text);
    case "instagram":
      return instagramHref();
  }
}
