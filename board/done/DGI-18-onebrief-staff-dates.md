# DGI-18 — Correct Onebrief Staff dates

User confirmed September 2024–October 2025. Correct the displayed start year and the promotion narrative from a month to a year; preserve unrelated work.

## Acceptance criteria

- [x] Staff role shows 09/01/2024–10/01/2025.
- [x] Promotion narrative and existing wording assertion agree with the confirmed tenure.
- [x] Required verification passes.
- [x] Local red-team review completed.

Content correction only; no new behavior or tests. Existing text assertion updated for corrected wording. Other working-tree changes predate this task.

## Verification

Targeted ESLint autofix and Prettier; full lint, formatting check, 179 unit tests, type checking, deadcode, and build passed. Fireguard reported A but skipped grading because it detected no changed tests against its configured base; this is not mutation/flake evidence. No navigation, component behavior, or layout changed, so E2E was not required for this content correction.

## Local red-team review

No blocking findings in this change. Reviewed confirmed dates, promotion-narrative consistency, existing assertion alignment, and diff scope. No runtime, security, routing, or deployment changes. No PR created, committed, published, or reviewed remotely.

Follow-up: user confirmed transitioning directly from Blackpoint to Onebrief in September 2024. Corrected the repository Blackpoint end date to 09/01/2024; the resume already has this date. Follow-up lint, formatting, 179 unit tests, type checking, deadcode, and build passed. Local red-team review of chronology and diff scope found no blocking issues. No tests or runtime behavior changed in this follow-up; no additional Fireguard or E2E run required. Changes remain uncommitted and unpublished.
