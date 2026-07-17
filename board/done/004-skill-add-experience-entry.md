# 004 — Skill: add experience entry

Add a project skill so an agent can interview for work-history details and write structured entries into `src/data/jobs.ts` (new employers or new roles), matching existing voice, ordering, and test updates.

## Acceptance criteria

- [x] `.cursor/skills/add-experience-entry/SKILL.md` exists with interview + write workflow
- [x] Voice/examples companion file exists under the skill folder
- [x] Mirrored under `.claude/skills/add-experience-entry/`
- [x] Skill covers new employer, new role at existing employer, and in-place edits
- [x] Skill requires updating `jobs.test.ts` employer ids when adding a company
- [x] Skill forbids inventing metrics and points at delivery-standards verify gate
