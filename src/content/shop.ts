import { z } from "zod";
import raw from "../../content/settings/shop.json";

/**
 * Shop settings, edited in the CMS (content/settings/shop.json).
 * Only public business data belongs here — never the owner's private phone
 * or e-mail (content-plan rules). Validated at build time: a bad edit fails
 * the build instead of breaking the live site.
 */
const phone = z
  .string()
  .trim()
  .regex(/^\+\d{8,15}$/, "international format, e.g. +37379349097");
const handle = z
  .string()
  .trim()
  .regex(/^@?[\w.]*$/, "handle only, without the link");
const localizedText = z.object({
  ro: z.string().trim(),
  ru: z.string().trim(),
});
const day = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);
const time = z.string().regex(/^\d{2}:\d{2}$/, "HH:MM");

export const shopSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.object({ e164: phone, display: z.string().trim().min(1) }),
  /** Phone number (+373…) or Telegram username. */
  telegram: z.string().trim().min(1),
  viber: phone,
  whatsapp: phone,
  instagram: handle.min(1),
  tiktok: handle,
  /** Public e-mail; empty until Cloudflare Email Routing works (docs/deploy.md). */
  email: z.union([z.email(), z.literal("")]),
  address: localizedText,
  postalAddress: z.object({
    streetAddress: z.string().trim(),
    addressLocality: z.string().trim(),
    addressRegion: z.string().trim(),
    addressCountry: z.string().trim().length(2),
  }),
  hours: localizedText,
  openingHours: z.array(
    z.object({ days: z.array(day).min(1), opens: time, closes: time }),
  ),
  legalEntity: z.object({ name: z.string().trim(), idno: z.string().trim() }),
  /** D-028: the founder approved his About text and quote (ticked in the CMS). */
  founderTextApproved: z.boolean().default(false),
});

export type ShopSettings = z.infer<typeof shopSchema>;

const both = (v: { ro: string; ru: string }) => (v.ro && v.ru ? v : null);

/** Shape used by the components; empty CMS fields become `null`. */
export function toShop(s: ShopSettings) {
  return {
    name: s.name,
    phone: s.phone,
    messengers: {
      telegram: { value: s.telegram },
      viber: { value: s.viber },
      whatsapp: { value: s.whatsapp },
    },
    social: {
      instagram: s.instagram.replace(/^@/, ""),
      tiktok: s.tiktok.replace(/^@/, "") || null,
    },
    /** `null` until the address really receives mail. */
    email: s.email || null,
    /** `null` renders an "în curând / скоро" placeholder. */
    address: both(s.address),
    postalAddress: s.postalAddress,
    hours: both(s.hours),
    openingHours: s.openingHours,
    legalEntity: s.legalEntity.name ? s.legalEntity : null,
    founderTextApproved: s.founderTextApproved,
  };
}

export const shop = toShop(shopSchema.parse(raw));
export type Shop = typeof shop;
