# 021 — Automatically refresh Fantasy World Generator showcase

Replace the legacy Icarus MathLab sample section with FantasyWorldGenerator and regenerate samples in the generator’s merge workflow before Pages deployment.

## Acceptance criteria

- [x] Coding Reference and showcase link to FantasyWorldGenerator.
- [x] Three generated samples support inspection and export without a Python service.
- [ ] Generator merges rebuild from a clean, recorded source commit; failed gates prevent publication.
- [x] Export integration test verifies reproducibility, recipes and hashes; browser tests cover world switching and no live controls.
- [ ] Full delivery gates and posted red-team review pass; live deployment verified.

## Verification and remaining integration

Portfolio PR #9 merged after all GitHub checks passed. Local verification: lint/format, 79 app/script
plus 46 fireguard unit tests, type checks, deadcode, build and all 121 Playwright tests passed.
Fireguard grade A with 100 repetitions and no failures; its mutation adapter generated no JSX mutation
candidates. Red-team review posted on PR #9 with no portfolio blockers. Mobile screenshot reviewed.

Source automation is in davgor/FantasyWorldGenerator#1, using the dedicated `PORTFOLIO_DEPLOY_KEY`
secret and no cron. Two Python 3.12 sample builds are byte-reproducible and their hashes verified.
The source PR remains blocked by four pre-existing tests importing the uncommitted terrain_history
module. The separate development working tree passed its validator but was preserved pending the
user's choice about including it. Land that work, reconcile provenance and rerun the source gates
before activating the merge publisher. The portfolio can serve its reviewed committed samples meanwhile.

Initial Pages deployment verification remains the next site-side check. Keep this ticket in progress
until the merge-triggered source-to-portfolio publication has also been observed end to end.

Deployment follow-up: the added browser install exposed that Ubuntu 24.04 lacks the `libasound2`
package expected by the locked Playwright release. Pin the Pages build to Ubuntu 22.04, matching the
passing dedicated browser CI, then verify deployment again. No dependency or gate changes.
