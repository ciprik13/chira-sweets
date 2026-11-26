# PRD — Chira Sweets website (MVP)
Status: Phase 0 output, pending approval by @ciprik13 · Target launch: 2026-12-01

## 1. Context
Chira Sweets is a pastry shop in Chișinău (macarons, custom cakes, cheesecake, croissants, desserts, chocolate-covered fruit, gift boxes, coffee). Orders currently come through phone and Instagram. A QR code on the shop's facade banner already points to `chirasweets.md`, which has no website yet.

## 2. Goals
| # | Goal | Measure |
|---|---|---|
| G1 | Turn banner/Instagram visitors into orders | Clicks on call / messenger buttons |
| G2 | Show the full range with prices so customers know what to order | Catalog views per visit |
| G3 | Generate event / corporate leads | Submitted event requests |
| G4 | Be found on Google for local dessert searches | Search impressions for "macarons Chișinău", "torturi la comandă Chișinău" |
| G5 | Look premium and consistent with the approved brand | Owner approval; Lighthouse ≥ 90 on mobile in all four categories |

## 3. Non-goals (MVP)
Cart, checkout, online payment, customer accounts, admin panel / CMS, courses, English version, newsletter.

## 4. Personas
- **Ana, 28, gift buyer (primary).** Scans the QR or comes from Instagram on her phone. Wants to see what exists, how much it costs and how to order in under a minute.
- **Igor, 35, custom cake for a family event.** Needs the "from" price, the lead time and a quick way to discuss details.
- **Elena, 40, office manager.** Plans a corporate event; needs to know options and send a request she can follow up on.
- **Russian-speaking customer.** Same needs, in Russian.

## 5. User stories (MVP — all "Must" unless marked)
**Browse**
- US-01 As a visitor, I want to see the product categories on the homepage, so that I quickly find what I'm looking for.
  - AC: all categories from the catalog are reachable from the homepage in one tap; works at 360 px width.
- US-02 As a visitor, I want to browse a category with photos and prices, so that I can choose.
  - AC: each product shows photo, name, size/weight and price; cakes and custom items show "from X lei".
- US-03 As a visitor, I want a product page with description and allergens, so that I can order safely.
  - AC: description, size/weight, price, allergen list; allergens come from owner-verified data only; a product without verified allergens shows "ask us about allergens".

**Order / contact**
- US-04 As a visitor, I want one-tap buttons to call or message the shop (Telegram, Viber, WhatsApp, Instagram), so that I can order the way I prefer.
  - AC: buttons are visible on every page (sticky on mobile) and on each product page; deep links open the correct app/chat; product name is pre-filled in the message where the channel supports it.
- US-05 As a visitor, I want to see delivery and pickup conditions, so that I know if and how I'll get my order.
  - AC: Chișinău delivery, rest-of-Moldova delivery, cake lead time, pickup address with map and opening hours.

**Events**
- US-06 As a company/event organiser, I want to send an event request, so that the shop contacts me with an offer.
  - AC: form with name, phone, event date, guest count, interest (candy bar / macaron tower / gift boxes / other), message; validation on client and server; anti-spam (invisible challenge + rate limit); owner receives it on Telegram within a minute; visitor sees a confirmation.

**Trust & discovery**
- US-07 As a visitor, I want an "About" section, so that I know who makes the desserts.
- US-08 As a visitor, I want an FAQ (ordering, delivery, payment, allergens, storage), so that I get answers without calling. *(Should)*
- US-09 As a Russian speaker, I want the whole site in Russian, so that I understand everything.
  - AC: language switch on every page keeps the current page; URLs `/ro/...` and `/ru/...`; no untranslated strings.
- US-10 As the owner, I want the site to appear on Google and share nicely on social media.
  - AC: per-page title/description in both languages, Open Graph images, `sitemap.xml`, `robots.txt`, schema.org `Bakery` (+ `Product` on product pages), hreflang ro/ru.
- US-11 As the owner, I want privacy-friendly visit statistics. *(Should)* — cookieless analytics, no consent banner required.

## 6. Scope: MVP vs later
| MVP (2026-12-01) | Later |
|---|---|
| Showcase catalog with prices, product pages | Online ordering with pickup/delivery slots |
| Contact buttons on every page | Online card payment (local processor) |
| Events request form → Telegram | Cake configurator with price estimate |
| Delivery / pickup / FAQ / About | Customer accounts, re-order |
| RO + RU | Headless CMS for the owner |
| SEO, analytics, security headers | Promo codes, newsletter, EN |

## 7. Non-functional requirements
- Mobile-first; Lighthouse ≥ 90 on mobile (Performance, Accessibility, Best Practices, SEO); Core Web Vitals "good".
- WCAG 2.2 AA: keyboard navigation, visible focus, text contrast ≥ 4.5:1, alt text on all images.
- Security: strict CSP and security headers, no secrets in the repo, form validated server-side (Zod), rate limited, invisible challenge.
- Privacy: no personal data stored on the site; event requests are forwarded, not persisted; privacy policy page.

## 8. KPIs (first 30 days after launch)
- ≥ 30 % of visits click a contact button.
- ≥ 5 event requests.
- Site indexed on Google; Google Business Profile links to the site.

## 9. Dependencies & risks
| Risk | Impact | Mitigation |
|---|---|---|
| Owner answers (prices, allergens, delivery, photos) arrive after 2026-11-26 | Launch slips day-for-day | Questions sent 2026-11-24; launch with a reduced catalog if needed |
| Photo quality inconsistent | Site looks less premium than references | One standard retouch prompt, tested on 2–3 photos first |
| Allergen data incomplete | Food-safety risk | Show "ask us about allergens" instead of guessing |
| DNS switch to Cloudflare | Short downtime / email issues | Done on 2026-11-30 with verification before launch |
