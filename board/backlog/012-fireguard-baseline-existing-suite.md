# EPIC: Fireguard baseline — grade & remediate existing unit tests

After epic 011 (fireguard implementation) is complete, run fireguard against the repository's **existing** Vitest unit suite (not only new git-diff tests), record grades/findings, and remediate or explicitly waive issues so the baseline is clean for future agent PRs.

Do not start until 011 is done.

## Acceptance criteria

- [ ] Fireguard executed against current `src/**/*.{test,spec}.{ts,tsx}` with a documented report
- [ ] Gate 1 (AST) findings triaged: fixed or listed under an explicit exclude/waiver with rationale
- [ ] Flakiness strategy for baseline documented (full-suite 100× may be CI-budgeted; define approach)
- [ ] Mutation baseline for critical modules documented or improved to ≥ 75% where in scope
- [ ] No silent threshold weakening — changes go through `.fireguardrc.json` with comment in this epic
