import { describe, it, expect, vi } from 'vitest';
import { FIREGUARD_COMMENT_MARKER, formatPrMarkdown, upsertPrComment } from '../src/prComment.js';
import type { FireguardReport } from '../src/types.js';

const report: FireguardReport = {
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

describe('formatPrMarkdown', () => {
  it('includes sticky marker, grade, and actionable findings', () => {
    const md = formatPrMarkdown(report);
    expect(md).toContain(FIREGUARD_COMMENT_MARKER);
    expect(md).toContain('## Fireguard grade: **F**');
    expect(md).toContain('score 0');
    expect(md).toContain('src/x.test.ts:12');
    expect(md).toContain('mock-ratio');
  });

  it('states skip reason when nothing was graded', () => {
    const md = formatPrMarkdown({
      ...report,
      grade: { letter: 'A', score: 100, reasons: ['no new tests to grade'] },
      gates: {},
      skipped: true,
      skipReason: 'No new unit tests vs base ref',
    });
    expect(md).toContain('## Fireguard grade: **A**');
    expect(md).toContain('No new unit tests vs base ref');
  });
});

describe('upsertPrComment', () => {
  it('updates an existing fireguard comment when marker is present', async () => {
    const updateComment = vi.fn(async () => undefined);
    const createComment = vi.fn(async () => undefined);
    await upsertPrComment({
      body: formatPrMarkdown(report),
      listComments: async () => [
        { id: 10, body: 'unrelated' },
        { id: 42, body: `${FIREGUARD_COMMENT_MARKER}\nold` },
      ],
      createComment,
      updateComment,
    });
    expect(updateComment).toHaveBeenCalledWith(42, expect.stringContaining('Fireguard grade'));
    expect(createComment).not.toHaveBeenCalled();
  });

  it('creates a comment when none exists yet', async () => {
    const updateComment = vi.fn(async () => undefined);
    const createComment = vi.fn(async () => undefined);
    await upsertPrComment({
      body: formatPrMarkdown(report),
      listComments: async () => [{ id: 1, body: 'hello' }],
      createComment,
      updateComment,
    });
    expect(createComment).toHaveBeenCalledWith(expect.stringContaining(FIREGUARD_COMMENT_MARKER));
    expect(updateComment).not.toHaveBeenCalled();
  });
});
