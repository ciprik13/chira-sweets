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
| D-008 | 2026-11-24 | Git flow: `feature/*`, `fix/*`, `chore/*`, `docs/*` → squash PR into `dev`; release PR `dev` → `main` (merge commit); semver tags on `main`. Conventional Commits. Prod deploys only from `main`. | Merge commit on release keeps `dev` and `main` histories compatible. |

## Open items
- Enable 2FA on nic.md registrar account (if supported), GitHub account, hosting.
- Instagram: banners reference @chira_sweets; @chira_david_ is the current content source. Confirm which one the site links to.
