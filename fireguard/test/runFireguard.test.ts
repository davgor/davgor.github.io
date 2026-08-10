import { describe, it, expect, vi } from 'vitest';
import { runFireguard } from '../src/runFireguard.js';
import { DEFAULT_CONFIG } from '../src/config.js';

describe('runFireguard', () => {
  it('fails closed with F when modules change without graded test updates', async () => {
    const report = await runFireguard({
      config: DEFAULT_CONFIG,
      getDiffEntries: async () => [{ status: 'M', path: 'src/data/jobs.ts' }],
      readFile: async () => '',
      runOnce: async () => ({ ok: true }),
      applyAndTest: async () => ({ ok: false }),
    });
    expect(report.skipped).toBe(false);
    expect(report.grade.letter).toBe('F');
    expect(report.grade.reasons.join(' ')).toMatch(/without graded unit test/i);
    expect(report.gates.mutation).toBeUndefined();
  });

  it('grades modified unit tests (not only newly added files)', async () => {
    const solidTest = `
import { describe, it, expect } from 'vitest';
import { add } from './add';
describe('add', () => {
  it('works', () => { expect(add(1, 2)).toBe(3); });
});
`;
    const report = await runFireguard({
      config: {
        ...DEFAULT_CONFIG,
        thresholds: { ...DEFAULT_CONFIG.thresholds, agenticFlakinessRuns: 2 },
      },
      getDiffEntries: async () => [
        { status: 'M', path: 'src/add.test.ts' },
        { status: 'M', path: 'src/add.ts' },
      ],
      readFile: async (path) =>
        path.endsWith('.test.ts')
          ? solidTest
          : 'export function add(a:number,b:number){return a+b;}',
      runOnce: async () => ({ ok: true }),
      applyAndTest: async () => ({ ok: false }),
    });
    expect(report.skipped).toBe(false);
    expect(report.scope.gradedTestFiles).toEqual(['src/add.test.ts']);
    expect(report.gates.ast?.pass).toBe(true);
    expect(report.grade.letter).not.toBe('F');
  });

  it('fail-fasts on AST before flake/mutation', async () => {
    const runOnce = vi.fn(async () => ({ ok: true }));
    const applyAndTest = vi.fn(async () => ({ ok: false }));
    const slop = `
import { it, expect, vi } from 'vitest';
const fn = vi.fn(() => 1);
it('slop', () => { expect(fn()).toBe(1); });
it('empty', () => { fn(); });
`;
    const report = await runFireguard({
      config: DEFAULT_CONFIG,
      getDiffEntries: async () => [
        { status: 'A', path: 'src/slop.test.ts' },
        { status: 'A', path: 'src/slop.ts' },
      ],
      readFile: async (path) => (path.endsWith('.test.ts') ? slop : 'export const x = 1;'),
      runOnce,
      applyAndTest,
    });
    expect(report.grade.letter).toBe('F');
    expect(report.gates.ast?.pass).toBe(false);
    expect(report.gates.flake).toBeUndefined();
    expect(runOnce).not.toHaveBeenCalled();
    expect(applyAndTest).not.toHaveBeenCalled();
  });

  it('runs flake then mutation and returns a passing grade for solid work', async () => {
    const solidTest = `
import { describe, it, expect } from 'vitest';
import { add } from './add';
describe('add', () => {
  it('works', () => { expect(add(1, 2)).toBe(3); });
});
`;
    const solidMod = `
export function add(a: number, b: number): number {
  return a + b;
}
`;
    const report = await runFireguard({
      config: {
        ...DEFAULT_CONFIG,
        thresholds: { ...DEFAULT_CONFIG.thresholds, agenticFlakinessRuns: 3 },
      },
      getDiffEntries: async () => [
        { status: 'A', path: 'src/add.test.ts' },
        { status: 'A', path: 'src/add.ts' },
      ],
      readFile: async (path) => (path.endsWith('.test.ts') ? solidTest : solidMod),
      runOnce: async () => ({ ok: true }),
      applyAndTest: async () => ({ ok: false }),
    });
    expect(report.gates.ast?.pass).toBe(true);
    expect(report.gates.flake?.pass).toBe(true);
    expect(report.gates.mutation?.pass).toBe(true);
    expect(report.grade.letter).not.toBe('F');
  });
});
