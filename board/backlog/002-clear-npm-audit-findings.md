# 002 — Clear npm audit moderate+ findings

Security Audit CI (`.github/workflows/security-audit.yml`) fails PRs on `npm audit --audit-level=moderate`. Baseline today: ~24 vulnerabilities (including critical via vitest / coverage tooling, high via rollup/minimatch/etc.).

Follow-up from epic `001-engineering-delivery-standards` so the new gate can go green without blocking the standards rollout itself.

## Acceptance criteria

- [ ] `npm audit --audit-level=moderate` exits 0 on a clean install
- [ ] Dependency bumps stay within Vite/React/Vitest stack; `npm run test:unit`, `npm run lint`, and `npm run build` still pass
- [ ] Document any unavoidable exceptions in `.tsprune-ignore`-style notes only if we add an allowlist script (prefer fixing over allowlisting)
