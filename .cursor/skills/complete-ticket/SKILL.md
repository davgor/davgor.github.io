---
name: complete-ticket
description: Implement one ticket, a range of tickets, or a whole epic from this repo's /board ticket board, identified by an id like "001.1", "1.1", "004.7", "13.9", a bare epic id like "004", or a range like "4.1 through 4.12". Use whenever the user says to complete/do/work on/implement/finish a ticket or epic by number (including just the bare number, e.g. "do 1.1", "complete 004.7", "complete epic 4", "finish 4.1 through 4.12"), or asks what's left on a ticket/epic. Moves ticket(s) through backlog -> in-progress -> done, implements each TDD-first per this repo's engineering standards (parallelizing across subagents for whole-epic runs where safe), runs lint/tests/build, and checks off acceptance criteria only once actually verified.
---

# Complete a board ticket

This repo tracks work as text-file tickets under `/board` (`backlog/`, `in-progress/`, `done/`). Each ticket is a small, atomic unit of work with checkable acceptance criteria. This skill implements one ticket end-to-end the way this project requires — it does not cut corners on tests, lint, or scope.

Mirrors `.claude/skills/complete-ticket/SKILL.md` — keep both in sync when changing workflow rules.

## 1. Resolve the ticket id and find the file

- Normalize the id the user gave you: `1.1` -> `001.1`, `4.7` -> `004.7`, a bare epic number like `3` -> `003`. Zero-pad to 3 digits before the dot.
- Search `/board/backlog/`, `/board/in-progress/`, and `/board/done/` for a file starting with `<id>-` (sub-ticket) or matching `<id>-*.md` (epic).
- If the user named a bare epic id ("complete epic 4", "do 004"), an explicit range of its sub-tickets ("4.1 through 4.12", "4.1-4.24"), or otherwise clearly means the whole epic rather than one sub-ticket, this is **epic mode** — skip to **section 8** instead of treating it as a single ticket. Epic mode still applies every rule in sections 2-7 to each sub-ticket; it only changes how the work is scheduled (in parallel across subagents where safe) and when the expensive whole-repo checks run (once, at the end, not per sub-ticket).
- If the ticket is already in `/board/done/`, tell the user it's already done and stop — don't redo it without being asked.
- If it's in `/board/backlog/`, move it to `/board/in-progress/` with `git mv` before starting work.
- If you can't find a matching file, say so and ask for clarification rather than guessing.

## 2. Read context before writing any code

- Read the ticket file itself (Description + Acceptance Criteria).
- Read `README.md` and `.ai-instructions.md` at the repo root — they cover the engineering process and the mandatory lint/format workflow.
- If the ticket references another ticket (e.g. "see ticket 004.22"), read that ticket too — sub-tickets often depend on types/functions another sub-ticket defines.
- Check whether prerequisite tickets this one depends on are actually done. If a hard dependency is missing, say so and ask whether to do the dependency first instead of improvising a stand-in.

## 3. Implement TDD-first

This repo's standing rule: tests are written before the implementation that satisfies them, for components, pages, data helpers, and any other code with testable behavior. For each acceptance criterion that names a behavior:

1. Write the failing test(s) for it first.
2. Implement the minimum code to make it pass.
3. Refactor only within the ticket's scope — don't drift into adjacent tickets' work.

UI-only criteria (visual layout, manual interaction flows) don't need a test-first cycle unless the criterion itself says "tested" — but still implement them carefully against the criterion's exact wording. Prefer Vitest + Testing Library for unit/component coverage; Playwright for navigation and critical user flows.

Respect the standing engineering rules while you work:
- TypeScript strict mode, no `any` escapes used to dodge a type problem.
- ESLint rules apply (`npm run lint`, `--max-warnings 0`). **Never relax, override, or disable a lint rule to make your code pass — fix the code.** If a rule seems genuinely wrong for a specific case, stop and ask the user before touching the ESLint config.
- After code edits, run `npm run lint:fix` then `npm run format` per `.ai-instructions.md`.
- No secrets committed, `.env` stays gitignored.

## 4. Verify before checking anything off

Run the project's checks and only proceed once they're clean:

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

If something fails, fix it — don't check off a criterion that doesn't actually pass, and don't mark the ticket done with failing checks.

**Targeted tests during iteration** are fine (`npx vitest run src/components/Foo.test.tsx`), but **finish with full `npm run test:unit`** unless the user scoped a subset.

**CI parity:** This repo's GitHub Actions workflows (`.github/workflows/pr-checks.yml`, `deadcode.yml`, `playwright.yml`) mirror the local gate. Before calling a ticket done on substantial work, confirm the equivalent local commands all pass — you don't need `act` unless the user asks for it.

