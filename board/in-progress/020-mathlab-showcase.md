# 020 — Interactive MathLab world showcase

Add three pre-generated worlds as a static, embedded window on Coding Reference, with a world selector, full-window link, accessible labels and no Python service dependency. User requested publishing on davgor.github.io. Source: the current icarusUnreal beast-nest worktree; record recipe/config and content hashes, not private local paths.

## Acceptance criteria

- [ ] Coding Reference embeds an interactive MathLab showcase and preserves existing project cards.
- [ ] Visitors can select three exported worlds, inspect layers and nests, and open a full-window view.
- [ ] Static viewer offers no broken server generation controls and works under Pages asset paths.
- [ ] Rebuild instructions and source provenance accompany the exports.
- [ ] TDD Playwright scenario, lint/format, full unit tests, type-check, deadcode, build and full e2e pass.
- [ ] Red-team review posted; no unresolved blockers; deployment verified.

Implementation notes: first Playwright run failed on the missing world selector before UI implementation. Fixed Vite directory fallback by embedding the explicit /mathlab/index.html path. Updated only vulnerable patch-level dependencies (including Vitest 4.1.11); npm audit now reports zero vulnerabilities. CI additionally requires updated unit coverage for changed production components. Added a component test for the fixed snapshot URL, lazy loading, sandbox permissions and safe full-window link; rerunning fireguard without changing its thresholds. Source-code provenance hashes are included in the export manifest; the Icarus source remains separately uncommitted.

Verification: 78 application/script unit tests and 46 fireguard tests passed; 121 Playwright tests passed, including first-fail/then-pass showcase interactions and narrow viewport. Lint, format check, types, deadcode, production build/assertion and npm audit passed (zero vulnerabilities). Source MathLab preservation/docs checks and 110 terrain + 19 tooling tests passed. Export hashes checked; no local user paths in HTML. Mobile screenshot reviewed. Remaining: post scoped red-team review on PR, then verify Actions deployment.
