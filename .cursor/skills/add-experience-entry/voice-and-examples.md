# Experience entry voice and examples

Companion to [SKILL.md](SKILL.md). Read when drafting prose or unsure about style.

## Voice

- First person ("I led", "we rebuilt")
- Concrete over vague: name tools, team sizes, flake rates, timelines when the user provided them
- Conversational resume storytelling — not corporate buzzword salad
- Prefer "what problem → what I did → what changed"

## Good paragraph titles

- `Why I was hired` / `Why was I promoted?`
- Project or initiative names (`POM Locator Library`, `Shadow testing (e2e quarantine)`)
- Process names (`Quality Champion`, `Building the team`)

Empty `title: ''` appears in older entries (Lyft, Atreo). Prefer **titled** sections for anything new or newly expanded.

## Skeleton (new employer)

```ts
{
  website: 'https://example.com/',
  id: 'example',
  logo: '/assets/example.png',
  roles: [
    {
      title: 'Example - Staff SDET - 01/15/2026 - Present',
      paragraphs: [
        {
          title: 'Why I was hired',
          text: '...',
        },
        {
          title: 'First major initiative',
          text: '...',
        },
      ],
      achievements: {
        title: 'Achievements',
        list: [
          'Measurable outcome with before/after when available.',
        ],
      },
    },
  ],
},
```

Insert this object as the **first** element of the `jobs` array.

## Skeleton (new role at existing employer)

Prepend inside that job's `roles`:

```ts
{
  title: 'Example - Engineering Manager - 06/01/2026 - Present',
  paragraphs: [
    {
      title: 'Why was I promoted?',
      text: '...',
    },
  ],
  achievements: {
    title: 'Achievements',
    list: ['...'],
  },
},
```

If the previous role still says `Present`, update its end date to the day before the new role's start (ask the user for the exact end date; do not guess).

## Expanding an existing role

**User:** "Add more to my Onebrief EM role about the quarantine bot and a couple achievements."

1. Find `id: 'onebrief'` → role title containing `Engineering Manager`
2. Keep all existing paragraphs
3. Append new titled paragraph(s), e.g. `{ title: 'AI quarantine bot', text: '...' }`
4. Append to `achievements.list` (create the achievements object if missing)
5. Preview titles/bullets → write minimal diff

**User:** "Flesh out Lyft — turn the untitled blurbs into proper sections and add Focus Flow detail."

1. Match `id: 'lyft'`
2. Optionally assign titles to existing empty-title paragraphs **only when the user wants restructure**
3. Add new titled sections for new material; do not delete old text unless replacing a named section
4. Keep achievement list; append if they gave new outcomes

**Placement defaults**

| Ask | Default |
|-----|---------|
| "Add another project…" | Append paragraph after existing ones |
| "Add after POM Locator Library…" | Insert after that titled paragraph |
| "Rewrite Why I was hired…" | Replace that paragraph's `text` (and title if renamed) |
| "Also note that we cut flake to sub 1%…" | New achievement bullet (or fold into the relevant paragraph if they prefer narrative) |

## HTML in text

```ts
text: 'We used <b>Playwright</b> and followed <a href="https://example.com">shift left</a>.'
```

```ts
text: '<ul><li>UI Testing</li><li>API Testing</li></ul>'
```

Escape carefully inside double-quoted / template strings in `jobs.ts`.

## Anti-patterns

- Inventing `%` improvements or headcount
- One giant untitled paragraph for a rich role
- Putting newest employer at the bottom of `jobs`
- Changing `id` on an existing employer (breaks testids / e2e)
- Leaving `jobs.test.ts` employer list stale after a new company
- Rewriting the whole role when the user only asked to add one section
- Dropping existing achievements while appending new ones
