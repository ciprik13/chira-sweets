# Sitemap — MVP
Every page exists in Romanian (`/ro`, default) and Russian (`/ru`). `/` redirects to `/ro`.

```
/ro                              Home
├── /ro/catalog                  Catalog — all categories
│   ├── /ro/catalog/[category]   Category listing (8 categories, see D-012)
│   │   └── /ro/catalog/[category]/[product]   Product page
├── /ro/evenimente               Events / corporate + request form
├── /ro/livrare                  Delivery & pickup (conditions, address, map, hours)
├── /ro/despre                   About us
├── /ro/intrebari                FAQ
├── /ro/contact                  Contact (all channels, map, hours)
└── /ro/confidentialitate        Privacy policy
```
Russian slugs are translated (`/ru/katalog`, `/ru/meropriyatiya`, `/ru/dostavka`, `/ru/o-nas`, `/ru/voprosy`, `/ru/kontakty`, `/ru/konfidentsialnost`).

## Global elements (every page)
- Header: logo, main navigation, language switch (RO / RU).
- Sticky mobile action bar: Call · Telegram · Viber · WhatsApp.
- Footer: address, hours, contact channels, social links (Instagram, TikTok), legal entity, privacy link.

## Homepage sections
1. Hero — macaron-led visual, headline, primary CTA "Comandă acum" (opens contact options).
2. Categories grid.
3. Bestsellers / popular this week (curated in data).
4. Custom cakes teaser ("from X lei/kg", lead time) → contact.
5. Events / corporate teaser → `/evenimente`.
6. Delivery & pickup summary → `/livrare`.
7. About teaser → `/despre`.
8. Instagram strip (curated static images linking to the profile — no third-party embed).
9. Contact block with map.

## Technical routes
- `/sitemap.xml`, `/robots.txt`, `/api/event-request` (Cloudflare function), `404` page in both languages.
