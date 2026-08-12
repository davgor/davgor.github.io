# 017 — Onebrief: The Agentic Test Lifecycle

Add a new Experience section under the Onebrief Engineering Manager role describing the Agentic Test Lifecycle (OTEL-driven test case manager, shadow/quarantine, agentic triage/repair, bug crusher, human escalation), plus related achievement bullets from the provided metrics.

## Acceptance criteria

- [ ] `src/data/jobs.ts` Onebrief EM role includes a titled paragraph `The Agentic Test Lifecycle` covering test case manager routing, shadow+alert, triage (flaky/defective/bugged), repair loop, bug crusher, and human on-call escalation
- [ ] Narrative includes user-provided outcomes: 0.5% flake rate, ~120 weekly triage hours saved, escape rate 20% → 2%
- [ ] Unit tests assert the new section title (and key phrases) are present; `npm run test:unit` passes
- [ ] Lint, format, type-check, deadcode, and build gates pass
