# 013 — Fix Security Audit CI on fireguard PR

Security Audit workflow fails `npm audit --audit-level=moderate` on branch `cursor/fireguard-test-grader-9959` (PR #5). Findings include brace-expansion, js-yaml, nanoid, postcss, react-router, undici.

## Acceptance criteria

- [x] `npm audit --audit-level=moderate` exits 0
- [x] Delivery gate still green (`lint`, `test:unit`, `type-check`, `build`)
- [x] Prefer non-force fixes; document any major bumps required

## Resolution

- `npm audit fix` cleared brace-expansion, js-yaml, nanoid, postcss, undici.
- Remaining react-router moderate findings required `react-router-dom@^7.18.2` (no patched 6.x).
- Removed obsolete v7 `future` flags from `App` / `renderWithRouter`.
- `npm audit --audit-level=moderate` exits 0.
