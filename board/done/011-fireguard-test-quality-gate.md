# EPIC: Fireguard — deterministic unit-test quality gate

Portable CLI (`fireguard`) that grades agent-authored Vitest unit tests with letter scores (A–F) using deterministic AST analysis, flakiness isolation, and mutation testing — no LLM evaluation. Scoped to git diff vs `main`: **new test files** for flake runs, **changed production modules** for mutation. Playwright is out of scope.

Copy the `fireguard/` directory into other repos; configure via `.fireguardrc.json`.

## Sub-tickets

| id | title |
|----|-------|
| 011.1 | Config, CLI, letter grades, report |
| 011.2 | Gate 1 — static AST guardrails |
| 011.3 | Gate 2 — flakiness (100× on new tests) |
| 011.4 | Gate 3 — mutation score on changed modules |
| 011.5 | Repo wiring (npm, CI, delivery skills) |

Follow-up (separate epic, after this ships): run fireguard against the existing unit suite and remediate findings — see `012-fireguard-baseline-existing-suite.md`.

## Acceptance criteria

- [x] `fireguard/` is a self-contained, copy-portable tool with README
- [x] Letter grade (A–F) and numeric score emitted for graded PRs/runs
- [x] Gates 1→3 fail-fast; Gate 1 actionable findings with file/line
- [x] New tests (git diff vs `main`) must pass 100 isolated runs at 0% flake
- [x] Mutation score ≥ 75% on changed production modules
- [x] No Playwright grading
- [x] npm script + CI step so PR agents see F grades
- [x] Unit tests cover fireguard behavior; full delivery gate passes

## Sub-tickets

### 011.1 — Fireguard config, CLI, letter grades, report

Scaffold the portable `fireguard` package: config loader (`.fireguardrc.json` + env overrides), CLI entrypoint, letter-grade scoring (A–F), and machine-readable + human terminal reports.

#### Acceptance criteria

- [x] `.fireguardrc.json` schema supported (`thresholds`, `include`, `exclude`)
- [x] CLI `fireguard` / `npm run fireguard` exits 0 on pass, 1 on quality fail, 2 on tool error
- [x] Report includes overall letter grade, numeric score, per-gate results
- [x] Hard gate failures force grade F (score 0)
- [x] Unit tests cover config defaults, overrides, and grade mapping

### 011.2 — Fireguard Gate 1: static AST guardrails

Parse Vitest unit test files with the TypeScript AST. Enforce mock-to-assertion ratio, tautology ratio, minimum assertions, and non-empty test bodies. Fail fast (<5s intent) with file/line findings.

#### Acceptance criteria

- [x] Counts mocks (`vi.mock` / `vi.fn` / `vi.spyOn` / mockReturn*) vs `expect` assertions
- [x] Rejects mock/assert ratio > `maxMockToAssertRatio` (default 1.5)
- [x] Rejects tautological assertion ratio > `maxTautologicalRatio` (default 0.1)
- [x] Rejects files with < `minAssertionsPerFile` or `it`/`test` blocks with zero assertions
- [x] Findings include file path and line number
- [x] Unit tests use fixture slop vs solid test sources

### 011.3 — Fireguard Gate 2: flakiness on new tests

Discover **new** unit test files via `git diff` against `main` (added paths matching include globs). Run each suite `agenticFlakinessRuns` times (default **100**) in isolated processes; require 0% flake.

#### Acceptance criteria

- [x] Scope = test files added vs `main` only (not modified-only, not Playwright)
- [x] Default 100 isolated runs; configurable via `.fireguardrc.json`
- [x] Any failed run fails the gate and forces grade F
- [x] Injected/mockable runner so unit tests do not need 100 real Vitest processes
- [x] Report lists run count, failures, and failing run index/error

### 011.4 — Fireguard Gate 3: mutation on changed modules

Introduce synthetic faults into **changed production modules** (git diff vs `main`, excluding tests) and re-run related unit tests. Enforce `minMutationScore` ≥ 75%.

#### Acceptance criteria

- [x] Mutates only changed non-test source modules from git diff vs `main`
- [x] Operators include at least: conditional inversion, operator swap, return/value tweak
- [x] Kill rate = killed / (killed + survived); fail below threshold
- [x] Survivors reported with file/line/description
- [x] Unit tests cover mutator + score calculation with fixtures

### 011.5 — Fireguard repo wiring (npm, CI, skills)

Wire fireguard into this portfolio repo so agents and CI surface letter grades. Update delivery skills to require fireguard on new/changed unit tests. Document copy-portability.

#### Acceptance criteria

- [x] `package.json` script(s) for `fireguard` / agentic grade
- [x] PR CI runs fireguard and fails on grade F / gate failure
- [x] `delivery-standards` and `complete-ticket` skills mention fireguard for unit-test work
- [x] `fireguard/README.md` explains copy into another repo
- [x] Follow-up epic 012 exists for baseline run on existing suite
