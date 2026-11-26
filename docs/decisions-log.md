# Decisions log — Chira Sweets
All decisions by @ciprik13 unless noted.

| ID | Date | Decision | Rationale / notes |
|---|---|---|---|
| D-001 | 2026-11-22 | Logo is approved and not redesigned; digital identity is built around it. | Client approval. |
| D-002 | 2026-11-24 | Domain chirasweets.md registered via nic.md; @ciprik13 holds the registrar account. | 2FA on registrar not yet enabled → open item (required before launch). |
| D-003 | 2026-11-24 | Brand palette baseline = values in `docs/design/brand-inventory.md`; final single values chosen in Phase 1. | Two golds / two creams in logo files to unify. |
| D-004 | 2026-11-24 | Discovery is run as a structured Q&A, one question at a time, in a fixed topic order. | Owner decision. |
| D-005 | 2026-11-24 | Dev tooling (process, security-review and design skills) lives on the developer machine only; nothing tool-specific is committed. | Keeps the public repo clean. |
| D-006 | 2026-11-24 | Stack: Next.js (App Router) + TypeScript strict + Tailwind CSS + shadcn/ui, themed with own tokens. | As in spec. |
| D-007 | 2026-11-24 | Repo ciprik13/chira-sweets is PUBLIC. | Free rulesets, CodeQL, secret scanning + push protection. Secrets only in env. |
| D-008 | 2026-11-24 | Git flow: `feat/*`, `fix/*`, `chore/*`, `docs/*` → squash PR into `dev`; release PR `dev` → `main` (merge commit); semver tags on `main`. Conventional Commits. Prod deploys only from `main`. | Merge commit on release keeps `dev` and `main` histories compatible. |
| D-009 | 2026-11-24 | MVP is a showcase site + contact. No cart, accounts or online payment. Orders happen via phone and messengers. | Fastest path to launch; online ordering is a later release. |
| D-010 | 2026-11-24 | Order/contact channels: phone, Instagram, TikTok, Telegram, Viber, WhatsApp — shown as direct action buttons. | Customers already order this way. |
| D-011 | 2026-11-24 | Pricing: fixed unit price for display products; "from" price for cakes and custom orders. | Showing a price drives contact; custom work is quoted. |
| D-012 | 2026-11-24 | Catalog categories: Macarons, Custom cakes, Cheesecake, Croissants & pastry, Desserts, Chocolate-covered fruit, Gift boxes, Coffee & drinks. | Based on shop banner and Instagram; owner confirmation pending. |
| D-013 | 2026-11-24 | Separate "Events / corporate" section (candy bar, macaron towers, large orders) with a request form. Courses are out of scope. | |
| D-014 | 2026-11-24 | The site shows delivery (Chișinău, rest of Moldova), cake lead time and pickup address. | Values pending from the owner. |
| D-015 | 2026-11-24 | Languages: Romanian (default) + Russian. i18n structure from day one. | |
| D-016 | 2026-11-24 | Product photos: owner's original photos, retouched with one standard AI-editing prompt. Only background/light/colour may change — never the product itself. | No budget/time for a shoot before launch; product must stay truthful. |
| D-017 | 2026-11-24 | Copy: drafted by the dev team in RO + RU from owner input; owner verifies facts and tone. Allergens and ingredients come only from the owner. | Food-safety information must be authoritative. |
| D-018 | 2026-11-24 | Content lives in typed data files in the repo, edited via PR. Modelled like CMS collections so a headless CMS can replace it later. | No admin surface to secure at launch. |
| D-019 | 2026-11-24 | Hosting on Cloudflare (static site + one function for the events form). DNS moves to Cloudflare at launch; domain stays registered at nic.md. | Free tier allows commercial use; Vercel Hobby does not. |
| D-020 | 2026-11-24 | Event requests are delivered to the owner via a Telegram bot. contact@chirasweets.md forwards to the owner's mailbox via Cloudflare Email Routing. Private addresses and tokens are never committed. | Instant notification, no monthly cost. |
| D-021 | 2026-11-24 | Target launch: 2026-12-01. One visual direction instead of three. | Business deadline (QR on shop banner already points to the domain). |
| D-022 | 2026-11-24 | Analytics: Cloudflare Web Analytics (cookieless, no consent banner). | Privacy-friendly, free. |
| D-023 | 2026-11-26 | Instagram is an order channel (DM link `ig.me/m/chira_sweets`) next to phone, Telegram, Viber, WhatsApp. | Customers already order via Instagram (D-010). Was P-023. |
| D-024 | 2026-11-26 | Catalog search and filters: text, category, "free from" (owner-verified allergens only), price. Client-side, state in the URL. | Faster browsing once the full catalog is in (G2). Was P-024. |
| D-026 | 2026-11-26 | Custom-cake request form with optional reference photo → Telegram. Photo type checked by magic bytes, re-encoded in the browser, EXIF/GPS stripped on the server, not stored. | Persona Igor; structured custom-cake requests. Was P-026. |
| D-027 | 2026-11-26 | Accent serif: Gilda Display (Latin) with **Forum** as the Cyrillic fallback, then Jost for everything else. | Matches the design canvas; RU text no longer falls back to a system serif (Georgia is missing on Android). Was P-027. |
| D-028 | 2026-11-26 | Text in a real person's voice (About page, homepage quote by Chiriac David) is hidden in production until that person approves it (`src/content/approvals.ts`); previews show it for review. | Publishing words attributed to someone needs their consent. |
| D-029 | 2026-11-26 | Canonical domain `https://chirasweets.md`; `www.chirasweets.md` (on the shop banner QR) 301-redirects to it. Cloudflare Pages project: `chira-sweets` → `chira-sweets-4fw.pages.dev`. | One canonical URL for SEO; the QR keeps working. |

## Postponed
| ID | Item | Status |
|---|---|---|
| P-025 | "Lista mea": several products sent as one messenger message. | Postponed to after launch (@ciprik13, 2026-11-26). Code kept on branch `feat/order-list`. |

## Proposed — pending @ciprik13 (PR #7)
Numbered after D-029 to avoid clashing IDs.

| ID | Proposal | Why | Cost / risk |
|---|---|---|---|
| P-030 | Content editing through **TinaCMS (Tina Cloud, free plan)**: all content moves to JSON in `content/` (catalog, shop settings, RO/RU copy), photos to `public/uploads`; admin at `/admin`. Replaces "content edited via PR" in D-018. | Owner must update prices and photos without a developer; Tina Cloud logs in by e-mail (no GitHub account), stores content in the repo (no lock-in, history in Git). | Free plan: 2 editors, no editorial (draft/PR) workflow — that is ~$49/month. Adds an admin surface (own CSP, Tina Cloud auth). |
| P-031 | CMS saves commit to **`dev`** (Tina Cloud app on the `protect-dev` bypass list); they show on the dev preview and go live with the next release PR `dev` → `main`, which still needs @ciprik13 in `production`. Chosen by @mihaelaaa-23 on 2026-11-26 ("with each release"), pending @ciprik13. | No content reaches production without a release review; the owner sees changes on the preview immediately. | Price changes wait for the next release; releases should be frequent once the owner edits. |


## Open items
See `docs/open-questions.md`.
