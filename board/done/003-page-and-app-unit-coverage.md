# 003 — Page and App unit/component coverage

Component tests already cover `BlogCard`, `JobCard`, and `Layout`. Pages and App routing have no Vitest coverage; experience content validation mostly lives in Playwright. Add fast unit/component tests for every page, App routes, and jobs data shape so regressions are caught without a browser.

## Acceptance criteria

- [x] Shared test render helper exists for router-wrapped components
- [x] Unit tests cover AboutMe, Experience, CodingReference, Dogs, Hobbies, ContactMe
- [x] App routing unit tests cover each primary path rendering its page
- [x] Jobs data integrity unit tests assert required fields for every job/role
- [x] JobCard covers role without achievements
- [x] `npm run test:unit` passes; lint and format:check pass
