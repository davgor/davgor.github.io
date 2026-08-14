import { describe, it, expect } from 'vitest';
import { generateMutants, scoreMutations, runMutationGate } from '../src/gates/mutationGate.js';
import { DEFAULT_CONFIG } from '../src/config.js';

const source = `
export function clamp(n: number, min: number, max: number): number {
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n + 0;
}
`;

describe('generateMutants', () => {
  it('produces conditional, operator, and return mutants', () => {
    const mutants = generateMutants('src/clamp.ts', source);
    expect(mutants.length).toBeGreaterThan(0);
    const kinds = new Set(mutants.map((m) => m.kind));
    expect(kinds.has('conditional-inversion') || kinds.has('operator-swap')).toBe(true);
    expect(mutants.every((m) => m.mutatedSource !== source)).toBe(true);
    expect(mutants.every((m) => m.file === 'src/clamp.ts')).toBe(true);
  });
});

describe('scoreMutations', () => {
  it('computes kill rate and pass against threshold', () => {
    const result = scoreMutations({
      killed: 3,
      survived: 1,
      minScore: 75,
      survivors: [{ file: 'a.ts', line: 1, description: 'x' }],
      modules: ['a.ts'],
    });
    expect(result.score).toBe(75);
    expect(result.pass).toBe(true);
  });

  it('fails below threshold and treats zero mutants as pass with 100', () => {
    expect(
      scoreMutations({
        killed: 1,
        survived: 1,
        minScore: 75,
        survivors: [],
        modules: ['a.ts'],
      }).pass
    ).toBe(false);
    const empty = scoreMutations({
      killed: 0,
      survived: 0,
      minScore: 75,
      survivors: [],
      modules: [],
    });
    expect(empty.pass).toBe(true);
    expect(empty.score).toBe(100);
  });
});

describe('runMutationGate', () => {
  it('kills mutants when the runner reports test failure', async () => {
    const gate = await runMutationGate({
      config: DEFAULT_CONFIG,
      modules: [{ path: 'src/clamp.ts', source }],
      relatedTests: ['src/clamp.test.ts'],
      applyAndTest: async ({ mutatedSource }) => {
        // "tests" fail (kill) when mutation removes the < check
        const killed = !mutatedSource.includes('n < min');
        return { ok: !killed, error: killed ? 'expected fail' : undefined };
      },
    });
    expect(gate.total).toBeGreaterThan(0);
    expect(gate.killed + gate.survived).toBe(gate.total);
  });
});
