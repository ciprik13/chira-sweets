# Chira Sweets

Web platform for **Chira Sweets**, a pastry shop in Chișinău, Republic of Moldova — [chirasweets.md](https://chirasweets.md).

Status: **Phase 0 – Discovery**. No application code yet.

## Planned stack
Next.js (App Router) · TypeScript (strict) · Tailwind CSS · shadcn/ui — see [`docs/decisions-log.md`](docs/decisions-log.md).

## Git workflow
- Branches: `feat/*`, `fix/*`, `chore/*`, `docs/*` (named `<type>/<issue>-<slug>`) → PR into `dev` (squash).
- Release: PR `dev` → `main` (merge commit), then semver tag `vX.Y.Z` on `main`.
- Production deploys only from `main`. Every PR needs one approval from the other maintainer.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/). Details in [CONTRIBUTING.md](CONTRIBUTING.md).

## Repository layout
- `design/brand/` — approved logo files (round + horizontal variants) and existing marketing material.
- `docs/` — product, design and decision documents.
