# 014 — Fireguard posts letter grade on PRs

Fireguard CI currently only prints the grade in job logs. Agents opening PRs need the letter grade visible on the PR itself (sticky comment) so an F is obvious without digging into Actions logs.

## Acceptance criteria

- [x] Markdown PR comment formatter includes grade letter, score, and gate summary
- [x] Sticky comment marked so re-runs update instead of spamming
- [x] CI fireguard job posts/updates the comment on pull_request (including when grade is F)
- [x] Unit tests cover markdown formatting and comment upsert selection
- [x] Delivery gate still green

## Resolution

- Added `formatPrMarkdown` + sticky upsert (`<!-- fireguard-report -->`)
- CLI `--comment-pr` / `--markdown-out` / `--json-out` + `GITHUB_STEP_SUMMARY`
- CI fireguard job posts grade on PRs (`pull-requests: write`)
