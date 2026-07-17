---
name: add-experience-entry
description: >-
  Adds, expands, or updates Experience page entries in src/data/jobs.ts — new
  employer cards, new roles/promotions, or further fleshing out an existing
  job/role (more paragraphs, achievements, richer detail). Use when the user
  wants to add a job, expand experience, flesh out a role, add resume bullets,
  achievements, projects under an employer, or fill in portfolio work history
  by talking through it.
---

# Add / expand experience entry

Streamline filling `src/data/jobs.ts` from a conversation — **new** entries or **expanding** ones that already exist. Match existing voice and shape; do not invent employers, dates, or metrics the user did not provide.

Also follow [delivery-standards](../delivery-standards/SKILL.md) for board + verify gate.

## Modes

| User intent | Action |
|-------------|--------|
| New company | Insert a new `Job` at the **front** of `jobs` (newest first) |
| Promotion / new title at existing company | Prepend a new `Role` to that job's `roles` (newest first) |
| **Expand existing job/role** | Append/insert paragraphs and/or achievements on the matched role; keep `id`, logo, website, and other roles unless asked |
| Edit / rewrite existing section | Patch specific paragraph(s), titles, dates, or achievement bullets in place |
| Restructure thin entry | Split untitled walls into titled sections; optionally add achievements block if missing |

If unclear which mode, ask once before writing. For expand/edit, identify the target by **company `id`** and **role title** (or role index) before changing anything.

## Interview (ask only what's missing)

### New job or new role

1. **Company** — name, website URL, `id` slug (lowercase, no spaces; e.g. `onebrief`)
2. **Logo** — `./assets/...` path; if missing, pick a plausible path and tell the user to add the file
3. **Role title** — job title only (skill formats the display string)
4. **Dates** — `MM/DD/YYYY` start/end, or `Present`
5. **Story paragraphs** — what they did, why it mattered, tech/process
6. **Achievements** — measurable outcomes (optional but strongly preferred)

### Expand or deepen an existing role

1. **Which entry** — company (`id` or name) + role (title fragment or “current role”)
2. **What to add** — new project/initiative sections, more narrative on an existing section, and/or new achievement bullets
3. **Placement** — append after existing paragraphs (default), insert after a named section, or replace a named section
4. **Raw notes** — accept bullet dumps, voice transcripts, or rough prose; shape them into titled paragraphs

When expanding, **read the existing role first** and preserve content the user did not ask to change. Prefer additive edits over rewrites.

Do **not** fabricate metrics. If vague, draft without fake numbers and ask before saving anything that needs a confirmed figure.

After drafting, show a short preview (target role + new/changed paragraph titles + new achievement bullets) and get confirmation unless they said to write immediately.

## Data shape

Types live in `src/types/index.ts`:

```ts
Job { website, id, logo, roles: Role[] }
Role { title, paragraphs: Paragraph[], achievements?: Achievement }
Paragraph { title, text }  // title may be ''
Achievement { title: 'Achievements', list: string[] }
```

**Role `title` format:**

```text
{Company} - {Job Title} - {MM/DD/YYYY} - {MM/DD/YYYY|Present}
```

**Paragraph style for new or expanded sections** (Onebrief style):

- Non-empty `title` per section
- First-person narrative; conversational; outcome-oriented
- HTML allowed: `<b>`, `<a href="...">`, `<ul><li>...`

**Achievements:**

- `title: 'Achievements'`
- Create the block if the role has none and the user provided outcomes
- Append new bullets; do not drop existing bullets unless asked

For voice samples and expand examples, see [voice-and-examples.md](voice-and-examples.md).

## Write steps

1. Read `src/data/jobs.ts`; for expand/edit, quote the target role's current paragraph titles in the preview
2. Apply a **minimal diff** (only the matched job/role fields)
3. If **new employer `id`**, update the ordered id list in `src/data/jobs.test.ts`
4. Run:
   ```bash
   npm run lint:fix
   npm run format
   npm run lint
   npm run format:check
   npm run test:unit
   ```
5. Fix failures (quote escaping, stale employer id list)
6. Summarize what was added/changed and any logo file still needed

## Checklist

```
Experience entry:
- [ ] Mode confirmed (new job / new role / expand / edit / restructure)
- [ ] Target company + role identified when expanding or editing
- [ ] Required fields present for new entries; additive content clear for expands
- [ ] Newest-first ordering preserved; existing id/logo/website unchanged unless asked
- [ ] No invented metrics; unrelated roles left alone
- [ ] jobs.test.ts employer ids updated if new company
- [ ] unit tests + lint/format pass
- [ ] User knows if logo asset still needs to be added
```

## Out of scope

- Do not rewrite unrelated jobs to "improve" tone
- Do not change `JobCard` / page components unless the data model itself must change (ask first)
- Do not commit unless the user asks
- Do not renumber or rename an existing employer `id` (breaks testids / e2e)
