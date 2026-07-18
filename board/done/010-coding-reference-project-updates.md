# 010 — Update Coding Reference for Electron Server Manager and AI-DND-Matrix

Refresh the Electron Server Manager card from the current repo capabilities, and add a Coding Reference section for the AI-DND-Matrix (AI-TTRPG) project so both personal repos are represented accurately.

## Acceptance criteria

- [x] Electron Server Manager copy reflects current features (Steam detection, backups, config editor, Palworld REST admin/live ops, secure IPC, release auto-update)
- [x] Coding Reference includes an AI-DND-Matrix / AI-TTRPG project card with accurate summary and GitHub link
- [x] Unit tests cover both project cards and distinctive updated phrases
- [x] `npm run lint`, `format:check`, `test:unit`, `type-check`, `deadcode`, and `build` pass

## Resolution notes

Electron Server Manager card rewritten from the current README/ARCHITECTURE (SteamCMD, Palworld REST admin + live ops, typed IPC, GitHub Releases auto-update). Added AI-DND-Matrix card covering dual-agent design, deterministic engine + SQLite grounding, multi-character hub, and Claude/Player2 providers. Verified with full unit/lint/type-check/deadcode/build gate.