## 5. Check off acceptance criteria and close out the ticket

- Edit the ticket file: change `- [ ]` to `- [x]` for each criterion you've actually verified (test passes, or you've manually confirmed the behavior per the criterion's wording). Don't check off something you didn't verify.
- If every criterion is checked, `git mv` the ticket file from `/board/in-progress/` to `/board/done/`.
- If the ticket is a sub-ticket (`NNN.M`), check whether every other `NNN.*` sub-ticket is already in `/board/done/`. If this was the last one, also move the parent epic file `NNN-*.md` to `/board/done/` (the epic file's job is just to index its sub-tickets, so it's done when they all are), then invoke the `collapse-epic` skill on that epic so its sub-ticket files get folded into the epic file instead of piling up individually.
- If only some criteria could be completed (e.g. genuinely blocked on something), leave the ticket in `/board/in-progress/`, leave the unmet boxes unchecked, and clearly tell the user what's blocking it instead of force-completing.

## 6. Spin off follow-up tickets for anything out of scope

While implementing, you'll sometimes notice real work that doesn't belong in *this* ticket — a shortcut taken for now that needs hardening later, a TODO that needs its own pass, a gap the ticket's acceptance criteria didn't anticipate. Don't silently let it slide, and don't scope-creep the current ticket to cover it either.

- Write a new sub-ticket file in `/board/backlog/` following the existing format (Description + checkable Acceptance Criteria), numbered as the next `NNN.M` under whichever epic it logically belongs to (bump `M` past the highest existing sub-ticket for that epic; don't renumber existing ones).
- Reference the originating ticket in the new ticket's Description so the "why" isn't lost.
- Update that epic's index file (`NNN-*.md`) to include the new sub-ticket in its list and range.
- Only do this for genuinely real, scoped follow-up work — not vague "consider revisiting X someday" notes. If you're not sure it's worth a ticket, mention it in your report instead of creating one.

## 7. Report back

Summarize concisely: what was implemented, which files changed, what test/lint/build output confirmed it, and which ticket(s) moved to `done`. Call out any new follow-up ticket(s) you created per step 6, by id. Do not create a git commit unless the user explicitly asks for one — staging the `git mv` of ticket files is fine, but committing is a separate, explicit step per this project's git safety rules.

## 8. Epic mode: completing a whole epic in one shot

When the user means the whole epic ("complete epic 4", "do 4.1 through 4.12", "close out epic 5"), don't run this skill N times sequentially. Treat it as one job that still gives every sub-ticket the full rigor of sections 2-6, but schedules the work efficiently:

1. **Resolve the full scope up front.** Find the epic file and every backlog/in-progress sub-ticket under it (or just the named range, if the user gave one). Read all of them plus `README.md` before assigning any work — you need the whole set in view to spot cross-ticket dependencies.
2. **Move everything to in-progress first**, one batch of `git mv`s, same as a single ticket would.
3. **Map dependencies before splitting work.** Note which sub-tickets' acceptance criteria need a function/type another in-scope sub-ticket defines. Anything with a real dependency on another in-scope ticket must be implemented after it, not in parallel with it. Sub-tickets that touch disjoint files and have no such dependency can run concurrently.
4. **Fan out independent sub-tickets to subagents.** For each parallelizable group, launch one `Task` subagent per sub-ticket (or a small cluster of trivially related ones) in a *single message* so they run concurrently. Each subagent prompt must be self-contained:
   - The full text of the ticket(s) it owns (description + acceptance criteria) and any README excerpt it needs.
   - The exact files it owns to create/edit, so two subagents never touch the same file.
   - The standing rules from section 3 (TDD-first, ESLint strict, no `any` escapes).
   - An instruction to self-check by running only its own new test file(s) (e.g. `npx vitest run src/components/foo.test.tsx`), and explicitly **not** to run the full suite, lint, build, or CI — those are integration steps you run once, after every subagent reports back.
   - A request to report back what it created/changed, its test output, and anything it couldn't verify or had to deviate on.
   Use `subagent_type: "generalPurpose"` unless a narrower type fits (e.g. `explore` for read-only dependency mapping).
5. **Verify each subagent's work before trusting it** — skim the diff for scope creep, skipped TDD, or lint-shaped problems. Fix small issues yourself rather than re-dispatching a subagent for them.
6. **Run the whole-repo checks once, after every sub-ticket in scope is implemented**, exactly as section 4 describes. Fix integration fallout yourself.
7. **Check off criteria and close out per section 5**, for every sub-ticket, then close the epic file once every sub-ticket under it is done, then invoke the `collapse-epic` skill on this epic so its sub-ticket files get folded into the epic file.
8. **Report back per section 7, organized by sub-ticket**, and note which ran in parallel vs. sequentially and why.
