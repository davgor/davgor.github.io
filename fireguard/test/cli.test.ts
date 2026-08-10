import { describe, it, expect } from 'vitest';
import { runCli } from '../src/cli.js';

describe('runCli', () => {
  it('prints help and exits 0', async () => {
    let out = '';
    const code = await runCli({
      cwd: process.cwd(),
      argv: ['--help'],
      stdout: (text) => {
        out += text;
      },
      stderr: () => undefined,
    });
    expect(code).toBe(0);
    expect(out).toContain('fireguard');
    expect(out).toContain('Exit codes');
    expect(out).toContain('--comment-pr');
  });
});
