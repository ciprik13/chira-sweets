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
  /**
   * Public e-mail. `null` until Cloudflare Email Routing delivers a test
   * message (docs/deploy.md, step 10); then set "contact@chirasweets.md".
   * While `null`, the site shows no e-mail anywhere.
   */
  email: null as string | null,
  /** Pickup address and hours (C-07), confirmed by the owner on 2026-11-26. */
  address: {
    ro: "str. Tudor Vladimirescu 69, Durlești",
    ru: "ул. Тудор Владимиреску, 69, Дурлешты",
  } as { ro: string; ru: string } | null,
  /** Address parts for schema.org. */
  postalAddress: {
    streetAddress: "str. Tudor Vladimirescu 69",
    addressLocality: "Durlești",
    addressRegion: "Chișinău",
    addressCountry: "MD",
  },
  /** One line per group of days; rendered with line breaks. */
  hours: {
    ro: "Luni–Sâmbătă: 6:30–20:30\nDuminică: 11:00–20:30",
    ru: "Пн–Сб: 6:30–20:30\nВс: 11:00–20:30",
  } as { ro: string; ru: string } | null,
  /** Same hours for schema.org (openingHoursSpecification). */
  openingHours: [
    {
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "06:30",
      closes: "20:30",
    },
    { days: ["Sunday"], opens: "11:00", closes: "20:30" },
  ],
  /** Pending owner input (Q-08). `null` renders nothing. */
  legalEntity: null as { name: string; idno: string } | null,
} as const;

export type Shop = typeof shop;
