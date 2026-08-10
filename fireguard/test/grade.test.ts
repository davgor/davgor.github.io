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

function flake(partial: Partial<FlakeGateResult> & { pass: boolean }): FlakeGateResult {
  return {
    name: 'flake',
    runs: 100,
    configuredRuns: 100,
    failures: 0,
    flakeRate: 0,
    files: ['a.test.ts'],
    failedRuns: [],
    failFast: true,
    ...partial,
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

describe('computeGrade', () => {
  it('forces F when any hard gate fails', () => {
    const grade = computeGrade({
      ast: ast({ pass: false, findings: [{ file: 'a.ts', line: 1, rule: 'empty', message: 'x' }] }),
      flake: flake({ pass: true }),
      mutation: mutation({ pass: true }),
    });
    expect(grade.letter).toBe('F');
    expect(grade.score).toBe(0);
    expect(grade.reasons.some((r) => r.includes('ast'))).toBe(true);
  });

  it('forces F on flake failure', () => {
    const grade = computeGrade({
      ast: ast({ pass: true }),
      flake: flake({ pass: false, failures: 1, flakeRate: 0.01 }),
      mutation: mutation({ pass: true }),
    });
    expect(grade.letter).toBe('F');
    expect(grade.score).toBe(0);
  });

  it('forces F when mutation score is below threshold', () => {
    const grade = computeGrade({
      ast: ast({ pass: true }),
      flake: flake({ pass: true }),
      mutation: mutation({ pass: false, score: 60, killed: 6, survived: 4, total: 10 }),
    });
    expect(grade.letter).toBe('F');
    expect(grade.score).toBe(0);
  });

  it('scores high A when gates pass with excellent metrics', () => {
    const grade = computeGrade({
      ast: ast({ pass: true, mockToAssertRatio: 0, tautologicalRatio: 0 }),
      flake: flake({ pass: true }),
      mutation: mutation({ pass: true, score: 100, killed: 10, survived: 0, total: 10 }),
    });
    expect(grade.letter).toBe('A');
    expect(grade.score).toBeGreaterThanOrEqual(90);
  });

  it('scores around C when gates only meet thresholds', () => {
    const grade = computeGrade({
      ast: ast({ pass: true, mockToAssertRatio: 1.5, tautologicalRatio: 0.1 }),
      flake: flake({ pass: true }),
      mutation: mutation({ pass: true, score: 75, killed: 3, survived: 1, total: 4 }),
    });
    expect(grade.letter).toBe('C');
    expect(grade.score).toBeGreaterThanOrEqual(70);
    expect(grade.score).toBeLessThan(80);
  });
});
