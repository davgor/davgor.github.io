# 008 — Fix Dogs card empty cream panels

Dogs page title images are large portrait photos. The side-by-side content-card layout lets the image’s intrinsic aspect ratio drive card height (~450px+), while each dog card only has a title and one breed line. The stretched `content-card__body` reads as a huge empty cream block overlapping / beside the photos.

## Acceptance criteria

- [x] Title-image media no longer expands card height from the photo’s intrinsic aspect ratio; body content (with a sensible media min-height) drives card height
- [x] Dogs cards no longer show large empty cream panels next to short breed text (visual check on `/dogs`)
- [x] About Me title-image card still fills the media column when body text is tall
- [x] Mobile stacked title-image cards keep a bounded media height
- [x] `npm run lint`, `format:check`, `test:unit`, `type-check`, `deadcode`, and `build` pass

## Resolution notes

Title-image media uses absolute-positioned `object-fit: cover` images inside a relative media region with `min-height: 14rem`, so card height follows body content (Dogs ~224px vs ~456px before). About Me still stretches media with tall body text. Mobile keeps a fixed 14rem media height. Verified visually on `/dogs` and `/`; unit/lint/type-check/deadcode/build all passed.
