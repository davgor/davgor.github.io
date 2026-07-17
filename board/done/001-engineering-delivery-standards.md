# EPIC: Engineering delivery standards (agent skills)

Codify standing engineering process so every agent-led implementation in this repo follows the same bar: **TDD-first**, **lint + unit tests + build verified before done**, and **board traceability** (create or update a ticket/epic).

Mirrored from [ElectronServerManager](https://github.com/davgor/ElectronServerManager) and [electronGameTest](https://github.com/davgor/electronGameTest). Relates to `.ai-instructions.md` and the `complete-ticket` skill (ticket-scoped work). This epic adds a **default delivery skill** for ad-hoc requests, bug fixes, and follow-ups that are not explicitly framed as "complete ticket NNN.M".

## Acceptance criteria

- [x] `delivery-standards` skill exists under `.cursor/skills/delivery-standards/SKILL.md` and `.claude/skills/delivery-standards/SKILL.md`
- [x] `complete-ticket` skill exists under `.cursor/skills/complete-ticket/SKILL.md` and `.claude/skills/complete-ticket/SKILL.md`
- [x] `collapse-epic` skill exists under `.cursor/skills/collapse-epic/SKILL.md` and `.claude/skills/collapse-epic/SKILL.md`
- [x] Skills state TDD-first, unit tests + lint + format:check + type-check + deadcode + build gate, and board ticket/epic update requirements
- [x] Skills reference ESLint, Vitest, Playwright, and this repo's Vite/React portfolio stack
- [x] `.cursor/rules/delivery-standards.mdc` exists with `alwaysApply: true` pointing at the skill
- [x] `/board` directory structure exists (`backlog/`, `in-progress/`, `done/`)
- [x] This epic file documents the policy on `/board`
- [x] PR CI covers unit tests, lint, type-check/build; deadcode and security-audit workflows exist
