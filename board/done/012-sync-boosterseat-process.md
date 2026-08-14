# 012 — Sync BoosterSeat process tooling into portfolio

Bring over the engineering-process bits from [BoosterSeat](https://github.com/davgor/BoosterSeat) that this portfolio is missing: fireguard, red-team review skills/rules, PR template, auto-revert CI, deadcode scripts, and aligned delivery gates. Do not copy the CRUD scaffold, `templates/`, or stack playbooks (template-product only).

## Acceptance criteria

- [x] `fireguard/` + `.fireguardrc.json` present; `npm run fireguard` and `npm run test:fireguard` work
- [x] Red-team skills/rules (Cursor + Claude) and antagonistic-pr-review aliases present
- [x] `.ai-instructions.md`, delivery-standards, and complete-ticket updated for fireguard + red-team
- [x] `.github/PULL_REQUEST_TEMPLATE.md` and `auto-revert.yml` present; `pr-checks.yml` runs fireguard
- [x] Deadcode via `scripts/deadcode-check.mjs` (+ refresh/bump scripts); workflow uses `npm run deadcode`
- [x] Husky pre-commit + gitignore report artifacts aligned with BoosterSeat
- [x] Unit tests cover deadcode helpers; full verification gate passes (`lint`, `format:check`, `test:unit`, `type-check`, `deadcode`, `build`)

## Resolution notes

Synced process tooling from BoosterSeat (not the CRUD scaffold or `templates/`). Verification: lint/format, 77 app+script unit tests + 46 fireguard unit tests, fireguard grade A, type-check, deadcode, build all green. Red-team (local, no PR yet): see completion report.
