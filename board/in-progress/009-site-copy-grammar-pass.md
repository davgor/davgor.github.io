# 009 — Site copy grammar pass

User-facing page and experience copy has spelling mistakes, missing words, and grammar issues (e.g. "Title's", "German Shepard", "quarentine", "consistently rose"). Clean up site text for correctness while preserving the author's voice.

## Acceptance criteria

- [ ] About Me, Contact, Dogs, Hobbies, and Coding Reference copy are grammatically correct (spelling, apostrophes, proper nouns, subject-verb agreement)
- [ ] Experience/`jobs.ts` copy fixes clear spelling and grammar errors (including "quarantine", "processes", Lyft missing "to", etc.)
- [ ] Unit tests assert corrected distinctive phrases where they previously locked in typos
- [ ] `npm run lint`, `format:check`, `test:unit`, `type-check`, `deadcode`, and `build` pass
