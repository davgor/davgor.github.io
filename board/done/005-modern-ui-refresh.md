# EPIC: Modern developer UI refresh

Restyle the portfolio as a modern developer extended-resume: slim top nav, soft beach backdrop with readable overlay, tokenized CSS (no Bootstrap 4 CDN), and refreshed BlogCard/JobCard skins — without changing the content APIs or `jobs.ts` add-entry workflow.

## Acceptance criteria

- [x] Layout uses a sticky top nav (name brand + page links) instead of the left sidebar
- [x] Beach backdrop remains, softened with blur/overlay so content stays readable
- [x] BlogCard and JobCard keep existing props/testids; pages still add entries the same way
- [x] Bootstrap 4 CDN import and Bootstrap layout classes are removed from `src/`
- [x] Design tokens + Sora / IBM Plex Sans typography live in `src/index.css`
- [x] Unit tests cover top-nav active state (`aria-current`) and content-card hooks
- [x] E2E navigation targets `nav` / content cards (not `#menu` / Bootstrap `.card` alone)
- [x] `npm run lint`, `format:check`, `test:unit`, `type-check`, `deadcode`, `build`, and `test:e2e` pass
