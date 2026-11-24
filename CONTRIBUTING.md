# Contributing

## Workflow
1. Every change starts from an issue (user story, bug or task).
2. Branch off `dev`: `<type>/<issue-number>-<short-slug>`, e.g. `feat/12-allergen-filter`, `fix/31-cart-total`, `chore/4-ci-pipeline`.
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary` in imperative mood, max 72 chars.
   Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`. Breaking changes: `feat!:` plus a `BREAKING CHANGE:` footer.
4. Open a PR into `dev` using the PR template. The PR title is a Conventional Commit — it becomes the squash commit.
5. One approving review from the other maintainer is required; all review threads must be resolved; CI must be green.
6. Merge with **squash**. The branch is deleted automatically.

## Releases
1. Open a PR `dev` → `main` titled `release: vX.Y.Z` with the changelog in the description.
2. Merge with a **merge commit** (keeps `dev` and `main` histories compatible).
3. Tag the merge commit on `main`: `git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z`.
4. Versioning follows [SemVer](https://semver.org/). Before v1.0.0 (public launch), minor bumps may contain breaking changes.

## Rules
- No direct pushes to `dev` or `main` (enforced by repository rulesets).
- No secrets in code, commits, logs or screenshots. Use `.env.local`; document new variables in `.env.example`.
- Code, commits and technical docs are written in English; user-facing content in Romanian and Russian.
- Keep PRs small and focused — one issue per PR.
