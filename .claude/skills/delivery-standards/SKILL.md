---
name: delivery-standards
description: >-
  Enforces TDD-first implementation, lint/unit-test/build verification, and
  /board ticket or epic updates for all code work in this portfolio site. Use for
  every feature, bug fix, refactor, or follow-up unless the user explicitly
  asks for a read-only answer with no code changes.
---

# Delivery standards (all implementation work)

Mirrors `.cursor/skills/delivery-standards/SKILL.md` — keep both in sync when changing workflow rules.

## Standing rules

Any work you do going forward needs to have the lint, unit test, and build confirming, everything needs to be written TDD style, and you either need to create a ticket, or update an epic if it relates.

Read `README.md` and `.ai-instructions.md` for process boundaries. For board tickets already in scope, also follow [complete-ticket](../complete-ticket/SKILL.md).

## 1. Board tracking (before or as you start)

Every implementation task must be traceable on `/board`:

| Situation | Action |
|-----------|--------|
| User named a ticket/epic id | Use [complete-ticket](../complete-ticket/SKILL.md): move to `in-progress`, check off criteria when verified |
| Work extends an existing epic | Add or update a sub-ticket under that epic (`NNN.M`), update the epic index file, move to `in-progress` when starting |
| Standalone bug/feature/refactor | Create a new epic or sub-ticket in `/board/backlog/` with Description + checkable Acceptance Criteria |
| Exploratory spike with no code | Ticket optional; say so in the report |

**Ticket format** (match existing files):

```markdown
# EPIC: Short title   (or # 048.1 — Sub-ticket title)

Description paragraph: what, why, dependencies.

## Acceptance criteria

- [ ] Observable behavior with verification method
- [ ] Tests / runbook step named explicitly where relevant
```

Do not check off criteria or move tickets to `done/` until section 3 passes.

## 2. TDD-first implementation

For components, pages, data helpers, and any logic with testable behavior:

1. **Red** — write failing test(s) for the acceptance criterion or bug repro
2. **Green** — minimum code to pass
3. **Refactor** — only within scope; no drive-by changes

UI-only criteria: test-first when the criterion says "tested" or when extracting pure logic is natural; otherwise implement to the criterion and cover with component/logic tests when cheap. Prefer Vitest + Testing Library for unit/component coverage; Playwright for navigation and critical user flows.

Standing code rules (never waive):

- TypeScript strict; no `any` to dodge types
- ESLint strict (`npm run lint`, `--max-warnings 0`) — **fix code, never relax rules**
- After edits: `npm run lint:fix` then `npm run format` per `.ai-instructions.md`
- Minimize diff scope; match surrounding conventions
- No secrets committed; `.env` stays gitignored

## 3. Verification gate (required before done)

Run and fix until clean. **Do not report completion with failing checks.**

```bash
npm run lint:fix
npm run format
npm run lint
npm run format:check
npm run test:unit
npm run type-check
npm run deadcode
npm run build
npm run test:e2e   # when UI/navigation/routes change
```

**Targeted tests during iteration** are fine (`npx vitest run path/to/foo.test.tsx`), but **finish with full `npm run test:unit`** unless the user scoped a subset.

## 4. Close out

- Check off verified acceptance criteria (`- [x]`)
- `git mv` ticket to `/board/done/` when all criteria met
- Summarize: what changed, test/lint/build output, ticket ids touched
- Do **not** commit unless the user explicitly asks

## Quick checklist

Copy and track:

```
Delivery:
- [ ] Ticket/epic created or updated on /board
- [ ] Failing test(s) written first (where applicable)
- [ ] Implementation complete
- [ ] npm run lint — pass
- [ ] npm run format:check — pass
- [ ] npm run test:unit — pass
- [ ] npm run type-check — pass
- [ ] npm run deadcode — pass
- [ ] npm run build — pass
- [ ] npm run test:e2e — pass (when UI/routes change)
- [ ] Acceptance criteria checked off only when verified
```
