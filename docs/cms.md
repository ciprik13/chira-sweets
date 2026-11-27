# CMS — editing the site with TinaCMS

Everything visitors see is editable at **https://chirasweets.md/admin/**:

| In the CMS | File in the repo | What it holds |
|---|---|---|
| **Catalog — produse, prețuri, poze** | `content/catalog/catalog.json` | Products (name, category, price, photos, size, description, allergens, bestseller, draft) and categories |
| **Date cofetărie** | `content/settings/shop.json` | Phone, Telegram, Viber, WhatsApp, Instagram, TikTok, e-mail, address, opening hours, legal entity, founder-text approval (D-028) |
| **Texte site (RO / RU)** | `content/copy/ro.json`, `content/copy/ru.json` | Every text on every page, in both languages |
| Photos | `public/uploads/` | Uploaded through the CMS |

How it works: a save in the CMS is a Git commit to **`dev`** made by Tina Cloud (P-031). It shows on the preview **https://dev.chira-sweets-4fw.pages.dev** within a few minutes and reaches **chirasweets.md with the next release** (PR `dev` → `main`, approved by @ciprik13). Every build **validates all content** (Zod schemas in `src/content/*.ts`, RO/RU parity tests) before building. An invalid edit (a fixed price without an amount, a HEIC photo, a missing Russian name…) fails the build and the live site stays as it was; the error is shown in the GitHub Actions run.

Photos: the build strips EXIF/GPS from every uploaded photo, limits originals to 2400 px and creates WEBP versions at 480 / 960 / 1600 px (`scripts/postbuild.mjs`, `src/lib/images.ts`). Phones download the small version.

---

## One-time setup (admin, ~20 min)

1. **Tina Cloud account** — https://app.tina.io, sign in with the GitHub account that owns the repo (@ciprik13). Enable 2FA.
2. **Create a project** → *Import from GitHub* → `ciprik13/chira-sweets`. Tina installs its GitHub app on the repo.
   - Site URL: `https://chirasweets.md`
   - Path to the Tina config: `tina` (default)
3. Project → **Overview**: copy the **Client ID**. Project → **Tokens**: create a **read-only content token**.
4. **GitHub** → repo Settings → Secrets and variables → Actions:
   | Kind | Name | Value |
   |---|---|---|
   | Variable | `TINA_CLIENT_ID` | Client ID |
   | Secret | `TINA_TOKEN` | read-only token |
   From then on the Deploy workflow builds `/admin` (`npm run build:cms`). Without them the site builds as before, without the admin.
5. **Editors** — Tina Cloud → project → **Collaborators** → invite the shop owner by e-mail (no GitHub account needed). Free plan: 2 users.
6. **Where saves go: `dev`** (P-031, publish with each release).
   - Tina Cloud project → *Configuration* → branch **`dev`** (the config also pins `dev`: `tina/config.ts`, `TINA_BRANCH` in the Deploy workflow).
   - GitHub → Settings → Rules → `protect-dev` → **Bypass list** → add the **Tina Cloud** GitHub app only, so its commits can land on `dev` (people still need PRs).
   - Each save on `dev` runs CI and redeploys the dev preview. Production changes only through the release PR `dev` → `main`, which still needs @ciprik13's approval on the `production` environment.

## Local development

```bash
npm run dev:cms
```
Opens the site with the CMS at http://localhost:3000/admin/index.html in **local mode**: saves write the JSON files on disk (no Tina Cloud, no commits). Use it to try schema changes; commit the result like any code change.

## Changing the schema

`tina/config.ts` defines the editor. The site copy fields are generated from `content/copy/ro.json` (`tina/copy-fields.ts`), so a new text key added to **both** `ro.json` and `ru.json` appears in the CMS automatically. Products, categories and shop settings are defined explicitly; when you add a field there, also add it to the Zod schema in `src/content/` and a test.

Run `npx tinacms build --local --skip-cloud-checks` to check the admin builds; commit `tina/tina-lock.json` when it changes (Tina Cloud reads it).

## Security notes

- `/admin` has its own Content-Security-Policy (`public/_headers`), is `noindex` and never cached. The public pages keep the strict per-page hash CSP.
- TinaCMS packages are **devDependencies**: they run only at build time and in the admin, never in the public site's runtime. `npm audit --omit=dev` stays clean. The full audit reports a `zod@3` advisory inside `@tinacms/*` (memory use when validating oversized input, GHSA-mrhx-c7xc-m3w5); it affects build-time schema validation of our own config only. Re-check when TinaCMS updates.
- Tina's read-only token can only read content; writes go through the Tina Cloud GitHub app.

---

## Ghid pentru cofetărie (RO)

**Intră:** https://chirasweets.md/admin/ → *Log in* cu adresa de e-mail invitată.

**Schimbă un preț**
1. *Catalog — produse, prețuri, poze* → *Produse* → alege produsul.
2. *Preț* → *Tip preț*: „Preț fix”, „De la” sau „La cerere” → *Sumă (lei)* → *Unitate*.
3. Apasă **Save**. Modificarea apare în câteva minute pe **https://dev.chira-sweets-4fw.pages.dev** (site-ul de test) și ajunge pe **chirasweets.md** la următoarea publicare făcută de dezvoltator.

**Adaugă poze**
1. Deschide produsul → *Fotografii* → **+** → trage poza sau apasă pentru a o alege.
2. Prima poză apare în catalog. Folosește JPG sau PNG (pe iPhone: *Setări → Cameră → Formate → Cel mai compatibil*, sau exportă ca JPG).
3. **Save**. Datele de localizare din poză sunt șterse automat.

**Produs nou:** *Produse* → **+** → completează denumirea RO și RU, categoria, prețul, pozele → debifează **Ciornă** când e gata de publicat → **Save**.

**Alergeni:** bifează alergenii din *Conține* și apoi **Alergeni confirmați de cofetărie**. Fără această bifă, site-ul afișează „Întreabă-ne despre alergeni”.

**Program, telefon, adresă:** *Date cofetărie*.

**Textul fondatorului (Despre noi + citatul):** după ce Chiriac David l-a citit și aprobat pe site-ul de test, bifează în *Date cofetărie* „Textul lui Chiriac David … a fost aprobat de el”.

**Orice text de pe site:** *Texte site (RO / RU)* → fișierul `ro` sau `ru`.

Dacă după salvare site-ul de test nu s-a schimbat în 10 minute, probabil un câmp e completat greșit (de ex. preț fix fără sumă). Scrie dezvoltatorului — site-ul public nu este afectat.
