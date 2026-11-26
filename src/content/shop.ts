/**
 * Public business contact data (C-07, C-08).
 * Only data that is already public (printed on the shop banner) lives here.
 * Never put the owner's private phone or e-mail in this file (content-plan rules).
 *
 * TODO(owner, Q-04): confirm that Telegram, Viber and WhatsApp use the same
 * number as the shop phone, and which Instagram account the site links to.
 */
export const shop = {
  name: "Chira Sweets",
  phone: {
    e164: "+37379349097",
    display: "079 349 097",
  },
  messengers: {
    telegram: { kind: "phone", value: "+37379349097" },
    viber: { kind: "phone", value: "+37379349097" },
    whatsapp: { kind: "phone", value: "+37379349097" },
  },
  social: {
    instagram: "chira_sweets",
    tiktok: null as string | null,
  },
  email: "contact@chirasweets.md",
  /** Pending owner input (Q-03, Q-08). `null` renders an "in curând / скоро" placeholder. */
  address: null as { ro: string; ru: string } | null,
  hours: null as { ro: string; ru: string } | null,
  legalEntity: null as { name: string; idno: string } | null,
} as const;

export type Shop = typeof shop;
