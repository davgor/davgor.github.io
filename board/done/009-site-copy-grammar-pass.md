# 009 — Site copy grammar pass

User-facing page and experience copy has spelling mistakes, missing words, and grammar issues (e.g. "Title's", "German Shepard", "quarentine", "consistently rose"). Clean up site text for correctness while preserving the author's voice.

## Acceptance criteria

- [x] About Me, Contact, Dogs, Hobbies, and Coding Reference copy are grammatically correct (spelling, apostrophes, proper nouns, subject-verb agreement)
- [x] Experience/`jobs.ts` copy fixes clear spelling and grammar errors (including "quarantine", "processes", Lyft missing "to", etc.)
- [x] Unit tests assert corrected distinctive phrases where they previously locked in typos
- [x] `npm run lint`, `format:check`, `test:unit`, `type-check`, `deadcode`, and `build` pass

## Resolution notes

Corrected typos and grammar across About, Contact, Dogs, Hobbies, Coding Reference, and Experience copy while keeping the informal voice. Staff SDET tenure wording aligned with dated roles ("month" instead of "year"). Unit tests cover distinctive corrected phrases. Full verification gate passed.
