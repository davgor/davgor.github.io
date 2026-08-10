import { describe, it, expect } from 'vitest';
import { formatHumanReport } from '../src/report.js';
import type { FireguardReport } from '../src/types.js';

describe('formatHumanReport skipped', () => {
  it('includes skip reason and grade for empty scope runs', () => {
    const report: FireguardReport = {
      grade: { letter: 'A', score: 100, reasons: ['no new tests to grade'] },
      gates: {},
      scope: { baseRef: 'main', newTestFiles: [], changedModules: [] },
      skipped: true,
      skipReason: 'No new unit tests vs base ref',
    };
    const text = formatHumanReport(report);
    expect(text).toContain('FIREGUARD GRADE: A');
    expect(text).toContain('Skipped: No new unit tests vs base ref');
  });
});
