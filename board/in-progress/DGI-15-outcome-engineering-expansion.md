# DGI-15 — Expand current Outcome Engineering experience

Add the user-approved cloud sessions, just-in-time context bombs, and Braveheart narrative only to the current Onebrief role in `src/data/jobs.ts`. Preserve existing sections, employer metadata, dates, other roles, and components.

## Approval and scope

- User explicitly approved the exact three-section preview before the public-content edit (`copy=approved`, no changes).
- User permitted the mandatory full red-team review in card evidence instead of a GitHub PR (`review_location=card_evidence`); no PR exists for `main`. Review itself remains required.
- Copy-only data expansion adds no new executable behavior; no brittle copy-pinning tests were added.

## Acceptance criteria

- [x] Harness-integrated EC2 cloud sessions, multiplayer, direct agent collaboration, and fire-and-forget use are rendered.
- [x] Spiderweb knowledge graph, immediate developer learnings, specialist product/UI/UX context, and tag-referenced injections are rendered without invented mechanisms.
- [x] Braveheart leadership, tools-team feedback loops, and support for new technology are rendered.
- [x] Architecture/direction and team implementation attribution are accurate; no invented metrics or persistence guarantees.
- [x] Existing narrative, employer metadata, dates, other roles, and components are unchanged.
- [ ] Delivery checks, actual Experience browser verification, and adversarial review are complete.

## Evidence

- Baseline commit: `83a6cadad6b82f4877031c9624f25633f2d992eb`.
- Final command outputs and marker-formatted review are returned with the card evidence.
- Passed: `npm run lint:fix`, `npm run format`, `npm run lint`, `npm run format:check`, `npm run test:unit` (133 app/script tests and 46 fireguard tests), `npm run type-check`, `npm run deadcode`, `npm run build`.
- `npm run fireguard` is not applicable: no unit tests added or modified.
- Initial `npm run test:e2e` failed: all 135 tests unable to launch missing Playwright Chromium (`chromium-1060/chrome-win/chrome.exe`). Existing configuration retried automatically. This initial failure remains part of the evidence.
- Actual `/experience` surface verified in managed Chromium at desktop and 390px mobile widths: all approved sections rendered, zero page errors, mobile document width 390px without horizontal overflow.
- The in-flight `npx playwright install chromium` completed after downloading build v1060 from its fallback mirror (the first mirror returned HTTP 400). The user then explicitly directed that E2E must not be run again and that this attempt must fail; no E2E rerun occurred.

<!-- red-team-review -->
## Red team review — REQUEST CHANGES

Verdict: The content diff is faithful, but the required E2E gate failed; this attempt is not complete.

### Blocking
- [ ] Delivery gate: `npm run test:e2e` failed to launch its required Chromium executable. The user directed no rerun and failure of this attempt.

### Should-fix
- None in the content diff.

### Nits
- None.

### Gate evasion check
- Reviewed the actual baseline diff: exactly three added paragraph objects in the current role; existing sections, metadata, and other roles are untouched.
- No invented metrics, adoption outcomes, persistence guarantees, tag generation, retrieval, ranking, or trigger mechanisms.
- No executable behavior was added; existing unit tests passed without adding brittle copy-pinning tests. Manual browser success does not replace the failed E2E gate.

### Stack-specific attacks
- Security: added strings contain no executable HTML, links, secrets, or user input despite the existing HTML rendering path.
- React Pages / SPA: observed all three sections on the actual Experience route; desktop/mobile copy remained readable, without mobile horizontal overflow. Routes, components, assets, and deployment configuration are unchanged.
- Electron, concurrency, and process operability: not applicable to this static content-only diff.
- CI reality: E2E failed before application assertions; no checks, retries, or timeouts were changed.
- Posting: user explicitly authorized this review in card evidence instead of a GitHub PR; no PR exists.