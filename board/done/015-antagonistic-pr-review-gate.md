# 015 — Antagonistic PR review as a delivery requirement

Standing process: every implementation PR must receive an adversarial review (find real defects, not cheerleading) before close-out. Codify the skill + delivery-standards gate, apply it to PR #5 (fireguard), and fix blocking findings from that review.

## Acceptance criteria

- [x] `antagonistic-pr-review` skill exists under `.cursor/skills/` and `.claude/skills/`
- [x] `delivery-standards` + `complete-ticket` + alwaysApply rule require the review before done
- [x] Antagonistic review posted on the active fireguard PR with concrete blocking findings
- [x] Blocking findings addressed (or explicitly waived with rationale on the ticket)
- [x] Delivery gate still green

## Resolution

- Added `antagonistic-pr-review` skill (cursor + claude) and wired it into delivery-standards, complete-ticket, alwaysApply rule, and README.
- Posted antagonistic review on PR #5 (as PR comment — `addPullRequestReview` not permitted to this token).
- Fixed blocking findings: grade modified tests; fail closed on module-only diffs; mutation exit-hook restore; append step summary; honest flake configuredRuns; tighten AST vi.* counting; drop dead mutator branch.
