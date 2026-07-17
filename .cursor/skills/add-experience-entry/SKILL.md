---
name: add-experience-entry
description: >-
  Adds or updates Experience page entries in src/data/jobs.ts (new employer
  cards or new roles under an existing employer). Use when the user wants to
  add a job, role, promotion, employer, experience section, resume bullet,
  achievement list, or fill in portfolio work history by talking through it.
---

# Add experience entry

Streamline filling `src/data/jobs.ts` from a conversation. Match existing voice and shape; do not invent employers, dates, or metrics the user did not provide.

Also follow [delivery-standards](../delivery-standards/SKILL.md) for board + verify gate.

## Modes

| User intent | Action |
|-------------|--------|
| New company | Insert a new `Job` object at the **front** of `jobs` (newest first) |
| Promotion / new title at existing company | Prepend a new `Role` to that job's `roles` array (newest first) |
| Edit existing role/company | Patch the matching object in place; keep surrounding entries untouched |

If unclear which mode, ask once before writing.

## Interview (ask only what's missing)

Collect or confirm:

1. **Company** — name, website URL, `id` slug (lowercase, no spaces; e.g. `onebrief`)
2. **Logo** — filename under `./assets/` (e.g. `./assets/acme.png`). If missing, use a plausible path and tell the user to drop the file in `public/assets/` (or wherever this repo serves static assets from)
3. **Role title** — job title only (skill formats the display string)
4. **Dates** — start and end as `MM/DD/YYYY`, or `Present`
5. **Story paragraphs** — what they did, why it mattered, tech/process. Prefer several titled sections over one wall of text
6. **Achievements** — measurable outcomes (optional but strongly preferred)

Do **not** fabricate metrics, headcount, flake rates, or dollar amounts. If the user is vague, draft prose without fake numbers and mark `[confirm metric]` only when a number is needed — then ask before saving.

After drafting, show a short preview (role title + paragraph titles + achievement bullets) and get confirmation before editing `jobs.ts` unless they said to write immediately.

## Data shape

Types live in `src/types/index.ts`:

```ts
Job { website, id, logo, roles: Role[] }
Role { title, paragraphs: Paragraph[], achievements?: Achievement }
Paragraph { title, text }  // title may be ''
Achievement { title: 'Achievements', list: string[] }
```

**Role `title` format** (exact pattern used in the file):

```text
{Company} - {Job Title} - {MM/DD/YYYY} - {MM/DD/YYYY|Present}
```

Examples: `Onebrief - Engineering Manager, Quality - 10/01/2025 - Present`

**Paragraph style for new entries** (prefer current Onebrief style):

- Non-empty `title` per section (e.g. `Why I was hired`, `Building the team`, project names)
- First-person narrative `text`; conversational, specific, outcome-oriented
- HTML allowed when useful: `<b>`, `<a href="...">`, `<ul><li>...`

**Achievements:**

- `title: 'Achievements'`
- Each list item is one outcome, ideally with before→after or %/time metrics
- Bold tech names with `<b>` when matching older entries (optional)

For voice samples and edge cases, see [voice-and-examples.md](voice-and-examples.md).

## Write steps

1. Read `src/data/jobs.ts` and locate insert/update point
2. Apply the edit with minimal diff
3. If **new employer `id`**, update the ordered id list in `src/data/jobs.test.ts` (`includes the expected employers`)
4. Run:
   ```bash
   npm run lint:fix
   npm run format
   npm run lint
   npm run format:check
   npm run test:unit
   ```
5. Fix failures (usually escaping quotes in template strings, or outdated employer id list)
6. Summarize what was added and any logo file still needed

## Checklist

```
Experience entry:
- [ ] Mode confirmed (new job / new role / edit)
- [ ] Required fields present (website, id, logo, role title, dates, ≥1 paragraph)
- [ ] Newest-first ordering preserved
- [ ] No invented metrics
- [ ] jobs.test.ts employer ids updated if new company
- [ ] unit tests + lint/format pass
- [ ] User knows if logo asset still needs to be added
```

## Out of scope

- Do not rewrite unrelated jobs to "improve" tone
- Do not change `JobCard` / page components unless the data model itself must change (ask first)
- Do not commit unless the user asks
