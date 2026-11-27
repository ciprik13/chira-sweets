# Deploy — chirasweets.md on Cloudflare Pages

Decisions: D-019 (Cloudflare Pages + one function), D-020 (Telegram bot, email routing), D-022 (Web Analytics), D-008 (prod only from `main`).

How it works: `.github/workflows/deploy.yml` builds the static site (`npm run build` → `out/`) and runs `wrangler pages deploy`, which also uploads `functions/api/request.ts` (the events form → Telegram).

| Trigger | Result | Drafts shown |
|---|---|---|
| push to `main` | **Production** → chirasweets.md | no |
| push to `dev` | Preview → `dev.chira-sweets-4fw.pages.dev` | yes |
| PR into `dev` / `main` | Preview → `<branch>.chira-sweets-4fw.pages.dev`, URL commented on the PR | yes |

Preview URLs (`*.chira-sweets-4fw.pages.dev` branch and deployment aliases) are served by Cloudflare with `X-Robots-Tag: noindex` (checked on 2026-11-26), so draft products shown there are not indexed. Draft product pages also carry `<meta name="robots" content="noindex">`.

No secret is ever committed. Everything below is done once, by the account owner (@ciprik13).

---

## 1. Cloudflare account
1. Sign in at dash.cloudflare.com, **enable 2FA** (Q-11, launch gate).
2. Copy the **Account ID** (Workers & Pages → right sidebar).

## 2. Create the Pages project
Workers & Pages → Create → Pages → **Direct Upload** → name it exactly `chira-sweets` → set **Production branch = `main`**. Cloudflare assigns the subdomain **`chira-sweets-4fw.pages.dev`** (`chira-sweets.pages.dev` belongs to another account). Only one project should exist — in @ciprik13's account.
(Do not connect Git here — GitHub Actions does the deploys.)

## 3. API token for GitHub Actions
My Profile → API Tokens → Create Token → *Custom token*:
- Permissions: **Account → Cloudflare Pages → Edit**
- Account resources: only this account
- (Optional) Client IP filtering: none; TTL: no expiry or 1 year

## 4. GitHub repository settings
Settings → Secrets and variables → Actions:

| Kind | Name | Value |
|---|---|---|
| Secret | `CLOUDFLARE_API_TOKEN` | token from step 3 |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | account ID from step 1 |
| Variable | `TURNSTILE_SITE_KEY` | site key from step 5 (public) |

Settings → Environments → **New environment** `production` (admin only):
- **Required reviewers: @ciprik13** — every production deploy waits for this approval.
- **Deployment branches and tags: Selected branches → `main`** only.
- **Prevent self-review: OFF** — otherwise @ciprik13 cannot approve production deploys he triggers himself (releases he merges).

Create `preview` too (no reviewers) so preview deploys show up under Environments.

The deploy workflow runs a `verify` job (lint, format, typecheck, tests, audit) and the deploy job `needs` it, so nothing is deployed without green checks.

## 5. Turnstile (anti-spam for the form)
Cloudflare → Turnstile → Add widget:
- Hostnames: `chirasweets.md`, `www.chirasweets.md`, `chira-sweets-4fw.pages.dev`
- Widget mode: **Invisible** (the form renders it as "interaction-only")
- Copy the **site key** → GitHub variable `TURNSTILE_SITE_KEY`
- Copy the **secret key** → Pages secret `TURNSTILE_SECRET` (step 7)

## 6. Telegram bot (event requests)
1. In Telegram, open **@BotFather** → `/newbot` → name "Chira Sweets Site" → copy the **bot token**.
2. The owner opens the new bot and presses **Start** (or add the bot to a private group for the shop).
3. Get the chat ID: open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser after sending the bot a message; copy `message.chat.id`.

## 7. Pages secrets
Pages → chira-sweets → Settings → Variables and Secrets → add for **Production** and **Preview**:

| Name | Type | Value |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Secret | from step 6 |
| `TELEGRAM_CHAT_ID` | Secret | from step 6 |
| `TURNSTILE_SECRET` | Secret | from step 5 |

`ALLOWED_ORIGINS` comes from `wrangler.toml` (production: chirasweets.md + www; previews: same-origin).
Tip: for Preview you can use a separate test chat so test requests don't reach the owner.

## 8. First deploy
Merge to `dev` → check the preview URL. When approved, release PR `dev` → `main` (merge commit) → production deploy runs.

## 9. Domain: move DNS from nic.md to Cloudflare (planned 2026-11-30)
1. Cloudflare → Add a site → `chirasweets.md` → **Free** plan. Cloudflare scans existing records — check them (especially any MX/TXT for email) before continuing.
2. Cloudflare shows two nameservers (e.g. `xxx.ns.cloudflare.com`).
3. At **nic.md** (registrar account, 2FA on), replace the domain's nameservers with the two Cloudflare ones. Propagation: minutes to 24 h.
4. When the zone is **Active**: Pages → chira-sweets → Custom domains → add `chirasweets.md`, then `www.chirasweets.md`.
5. Redirect www → apex (D-029): Rules → Redirect Rules → *Redirect from WWW to root* template, **301**, keep path & query. `https://chirasweets.md` is the only canonical URL; the shop banner QR may point to www.
6. SSL/TLS → mode **Full (strict)**; Edge Certificates → **Always Use HTTPS** on.

## 10. Protection & analytics
- **Rate limit the form — REQUIRED before launch**: Security → WAF → Rate limiting rules → *If URI Path equals `/api/request`* → 5 requests / 10 s per IP → Block for 10 s (free plan allows one rule). Turnstile alone does not stop a flood of requests reaching the function and Telegram.
- **Web Analytics** (cookieless): Pages → chira-sweets → Metrics → Enable Web Analytics. The CSP already allows `static.cloudflareinsights.com`.
- **Email**: Email → Email Routing → `contact@chirasweets.md` → owner's mailbox (the private address only in Cloudflare, never in the repo). **Only after a test message arrives**, set `email: "contact@chirasweets.md"` in `src/content/shop.ts` (and its test). Until then the site shows no e-mail (#9).

## 11. Launch checklist
- [ ] **Chiriac David approved the About text and the homepage quote** (RO and RU, check them on the preview), then set `FOUNDER_TEXT_APPROVED = true` in `src/content/approvals.ts` — launch blocker (D-028)
- [ ] **WAF rate-limit rule on `/api/request` active** (step 10) — launch blocker
- [ ] `production` environment requires @ciprik13's approval (step 4)
- [ ] https://chirasweets.md/ redirects to `/ro/`; `https://www.chirasweets.md/<any path>` returns **301** to `https://chirasweets.md/<same path>`; HTTPS only
- [ ] Shop banner QR code opens the site on a phone
- [ ] Events form on production sends a Telegram message to the owner within a minute
- [ ] Call / Telegram / Viber / WhatsApp / Instagram buttons open the right chats (owner confirms numbers, Q-04)
- [ ] `/sitemap.xml` and `/robots.txt` load; submit the sitemap in Google Search Console
- [ ] Lighthouse mobile ≥ 90 on home, a category and a product page
- [ ] No draft sample products visible on production
- [ ] 2FA on nic.md, GitHub and Cloudflare (Q-11)

## Local checks
```bash
npm run build                               # static site + CSP hashes in out/
npx wrangler pages dev out                  # site + /api/request locally
```
For `wrangler pages dev`, put test values in an untracked `.dev.vars` file
(`TURNSTILE_SECRET=1x0000000000000000000000000000000AA` is Cloudflare's always-pass test secret; use a test bot/chat for Telegram).
