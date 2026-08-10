# 016 — Fix fireguard CI F on react-router module-only diff

CI Checks / fireguard fails PR #5 with grade F: `src/App.tsx` and `src/test/renderWithRouter.tsx` changed without graded unit test updates (fail-closed rule from antagonistic review).

## Acceptance criteria

- [x] `src/test/**` helpers are not treated as production modules for fireguard scope
- [x] Graded unit test update covers App routing after react-router v7 / future-flag removal
- [x] `npm run fireguard` is not grade F for this PR’s diff
- [x] Delivery gate still green

## Resolution

- Excluded `src/test/**` helpers from production module scope.
- Added App BrowserRouter boot test covering react-router v7 future-flag removal.
- Fireguard now has graded tests + App.tsx in scope instead of fail-closed F.
