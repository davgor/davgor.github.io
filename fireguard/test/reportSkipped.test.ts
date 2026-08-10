import { describe, it, expect } from 'vitest';
import { formatHumanReport } from '../src/report.js';
import type { FireguardReport } from '../src/types.js';

describe('formatHumanReport skipped', () => {
  it('includes skip reason and grade for empty scope runs', () => {
    const report: FireguardReport = {
      grade: { letter: 'A', score: 100, reasons: ['no graded unit tests to evaluate'] },
      gates: {},
      scope: { baseRef: 'main', gradedTestFiles: [], changedModules: [] },
      skipped: true,
      skipReason: 'No added/modified unit tests vs base ref',
    };
    const text = formatHumanReport(report);
    expect(text).toContain('FIREGUARD GRADE: A');
    expect(text).toContain('Skipped: No added/modified unit tests vs base ref');
  });
});
