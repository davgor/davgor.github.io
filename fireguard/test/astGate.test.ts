import { describe, it, expect } from 'vitest';
import { analyzeTestSource, runAstGate } from '../src/gates/astGate.js';
import { DEFAULT_CONFIG } from '../src/config.js';

const solidSource = `
import { describe, it, expect } from 'vitest';
import { add } from './add';

describe('add', () => {
  it('adds positives', () => {
    expect(add(2, 3)).toBe(5);
  });
  it('adds negatives', () => {
    expect(add(-1, -1)).toBe(-2);
  });
});
`;

const slopSource = `
import { describe, it, expect, vi } from 'vitest';

const mockAdd = vi.fn(() => 5);
const mockSub = vi.fn(() => 0);
const mockMul = vi.fn(() => 0);
vi.mock('./add', () => ({ add: mockAdd }));
vi.spyOn(console, 'log');

describe('add', () => {
  it('calls mock', () => {
    mockAdd(1, 2);
    mockSub(1, 1);
    mockMul(2, 2);
    expect(mockAdd).toHaveBeenCalled();
  });
  it('coverage padding', () => {
    mockAdd(0, 0);
  });
});
`;

describe('analyzeTestSource', () => {
  it('counts asserts and zero mocks for solid tests', () => {
    const result = analyzeTestSource('solid.test.ts', solidSource);
    expect(result.assertionCount).toBe(2);
    expect(result.mockCount).toBe(0);
    expect(result.tautologicalCount).toBe(0);
    expect(result.emptyTests).toHaveLength(0);
  });

  it('flags over-mocking, tautologies, and empty tests in slop', () => {
    const result = analyzeTestSource('slop.test.ts', slopSource);
    expect(result.mockCount).toBeGreaterThan(result.assertionCount);
    expect(result.tautologicalCount).toBeGreaterThan(0);
    expect(result.emptyTests.some((t) => t.name.includes('coverage padding'))).toBe(true);
  });
});

describe('runAstGate', () => {
  it('fails when mock ratio exceeds threshold', () => {
    const gate = runAstGate({
      config: DEFAULT_CONFIG,
      files: [{ path: 'slop.test.ts', source: slopSource }],
    });
    expect(gate.pass).toBe(false);
    expect(gate.findings.some((f) => f.rule === 'mock-ratio')).toBe(true);
    expect(gate.findings.some((f) => f.rule === 'tautology-ratio')).toBe(true);
    expect(gate.findings.some((f) => f.rule === 'empty-test')).toBe(true);
  });

  it('passes solid tests', () => {
    const gate = runAstGate({
      config: DEFAULT_CONFIG,
      files: [{ path: 'solid.test.ts', source: solidSource }],
    });
    expect(gate.pass).toBe(true);
    expect(gate.findings).toHaveLength(0);
  });

  it('fails files with zero assertions', () => {
    const gate = runAstGate({
      config: DEFAULT_CONFIG,
      files: [
        {
          path: 'empty.test.ts',
          source: `import { it } from 'vitest';\nit('noop', () => { const x = 1; });`,
        },
      ],
    });
    expect(gate.pass).toBe(false);
    expect(gate.findings.some((f) => f.rule === 'min-assertions')).toBe(true);
  });
});
