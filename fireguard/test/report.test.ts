import { describe, it, expect } from 'vitest';
import { formatHumanReport, formatJsonReport } from '../src/report.js';
import type { FireguardReport } from '../src/types.js';

const failingReport: FireguardReport = {
  grade: { letter: 'F', score: 0, reasons: ['ast gate failed'] },
  gates: {
    ast: {
      name: 'ast',
      pass: false,
      assertionCount: 1,
      mockCount: 4,
      mockToAssertRatio: 4,
      tautologicalCount: 1,
      tautologicalRatio: 1,
      emptyTests: [],
      findings: [
        {
          file: 'src/x.test.ts',
          line: 12,
          rule: 'mock-ratio',
          message: 'mock/assert ratio 4 > 1.5',
        },
      ],
    },
  },
  scope: {
    baseRef: 'main',
    gradedTestFiles: ['src/x.test.ts'],
    changedModules: ['src/x.ts'],
  },
  skipped: false,
};

describe('report', () => {
  it('formats a human report that surfaces the letter grade', () => {
    const text = formatHumanReport(failingReport);
    expect(text).toContain('FIREGUARD GRADE: F');
    expect(text).toContain('score 0');
    expect(text).toContain('src/x.test.ts:12');
    expect(text).toContain('mock-ratio');
  });

  it('formats JSON with grade and gates', () => {
    const json = JSON.parse(formatJsonReport(failingReport)) as FireguardReport;
    expect(json.grade.letter).toBe('F');
    expect(json.gates.ast?.pass).toBe(false);
  });
});
