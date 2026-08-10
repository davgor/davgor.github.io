import { describe, it, expect } from 'vitest';
import { resolveGitScope } from '../src/gitScope.js';
import { DEFAULT_CONFIG } from '../src/config.js';

describe('resolveGitScope', () => {
  it('selects only added unit test files as new tests', () => {
    const scope = resolveGitScope({
      config: DEFAULT_CONFIG,
      entries: [
        { status: 'A', path: 'src/pages/NewPage.test.tsx' },
        { status: 'M', path: 'src/pages/Experience.test.tsx' },
        { status: 'A', path: 'e2e/new.spec.ts' },
        { status: 'A', path: 'src/pages/NewPage.tsx' },
        { status: 'M', path: 'src/data/jobs.ts' },
      ],
    });
    expect(scope.newTestFiles).toEqual(['src/pages/NewPage.test.tsx']);
    expect(scope.changedModules).toEqual(['src/data/jobs.ts', 'src/pages/NewPage.tsx']);
  });

  it('excludes paths matching exclude globs', () => {
    const scope = resolveGitScope({
      config: {
        ...DEFAULT_CONFIG,
        exclude: ['src/__mocks__/**', '**/setup.ts'],
      },
      entries: [
        { status: 'A', path: 'src/__mocks__/api.test.ts' },
        { status: 'A', path: 'src/utils/math.test.ts' },
        { status: 'M', path: 'src/__mocks__/api.ts' },
      ],
    });
    expect(scope.newTestFiles).toEqual(['src/utils/math.test.ts']);
    expect(scope.changedModules).toEqual([]);
  });

  it('treats renames as added at the new path', () => {
    const scope = resolveGitScope({
      config: DEFAULT_CONFIG,
      entries: [{ status: 'R', path: 'src/foo.test.ts', oldPath: 'src/bar.test.ts' }],
    });
    expect(scope.newTestFiles).toEqual(['src/foo.test.ts']);
  });
});
