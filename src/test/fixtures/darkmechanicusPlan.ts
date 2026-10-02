import type { ExportedPlan } from '../../types/darkmechanicusPlan';

/**
 * A realistic exported plan for component tests: three sprints, mixed statuses, an optional
 * ticket and five dependency edges.
 *
 * This is exactly what the export produces from the committed records fixture in
 * `src/test/fixtures/darkmechanicus-records/` (revision 1 of this site's own Dark Mechanicus
 * epic, with hand-set statuses and poisoned values). `planExport.test.ts` checks that, so the
 * fixture cannot drift from the exporter, and `tsc` checks it against `ExportedPlan`.
 */
export const darkmechanicusPlanFixture: ExportedPlan = {
  epic: {
    title: 'Showcase Dark Mechanicus on Coding Reference',
    successCriteria: [
      'Coding Reference shows a Dark Mechanicus project card whose first-person copy matches what v0.8.0 actually ships (MCP server + desktop app on shared repository-owned state, draft -> Save -> orchestrated run, human-approved sprint checkpoints) and links to the GitHub repo and its latest release.',
      'The card includes 2-3 real desktop-app screenshots with descriptive alt text, none showing a private repository name, local path, username, or session/machine id.',
      "The page renders a read-only plan view of this epic's own saved plan: sprints in order with goals, every ticket's display key, title and status, and every dependency edge, with an accessible text equivalent.",
      "The plan view's data is generated from committed .darkmechanicus/ records at dev/build time, with no Dark Mechanicus install, through an allowlist that excludes paths, ids, ticket bodies, references and comments; the same records always produce byte-identical output.",
      'Existing Coding Reference content (Fantasy World Generator showcase and project cards) still renders, and lint, format:check, test:unit, fireguard (no F), type-check, deadcode, build and test:e2e pass.',
      'The change is merged to main via a PR with a posted red-team review, the Pages deploy succeeds, and https://davgor.github.io/coding-reference shows the card and plan view at desktop width and at 375px with no page-level horizontal scroll.',
    ],
    status: 'in_progress',
    revision: 1,
    savedAt: '2026-10-01T15:17:33.687Z',
  },
  sprints: [
    {
      ordinal: 1,
      goal: "The card's words and pictures are ready: accurate Dark Mechanicus copy on Coding Reference and privacy-safe app screenshots.",
      exitCriteria: [
        'The person has read and approved the card copy and its placement.',
        'The person has approved the screenshots and confirmed they contain no private information.',
        "The site gate is green on the sprint's changes.",
      ],
    },
    {
      ordinal: 2,
      goal: 'A real Dark Mechanicus plan renders on the site from committed records: sanitized export plus a read-only, accessible plan view.',
      exitCriteria: [
        "The person has approved the export's field allowlist.",
        'The person has reviewed the plan view at desktop width and at 375px, in light and dark themes.',
        "The site gate is green on the sprint's changes.",
      ],
    },
    {
      ordinal: 3,
      goal: 'Shipped: the card, screenshots and plan view are integrated, merged, deployed and verified live.',
      exitCriteria: [
        'Every epic success criterion s1-s6 has recorded evidence.',
        'The live page is verified at desktop width and at 375px.',
      ],
    },
  ],
  tickets: [
    {
      key: 'DGI-1',
      title: 'Write the Dark Mechanicus project card',
      sprintOrdinal: 1,
      status: 'completed',
      optional: false,
    },
    {
      key: 'DGI-2',
      title: 'Capture and prepare Dark Mechanicus app screenshots',
      sprintOrdinal: 1,
      status: 'completed',
      optional: true,
    },
    {
      key: 'DGI-3',
      title: 'Export the saved plan as sanitized static JSON',
      sprintOrdinal: 2,
      status: 'in_progress',
      optional: false,
    },
    {
      key: 'DGI-4',
      title: 'Build the read-only plan view component',
      sprintOrdinal: 2,
      status: 'backlog',
      optional: false,
    },
    {
      key: 'DGI-5',
      title: 'Embed the card, screenshots and plan view on Coding Reference',
      sprintOrdinal: 3,
      status: 'backlog',
      optional: false,
    },
    {
      key: 'DGI-6',
      title: 'Ship and verify Dark Mechanicus showcase live',
      sprintOrdinal: 3,
      status: 'backlog',
      optional: false,
    },
  ],
  edges: [
    { from: 'DGI-1', to: 'DGI-5' },
    { from: 'DGI-2', to: 'DGI-5' },
    { from: 'DGI-3', to: 'DGI-4' },
    { from: 'DGI-4', to: 'DGI-5' },
    { from: 'DGI-5', to: 'DGI-6' },
  ],
};
