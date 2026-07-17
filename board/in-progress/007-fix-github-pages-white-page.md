# EPIC: Fix intermittent GitHub Pages white page

Deploy workflow runs succeed, but the live site sometimes serves a blank page. Investigation shows `https://davgor.github.io/` can publish the **unbuilt** repo-root `index.html` (`/src/main.tsx`) instead of the Vite `dist/` artifact (`/assets/index-*.js`). Browsers cannot execute `.tsx` on Pages, so `#root` stays empty.

Likely cause: Pages **source** set to “Deploy from a branch” (`main` / root) rather than **GitHub Actions**, optionally confused by the unused `npm run deploy` (`gh-pages`) path.

## Acceptance criteria

- [x] README documents that GitHub Pages source must be **GitHub Actions** (not branch / root)
- [x] `package.json` no longer advertises a conflicting `gh-pages` branch deploy (remove or clearly deprecate)
- [x] Deploy workflow fails the build if `dist/index.html` still references `/src/main.tsx`
- [x] Deploy workflow smoke-checks the live site after publish and fails if HTML references `/src/main.tsx` or lacks a hashed `/assets/` script
- [x] `npm run lint`, `format:check`, `test:unit`, `type-check`, `deadcode`, and `build` still pass
- [ ] **Manual:** Settings → Pages → Source = **GitHub Actions**; confirm live `index.html` references `/assets/index-*.js` (not `/src/main.tsx`)

## Notes

Live check before fix: homepage script was `<script type="module" src="/src/main.tsx">`; `/.nojekyll` 404. Actions `deploy.yml` runs were green while branch-root publish was what visitors got.
## Sub-ticket 007.1 (done)

Root-absolute /assets/ paths applied in source and tests so nested routes load images correctly. See `board/done/007.1-fix-absolute-asset-paths.md`.