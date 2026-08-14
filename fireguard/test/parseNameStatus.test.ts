import { describe, it, expect } from 'vitest';
import { parseNameStatus } from '../src/gitScope.js';

describe('parseNameStatus', () => {
  it('parses added, modified, and renamed paths from git name-status', () => {
    const output = [
      'A\tsrc/new.test.ts',
      'M\tsrc/old.ts',
      'R100\tsrc/a.test.ts\tsrc/b.test.ts',
      'D\tsrc/gone.ts',
      '',
    ].join('\n');
    expect(parseNameStatus(output)).toEqual([
      { status: 'A', path: 'src/new.test.ts' },
      { status: 'M', path: 'src/old.ts' },
      { status: 'R', oldPath: 'src/a.test.ts', path: 'src/b.test.ts' },
      { status: 'D', path: 'src/gone.ts' },
    ]);
  });
});
