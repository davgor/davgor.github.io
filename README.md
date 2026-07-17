## Portfolio

This repo hosts the portfolio at [davgor.github.io](https://davgor.github.io): experience, company detail, and related pages.

Vite + React + TypeScript. Engineering process (agent skills, ticket board, and CI) mirrored from [ElectronServerManager](https://github.com/davgor/ElectronServerManager) and [electronGameTest](https://github.com/davgor/electronGameTest).

## Engineering process

- **TDD-first.** Tests are written before the implementation that satisfies them for components, pages, data helpers, and anything else with testable behavior. See `.cursor/skills/delivery-standards/SKILL.md`.
- **Strict lint.** ESLint with `--max-warnings 0`. Rules are never relaxed to make code pass — fix the code. After edits: `lint:fix` then `format` per [`.ai-instructions.md`](.ai-instructions.md).
- **TypeScript strict mode.** No `any` escapes used to dodge a type problem.
- **Ticket board.** Work is tracked as markdown tickets under `/board` (`backlog/` → `in-progress/` → `done/`). Epics are `NNN-*.md`, sub-tickets `NNN.M-*.md`, each with checkable acceptance criteria. The `complete-ticket` and `collapse-epic` skills in `.cursor/skills/` (mirrored in `.claude/skills/`) drive the workflow.
- **Experience entries.** To add or update jobs/roles on the Experience page, use the `add-experience-entry` skill (`.cursor/skills/add-experience-entry/SKILL.md`).
- **No secrets committed.** `.env` stays gitignored.

AI/agent delivery rules: [`.ai-instructions.md`](.ai-instructions.md) and
[`.claude/skills/delivery-standards/SKILL.md`](.claude/skills/delivery-standards/SKILL.md).

## Board workflow

Work is tracked as markdown tickets under [`board/`](board/):

- `board/backlog/` — not started
- `board/in-progress/` — active
- `board/done/` — completed (epics may collapse sub-tickets)

Each ticket has a description and checkable acceptance criteria. Implementation follows TDD, then lint, format, unit tests, type-check, deadcode, and build before criteria are checked off. Run Playwright e2e when UI/routes change. See the [complete-ticket](.claude/skills/complete-ticket/SKILL.md) skill for the full flow.

## Commands

```bash
npm install          # set up
npm run dev          # Vite dev server
npm run test:unit    # Vitest
npm run test:e2e     # Playwright
npm run lint         # ESLint (max-warnings 0)
npm run format       # Prettier write
npm run format:check # Prettier check
npm run type-check   # tsc --noEmit
npm run build        # tsc + vite build
npm run deadcode     # ts-prune unused export scan
```

## CI

`.github/workflows/pr-checks.yml` ("CI Checks") runs on every PR targeting `main` and on every push to `main`:

- `test` — `npm run test:unit`
- `lint` — `npm run lint` + `npm run format:check`
- `build` — `npm run type-check` && `npm run build`

Also mirrored:

- `.github/workflows/deadcode.yml` — `ts-prune`; fails on new findings not listed in `.tsprune-ignore`
- `.github/workflows/security-audit.yml` — `npm audit`, fails PRs on moderate+ vulnerabilities
- `.github/workflows/playwright.yml` — Playwright e2e
- `.github/workflows/deploy.yml` — GitHub Pages deploy on push to `main`

Commits with `[skip ci]` in the message skip the push-triggered CI Checks jobs.

## GitHub Pages deploy

This site must be published from the **Vite `dist/` build via GitHub Actions**, not from the repo root on `main`.

The repo-root `index.html` is the Vite *dev* entry (`/src/main.tsx`). If Pages is set to “Deploy from a branch” → `main` / root, browsers get that file, cannot execute `.tsx`, and show a **white page**. Redeploying only helps when the Actions artifact is what actually gets served.

**Required setting:** repo **Settings → Pages → Build and deployment → Source = GitHub Actions** (not “Deploy from a branch”).

After each deploy, the workflow:

1. Asserts `dist/index.html` references hashed `/assets/*` bundles (not `/src/main.tsx`)
2. Smoke-checks the live URL for the same production HTML shape

Local check after `npm run build`:

```bash
npm run assert:dist
```
