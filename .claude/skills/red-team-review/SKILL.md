---
name: red-team-review
description: >-
  Mandatory red-team / adversarial PR review before marking implementation work
  complete. Hunts for real defects, missing tests, security holes, scope creep,
  and gate evasion. Use before ticket done/merge-ready, before requesting human
  merge, and whenever the user asks for a red-team, antagonistic, or harsh review.
---

# Red team review (required gate before completion)

Mirrors `.cursor/skills/red-team-review/SKILL.md` — keep both in sync.
Legacy alias: `.cursor/skills/antagonistic-pr-review/SKILL.md` (same gate).

This is not a compliment pass. Assume the author (human or agent) is trying to
merge something that looks done but is soft under pressure. Your job is to
**break confidence** with specific, file-referenced findings.

## When it is required

**Hard requirement** before:

- Moving a board ticket to `done/`
- Claiming a PR is merge-ready / complete
- Asking a human to merge

Applies to every implementation change that touches product code, tests, CI,
workflows, deploy, or agent skills — **including PRs you yourself just authored**.

Skip only for pure docs typo fixes with no behavior change, or when the user
explicitly waives the review.

## How to review

1. Diff against the PR base (`origin/main...HEAD` or the PR base branch).
2. Read the changed code paths — do not review from the PR summary alone.
3. Attack these angles (skip only if truly N/A, and say why):
   - **Correctness** — logic bugs, race conditions, dirty worktree risk, bad exit codes
   - **Gate evasion** — can an agent skip fireguard / lint / tests / red-team by shaping the diff?
   - **Test honesty** — tautologies, missing edge cases, tests that cannot fail
   - **Security** — secrets, unsafe `spawn`/`shell`, token misuse, path traversal, XSS, open redirects
   - **Electron (when applicable)** — `nodeIntegration`, missing `contextIsolation`, privileged preload leaks, remote content
   - **SPA / Pages (when applicable)** — wrong `base`, client-router 404s, shipping Vite dev HTML, broken asset paths
   - **CI reality** — shallow clones, permissions, flake budget lies, non-failing continues
   - **Scope creep** — unrelated dependency bumps or refactors smuggled in
   - **Operability** — actionable errors, restore-on-failure, idempotent PR comments
4. Classify each finding:
   - **Blocking** — must fix before merge / before calling work done
   - **Should-fix** — fix in this PR unless waived in the board ticket
   - **Nit** — optional
5. Post the review on the PR:
   - Prefer `gh pr review --request-changes --body ...` when any **Blocking** item exists
   - Otherwise `gh pr review --comment --body ...`
   - Body must include marker `<!-- red-team-review -->` (legacy `<!-- antagonistic-pr-review -->` also OK) and a checklist of findings with file paths
6. Open or update a board ticket for blocking/should-fix items if they are not fixed in the same turn.

## Required review body shape

```markdown
<!-- red-team-review -->
## Red team review — REQUEST CHANGES | COMMENT

Verdict: <one harsh sentence>

### Blocking
- [ ] `path`: <defect and why it matters>

### Should-fix
- [ ] `path`: <defect>

### Nits
- [ ] ...

### Gate evasion check
- <how an agent could cheat this change, or "none found">

### Stack-specific attacks
- Electron: <what you tried, or N/A>
- React Pages / SPA: <what you tried, or N/A>
```

## After the review

- You may **not** mark the related ticket **done** or claim the PR is ready while any
  **Blocking** item is unchecked.
- Fix blocking findings (TDD-first), push, and reply on the PR with what changed.
- Re-run the delivery verification gate after fixes (see `.ai-instructions.md`).
- When all blocking items are resolved, submit a follow-up review approving or
  confirming the fixes (`gh pr review --approve` only if you are actually
  satisfied — do not rubber-stamp).
- Completion reports must include: red-team verdict, what angles you attacked, and
  whether Blocking items were fixed.

## Relationship to other gates

- Does **not** replace fireguard, lint, unit tests, build, or e2e.
- Runs **after** those are green (reviewing red CI is optional noise).
- Delivery-standards and complete-ticket treat an unresolved red-team review
  as a **failed close-out**.
