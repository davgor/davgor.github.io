# 006 — Fix About card photo crop

About Me title image uses `object-fit: cover` with default center positioning, which clips David’s face on the left. Allow controlling object-position for title images and pin the About photo to keep the subject in frame.

## Acceptance criteria

- [x] `BlogCard` accepts an optional title-image object-position (tested)
- [x] About Me photo uses a left-biased position so the face is not clipped
- [x] Other title images (e.g. Dogs) keep default centering unless overridden
- [x] `npm run lint`, `format:check`, and `test:unit` pass
