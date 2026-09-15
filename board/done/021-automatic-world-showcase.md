# 021 — Automatically refresh Fantasy World Generator showcase

Replace the legacy Icarus MathLab sample section with FantasyWorldGenerator and regenerate samples in the generator’s merge workflow before Pages deployment.

## Acceptance criteria

- [x] Coding Reference and showcase link to FantasyWorldGenerator.
- [x] Three generated samples support inspection and export without a Python service.
- [x] Generator merges rebuild from a clean, recorded source commit; failed gates prevent publication.
- [x] Export integration test verifies reproducibility, recipes and hashes; browser tests cover world switching and no live controls.
- [x] Full delivery gates and posted red-team review pass; live deployment verified.

## Verification

Portfolio PR #9 and runner-fix PR #10 merged after their checks and red-team reviews passed.
Local delivery gates passed: lint/format, 79 app/script plus 46 fireguard unit tests, type checks,
deadcode, build and all 121 Playwright tests. Fireguard scored A across 100 repetitions with no
failures; its adapter generated no JSX mutation candidates.

Source PR #1 merged as `26227ef04e00fa297ef1286e935aa50996492cde` after integrating the terrain-history
implementation already landed on main. All four missing-module failures are resolved without
removing tests. The full validator passed 123 simulation and 7 publishing/catalogue tests, provenance
checks, server smoke testing and deterministic asset-list generation. Repeated showcase builds
matched byte-for-byte; recipe 2 is explicitly tested. Main preserves provenance file bytes across
Windows and macOS checkouts.

The first automatic merge-triggered publication completed end to end:

- [Source workflow 35012012418](https://github.com/davgor/FantasyWorldGenerator/actions/runs/35012012418) passed.
- Portfolio bot commit `24a2d3830599f96d7ace56ccbea82646a6d6ca1b` changed only five files in `public/mathlab/`.
- [Pages deployment 35012888303](https://github.com/davgor/davgor.github.io/actions/runs/35012888303) passed browser checks and deployed.
- Live browser verification confirmed the exact source revision above, recipe 2, seeds 42/73/108,
  source links, downloaded seed-108 JSON, hidden live controls, zero browser errors and zero generator
  API calls. Large snapshots require more than five seconds to load over the network.

Publishing uses the dedicated `PORTFOLIO_DEPLOY_KEY` on source main pushes/merges, with no cron.
The posted red-team review found no remaining blockers after testing source provenance, CI behavior,
credential scope and static browser behavior. Pages supports saved-world inspection and export;
Python generation and age advancement remain local/CI capabilities. This is not Unreal validation.
