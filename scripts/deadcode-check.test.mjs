import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { normalizeTsPruneLine, readIgnoreSet } from './deadcode-check.mjs';

describe('normalizeTsPruneLine', () => {
  it('strips parenthetical notes and normalizes slashes', () => {
    expect(normalizeTsPruneLine('src\\lib\\foo.ts:1 - bar (used in module)')).toBe(
      'src/lib/foo.ts:1 - bar'
    );
  });

  it('returns empty for blank lines', () => {
    expect(normalizeTsPruneLine('')).toBe('');
    expect(normalizeTsPruneLine('   ')).toBe('');
  });
});

describe('readIgnoreSet', () => {
  it('skips comments and blank lines', () => {
    const set = readIgnoreSet(join(process.cwd(), 'scripts/deadcode-check.test-fixture-ignore'));
    expect(set.has('src/example.ts:1 - kept')).toBe(true);
    expect(set.has('# comment')).toBe(false);
    expect(set.size).toBe(1);
  });
});
