import { describe, it, expect } from 'vitest';
import { computeGrade } from '../src/grade.js';
import type { AstGateResult, FlakeGateResult, MutationGateResult } from '../src/types.js';

function ast(partial: Partial<AstGateResult> & { pass: boolean }): AstGateResult {
  return {
    name: 'ast',
    assertionCount: 10,
    mockCount: 0,
    mockToAssertRatio: 0,
    tautologicalCount: 0,
    tautologicalRatio: 0,
    emptyTests: [],
    findings: [],
    ...partial,
  };
}

function flake(pass = true): FlakeGateResult {
  return {
    name: 'flake',
    pass,
    runs: 100,
    configuredRuns: 100,
    failures: pass ? 0 : 1,
    flakeRate: pass ? 0 : 0.01,
    files: ['a.test.ts'],
    failedRuns: pass ? [] : [{ run: 1, error: 'x' }],
    failFast: true,
  };
}

function mutation(partial: Partial<MutationGateResult> & { pass: boolean }): MutationGateResult {
  return {
    name: 'mutation',
    killed: 8,
    survived: 2,
    total: 10,
    score: 80,
    survivors: [],
    modules: ['src/foo.ts'],
    ...partial,
  };
}

describe('computeGrade bands', () => {
  it('scores B for solid but not perfect metrics', () => {
    const grade = computeGrade({
      ast: ast({ pass: true, mockToAssertRatio: 0.5, tautologicalRatio: 0.05 }),
      flake: flake(true),
      mutation: mutation({ pass: true, score: 85, killed: 17, survived: 3, total: 20 }),
    });
    expect(grade.letter).toBe('B');
    expect(grade.score).toBeGreaterThanOrEqual(80);
    expect(grade.score).toBeLessThan(90);
  });

  it('scores A when mutation and AST are omitted after hard passes elsewhere', () => {
    // Only flake+ast present at excellent levels already covered; ensure missing
    // mutation still can reach A via bonuses.
    const grade = computeGrade({
      ast: ast({ pass: true, mockToAssertRatio: 0, tautologicalRatio: 0 }),
      flake: flake(true),
    });
    expect(grade.letter).toBe('A');
  });
});
