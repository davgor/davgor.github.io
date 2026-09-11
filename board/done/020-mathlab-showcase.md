# 020 — Interactive MathLab world showcase

Add three pre-generated worlds as a static, embedded window on Coding Reference, with a world selector, full-window link, accessible labels and no Python service dependency. User requested publishing on davgor.github.io. Source: the current icarusUnreal beast-nest worktree; record recipe/config and content hashes, not private local paths.

## Acceptance criteria

- [x] Coding Reference embeds an interactive MathLab showcase and preserves existing project cards.
- [x] Visitors can select three exported worlds, inspect layers and nests, and open a full-window view.
- [x] Static viewer offers no broken server generation controls and works under Pages asset paths.
- [x] Rebuild instructions and source provenance accompany the exports.
- [x] TDD Playwright scenario, lint/format, full unit tests, type-check, deadcode, build and full e2e pass.
- [x] Red-team review posted; no unresolved blockers; deployment verified.

Implementation notes: first Playwright run failed on the missing world selector before UI implementation. Fixed Vite directory fallback by embedding the explicit /mathlab/index.html path. Updated only vulnerable patch-level dependencies (including Vitest 4.1.11); npm audit now reports zero vulnerabilities. CI additionally requires updated unit coverage for changed production components. Added a component test for the fixed snapshot URL, lazy loading, sandbox permissions and safe full-window link; rerunning fireguard without changing its thresholds. Source-code provenance hashes are included in the export manifest; the Icarus source remains separately uncommitted.

Verification: 78 application/script unit tests and 46 fireguard tests passed; 121 Playwright tests passed, including first-fail/then-pass showcase interactions and narrow viewport. Lint, format check, types, deadcode, production build/assertion and npm audit passed (zero vulnerabilities). Source MathLab preservation/docs checks and 110 terrain + 19 tooling tests passed. Export hashes checked; no local user paths in HTML. Mobile screenshot reviewed. Remaining: post scoped red-team review on PR, then verify Actions deployment.


## Published evidence

PR https://github.com/davgor/davgor.github.io/pull/8 merged as 6133d3a6b7a85104a1bc3e967690c6934d903978. All seven PR checks passed. Follow-up self-review posted with no unresolved Blocking/Should-fix findings. Final coverage: 79 application/script tests + 46 fireguard tests (125 total), 121 Playwright tests. Fireguard earned A with 100/100 isolated runs and zero failures; no applicable mutants were generated for this static JSX component. Windows local execution used FIREGUARD_TEST_COMMAND='node node_modules/vitest/vitest.mjs run' to avoid shell-free npx.cmd launch failure; thresholds unchanged.

Pages deployment https://github.com/davgor/davgor.github.io/actions/runs/34584035085 succeeded, including production HTML smoke check. Post-merge CI Checks succeeded. Live browser verification at https://davgor.github.io/coding-reference showed the embedded showcase; selecting Frostbound loaded seed 73 and its 120-anchor / 381-species diagnostics. Direct showcase: https://davgor.github.io/mathlab/.

This closeout changes only ticket status/evidence; product files are exactly the reviewed and verified deployed revision. Rebuild instructions are in README.md. Known limits: approximately 9 MB per selected snapshot, bounded-resolution diagnostics, no online generator or Unreal gameplay. No remaining implementation blocker.
