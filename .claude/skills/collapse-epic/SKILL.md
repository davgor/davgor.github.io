---
name: collapse-epic
description: Collapse a fully-done epic in board/done — merge every sub-ticket's (NNN.M) full content into the parent epic file (NNN-*.md) under a "## Sub-tickets" section, then delete the now-redundant sub-ticket files. Use right after an epic's last sub-ticket gets checked off and the epic file is moved into board/done (including automatically at the end of complete-ticket's epic mode), or whenever the user says to collapse/merge/fold a completed epic's tickets into the epic file.
---

# Collapse a completed epic

Mirrors `.claude/skills/collapse-epic/SKILL.md` — keep both in sync when changing workflow rules.

When every sub-ticket `NNN.M` of an epic is in `board/done/` and the epic index file `NNN-*.md` has also been moved there, the per-sub-ticket files are now pure history — their content belongs inside the epic file instead of as 5-25 separate files cluttering `board/done/`. This skill folds them in and removes the duplicates.

## 1. Confirm the epic is actually fully done

- Resolve the epic number (zero-padded to 3 digits, e.g. `4` -> `004`).
- Confirm the epic index file `board/done/NNN-*.md` exists.
- List every `board/done/NNN.*.md` file — these are the children to fold in.
- If any sub-ticket for this epic still exists in `board/backlog/` or `board/in-progress/`, stop and say so — do not collapse a partially-done epic.

## 2. Merge each child into the parent

For the epic file, append a `## Sub-tickets` section (create it if missing) after its existing content. For each child file, in ascending `NNN.M` order:

1. Read the child file. Its first line is `# Title` — that becomes the subsection heading text.
2. Take everything after the title line as the body.
3. Demote any `## ` headings in that body to `#### ` (so `## Description` / `## Acceptance Criteria` nest correctly under the epic's `##`/`###` structure instead of competing with it).
4. Append to the epic file as:

   ```
   ### NNN.M Title

   <demoted body>
   ```

Keep the epic file's original top content (its own description, the sub-ticket index line, etc.) untouched above the new `## Sub-tickets` section — don't rewrite or summarize it.

## 3. Delete the child files

Once every child's content is merged into the epic file, delete the individual `board/done/NNN.M-*.md` files (`git rm` if the repo already tracks them, plain delete otherwise — either is fine pre-commit, but prefer `git rm` so the removal is staged cleanly alongside the edited epic file).

## 4. Verify

- Re-open the epic file and confirm every sub-ticket's title, Description, and Acceptance Criteria (with their original `[x]` checkmarks intact — don't re-verify or alter completion state) made it across.
- Confirm `board/done/` no longer has any `NNN.M-*.md` files for this epic — only the single `NNN-*.md`.

## 5. Report back

Name the epic collapsed, how many sub-tickets were folded in, and confirm no content was dropped. Don't create a git commit unless explicitly asked — this skill only edits/removes files in the working tree.

## When this fires automatically

`complete-ticket`'s closing steps (single-ticket section 5, epic-mode section 8.7) move an epic's index file to `board/done/` once its last sub-ticket is done. Immediately after that move, invoke this skill on that epic so `board/done/` never accumulates an uncollapsed epic.
