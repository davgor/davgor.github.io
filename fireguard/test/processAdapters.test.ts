import { describe, it, expect } from 'vitest';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createMutationApplier } from '../src/processAdapters.js';

describe('createMutationApplier', () => {
  it('restores original source after applying a mutant', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'fireguard-'));
    const rel = 'mod.ts';
    const absolute = join(dir, rel);
    const original = 'export const n = 1;\n';
    await writeFile(absolute, original, 'utf8');

    const seen: string[] = [];
    const applyAndTest = createMutationApplier({
      cwd: dir,
      runOnce: async () => {
        seen.push(await readFile(absolute, 'utf8'));
        return { ok: false };
      },
    });

    const result = await applyAndTest({
      file: rel,
      originalSource: original,
      mutatedSource: 'export const n = 2;\n',
      relatedTests: ['mod.test.ts'],
    });

    expect(result.ok).toBe(false);
    expect(seen).toEqual(['export const n = 2;\n']);
    expect(await readFile(absolute, 'utf8')).toBe(original);
  });

  it('treats mutants as survived when no related tests exist', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'fireguard-'));
    const rel = 'mod.ts';
    await writeFile(join(dir, rel), 'export const n = 1;\n', 'utf8');
    const applyAndTest = createMutationApplier({
      cwd: dir,
      runOnce: async () => ({ ok: false }),
    });
    const result = await applyAndTest({
      file: rel,
      originalSource: 'export const n = 1;\n',
      mutatedSource: 'export const n = 2;\n',
      relatedTests: [],
    });
    expect(result.ok).toBe(true);
    expect(await readFile(join(dir, rel), 'utf8')).toBe('export const n = 1;\n');
  });
});
