# fireguard

Deterministic unit-test quality grader for agent-authored Vitest tests.

Fireguard assigns a letter grade (**A–F**) using three fail-fast gates — no LLM evaluation:

1. **AST** — mock/assert ratio, tautological assertions, empty tests  
2. **Flake** — added/modified tests (git diff vs `main`) must pass **100** isolated runs at **0%** flake (fail-fast; reports `executed/configuredRuns`)  
3. **Mutation** — changed production modules must kill ≥ **75%** of mutants  

Playwright / e2e is out of scope.

## Copy into another repo

1. Copy the entire `fireguard/` directory.
2. Copy `.fireguardrc.json` (or create one from the defaults below).
3. Ensure peer tooling exists: `typescript`, `vitest`, `tsx`, `minimatch`.
4. If the host `package.json` is **not** `"type": "module"` (common for Electron), keep `fireguard/package.json` with `"type": "module"` and run via `node fireguard/bin/fireguard.mjs`.
5. Add scripts:

```json
{
  "scripts": {
    "fireguard": "node fireguard/bin/fireguard.mjs",
    "test:fireguard": "vitest run --config fireguard/vitest.config.ts"
  }
}
```

6. Call `npm run fireguard` in CI on pull requests. Exit `1` means grade **F**.

## CLI

```bash
npm run fireguard
npm run fireguard -- --json
npm run fireguard -- --comment-pr
npm run fireguard -- --help
```

| Exit | Meaning |
|------|---------|
| 0 | Pass (grade A–D) |
| 1 | Quality failure (grade **F**) |
| 2 | Tool error |

### PR grade comments

On GitHub Actions pull requests, pass `--comment-pr` (requires `pull-requests: write` and `GITHUB_TOKEN`). Fireguard upserts a sticky comment marked `<!-- fireguard-report -->` with the letter grade so agents see **F** on the PR without opening job logs.

Also writes `GITHUB_STEP_SUMMARY` when that env var is set.

## Config (`.fireguardrc.json`)

```json
{
  "thresholds": {
    "maxMockToAssertRatio": 1.5,
    "maxTautologicalRatio": 0.1,
    "minAssertionsPerFile": 1,
    "minMutationScore": 75,
    "flakinessRuns": 3,
    "agenticFlakinessRuns": 100,
    "maxFlakeRate": 0
  },
  "include": ["src/**/*.{test,spec}.{ts,tsx}"],
  "exclude": ["**/__mocks__/**", "e2e/**"],
  "baseRef": "main",
  "testCommand": "npx vitest run"
}
```

Env overrides: `FIREGUARD_MIN_MUTATION_SCORE`, `FIREGUARD_MAX_MOCK_RATIO`, `FIREGUARD_AGENTIC_FLAKINESS_RUNS`, `FIREGUARD_BASE_REF`, `FIREGUARD_TEST_COMMAND`.

## Scope rules

- **Graded tests** — paths with git status `A`/`M`/`R`/`C` matching `include` vs `baseRef`
- **Changed modules** — added/modified production `src|lib|app` files (not tests)
- Production modules changed with **no** graded test updates → grade **F** (fail closed)
- No graded tests and no module changes → skip with grade A
- Mutation runs when there are graded tests and changed modules
- Mutation writes in-place with `try/finally` restore plus a process `exit` hook to avoid dirty trees

## Grades

Hard gate failure → **F** (score 0). Meeting thresholds starts at **C** (~70); lower mock density and higher mutation kill rates raise the score toward **A**.
