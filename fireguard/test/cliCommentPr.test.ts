import { describe, it, expect, vi } from 'vitest';
import { runCli } from '../src/cli.js';
import { FIREGUARD_COMMENT_MARKER } from '../src/prComment.js';
import { DEFAULT_CONFIG } from '../src/config.js';

describe('runCli --comment-pr', () => {
  it('posts markdown grade comment and still exits 0 for skipped A', async () => {
    const postComment = vi.fn(async () => 'created' as const);
    const writes: Record<string, string> = {};
    let out = '';

    const code = await runCli({
      cwd: process.cwd(),
      argv: ['--comment-pr', '--markdown-out', 'fg.md'],
      env: {
        GITHUB_TOKEN: 't',
        GITHUB_REPOSITORY: 'davgor/davgor.github.io',
        FIREGUARD_PULL_NUMBER: '5',
        GITHUB_STEP_SUMMARY: 'summary.md',
      },
      stdout: (text) => {
        out += text;
      },
      stderr: () => undefined,
      writeFileSyncFn: (path, data) => {
        writes[path] = data;
      },
      postComment,
      // Force skip path by using a fake config load via env base ref that yields no new tests:
      // runCli uses real git diff — on this branch there are no new src unit tests, so skip is fine.
    });

    expect(code).toBe(0);
    expect(postComment).toHaveBeenCalledTimes(1);
    const firstCall = postComment.mock.calls[0] as unknown as [
      { body: string; pullNumber: number; repository: string; token: string },
    ];
    const body = firstCall[0].body;
    expect(body).toContain(FIREGUARD_COMMENT_MARKER);
    expect(body).toContain('Fireguard grade:');
    expect(writes['fg.md']).toContain(FIREGUARD_COMMENT_MARKER);
    expect(writes['summary.md']).toContain('Fireguard grade:');
    expect(out).toMatch(/PR comment created/);
    void DEFAULT_CONFIG;
  });

  it('returns 2 when comment-pr lacks token/repo/pr', async () => {
    const code = await runCli({
      cwd: process.cwd(),
      argv: ['--comment-pr'],
      env: {},
      stdout: () => undefined,
      stderr: () => undefined,
      postComment: vi.fn(async () => 'created' as const),
    });
    expect(code).toBe(2);
  });
});
