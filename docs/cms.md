# CMS — editing the site with TinaCMS

Everything visitors see is editable at **https://chirasweets.md/admin/**:

| In the CMS | File in the repo | What it holds |
|---|---|---|
| **Catalog — produse, prețuri, poze** | `content/catalog/catalog.json` | Products (name, category, price, photos, size, description, allergens, bestseller, draft) and categories |
| **Date cofetărie** | `content/settings/shop.json` | Phone, Telegram, Viber, WhatsApp, Instagram, TikTok, e-mail, address, opening hours, legal entity, founder-text approval (D-028) |
| **Texte site (RO / RU)** | `content/copy/ro.json`, `content/copy/ru.json` | Every text on every page, in both languages |
| Photos | `public/uploads/` | Uploaded through the CMS |

How it works (P-031): a save in the CMS is a Git commit by Tina Cloud to the **`content`** branch. That branch has its own preview, **https://content.chira-sweets-4fw.pages.dev/ro/**, updated within minutes, so the owner sees the change at once. The workflow `content-pr.yml` checks that only `content/` and `public/uploads/` changed and opens or updates the PR **`content` → `dev`**. CI validates all content (Zod schemas in `src/content/*.ts`, RO/RU parity tests) and one maintainer approves and squash-merges it. The edits reach **chirasweets.md with the next release** (`dev` → `main`). After every push to `dev`, `sync-content.yml` merges `dev` back into `content`. An invalid edit (a fixed price without an amount, a HEIC photo, a missing Russian name…) fails CI on the content PR and never reaches `dev`.

Photos: the build strips EXIF/GPS from every uploaded photo, limits originals to 2400 px and creates WEBP versions at 480 / 960 / 1600 px (`scripts/postbuild.mjs`, `src/lib/images.ts`). Phones download the small version.

---

## One-time setup (admin, ~20 min)

0. **Owner of the Tina Cloud project:** a **business account agreed with Chiriac David** (e.g. a shared `chirasweets` Google/GitHub identity, or the company's), **not** a personal account. Record it here:
   - Tina Cloud account owner: _to be decided with David_ (fill in when created)
   - Who can add collaborators: _…_
1. **Tina Cloud account:** https://app.tina.io, sign in with that business account and enable 2FA.
2. **Create a project:** *Import from GitHub* → `ciprik13/chira-sweets` (a repo admin approves Tina's GitHub app).
   - Site URL: `https://chirasweets.md`
   - Path to the Tina config: `tina` (default)
   - **Branch: `content`** (also pinned in `tina/config.ts` and `TINA_BRANCH` in the Deploy workflow).
3. Project → **Overview**: copy the **Client ID**. Project → **Tokens**: create a **read-only content token**.
4. **GitHub** → repo Settings → Secrets and variables → Actions:
   | Kind | Name | Value |
   |---|---|---|
   | Variable | `TINA_CLIENT_ID` | Client ID |
   | Secret | `TINA_TOKEN` | read-only token |
   | Secret | `CONTENT_PR_TOKEN` | token that opens the content PR (below) |
   With `TINA_CLIENT_ID` and `TINA_TOKEN` set, the Deploy workflow builds `/admin` (`npm run build:cms`). Without them the site builds as before, with no admin.
5. **Editors:** Tina Cloud → project → **Collaborators** → invite the shop owner by e-mail (no GitHub account needed). Free plan: 2 users.
6. **The `content` branch** (P-031):
   - It's created automatically from `dev` by `sync-content.yml` on the next push to `dev`, or run that workflow by hand (*Actions → Sync content branch → Run workflow*).
   - **Not protected**, and **not** on any ruleset bypass list. The Tina app writes only there. `content-pr.yml` rejects the branch if anything outside `content/` or `public/uploads/` changes.
   - `CONTENT_PR_TOKEN`: a fine-grained personal access token **from a machine/bot account** (or a GitHub App token) with only *Pull requests: read and write* on this repo. A PR opened with the default `GITHUB_TOKEN` does not start CI, and the required checks would never run. The token's owner can't approve the PRs it opens, so use a bot account, not @ciprik13 or @mihaelaaa-23. Without the secret, the workflow still opens the PR with `GITHUB_TOKEN`; then **close and reopen the PR** to start the checks.
   - Review: one maintainer approves and **squash-merges** the PR `content` → `dev`. Content reaches production with the next release.

### Conflicts

`sync-content.yml` fails if the same content was changed both on `dev` (by a code PR) and in the CMS. Fix it locally: `git switch content && git merge origin/dev`, resolve the conflict in the JSON, push. Avoid editing `content/` in code PRs while the owner is editing.

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
- TinaCMS packages are **devDependencies**: they run only at build time and in the admin, never in the public site or the Pages Function. `npm audit --omit=dev` stays clean.
- **Known advisory, tracked in #8:** `@tinacms/*` depend on `zod@3.25.76`, affected by [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) (memory exhaustion when validating oversized constrained collections; fixed in zod 4.6.6). It's **build-time only**: Tina's zod validates our own schema (`tina/config.ts`) during `tinacms build` and in the admin UI. It never runs in the public site or `/api/request`, and never sees visitor input; the site uses `zod@4.6.7`. The full `npm audit` reports it until TinaCMS upgrades (#8).
- Tina's read-only token can only read content. Writes go through the Tina Cloud GitHub app, and only to the unprotected `content` branch, never directly to `dev` or `main` (P-031).

---

## Ghid pentru cofetărie (RO)

**Intră:** https://chirasweets.md/admin/ → *Log in* cu adresa de e-mail invitată.

**Schimbă un preț**
1. *Catalog — produse, prețuri, poze* → *Produse* → alege produsul.
2. *Preț* → *Tip preț*: „Preț fix”, „De la” sau „La cerere” → *Sumă (lei)* → *Unitate*.
3. Apasă **Save**. Modificarea apare în câteva minute pe site-ul de test **https://content.chira-sweets-4fw.pages.dev/ro/**. Dezvoltatorii o verifică și o publică pe **chirasweets.md** la următoarea actualizare a site-ului.

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
