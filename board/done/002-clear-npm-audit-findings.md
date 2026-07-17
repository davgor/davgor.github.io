# 002 — Clear npm audit moderate+ findings

Security Audit CI (`.github/workflows/security-audit.yml`) fails PRs on `npm audit --audit-level=moderate`. Baseline today: ~24 vulnerabilities (including critical via vitest / coverage tooling, high via rollup/minimatch/etc.).

Follow-up from epic `001-engineering-delivery-standards` so the new gate can go green without blocking the standards rollout itself.

## Acceptance criteria

- [x] `npm audit --audit-level=moderate` exits 0 on a clean install
- [x] Dependency bumps stay within Vite/React/Vitest stack; `npm run test:unit`, `npm run lint`, and `npm run build` still pass
- [x] Document any unavoidable exceptions in `.tsprune-ignore`-style notes only if we add an allowlist script (prefer fixing over allowlisting)

## Resolution notes

- Ran `npm audit fix` (non-force) first — cleared most transitive issues (babel, ajv, brace-expansion, flatted, minimatch, rollup, undici, react-router, vitest critical, etc.).
- Targeted direct bumps (no overrides):
  - `vite` `^5.1.0` → `^6.4.3` (esbuild `^0.25`; addresses GHSA-67mh-4wv8-2f99 / related)
  - `vitest` / `@vitest/coverage-v8` → `^4.1.10` (>=4.1.0 critical fix)
  - `react-router-dom` → `^6.30.4`
  - `jimp` `^0.22.12` → `^1.6.1`; adapted `e2e/modules/screenshotTesting.ts` (named `Jimp` import; `.width`/`.height`)
  - `uuid` `^9.0.1` → `^11.1.1` (`v4 as uuidv4` import unchanged)
- No `package.json` overrides required.
