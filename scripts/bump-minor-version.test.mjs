import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { bumpMinorVersion } from './bump-minor-version.mjs';

describe('bumpMinorVersion', () => {
  it('increments minor and resets patch to 0', () => {
    const dir = mkdtempSync(join(tmpdir(), 'bump-version-'));
    const pkgPath = join(dir, 'package.json');
    const lockPath = join(dir, 'package-lock.json');
    writeFileSync(pkgPath, `${JSON.stringify({ name: 'test', version: '0.4.7' }, null, 2)}\n`);
    writeFileSync(
      lockPath,
      `${JSON.stringify({ name: 'test', version: '0.4.7', packages: { '': { version: '0.4.7' } } }, null, 2)}\n`
    );

    expect(bumpMinorVersion(pkgPath, lockPath)).toBe('0.5.0');
    expect(JSON.parse(readFileSync(pkgPath, 'utf8')).version).toBe('0.5.0');
    expect(JSON.parse(readFileSync(lockPath, 'utf8')).version).toBe('0.5.0');
  });

  it('throws on invalid semver', () => {
    const dir = mkdtempSync(join(tmpdir(), 'bump-version-'));
    const pkgPath = join(dir, 'package.json');
    writeFileSync(pkgPath, `${JSON.stringify({ version: 'not-semver' })}\n`);
    expect(() => bumpMinorVersion(pkgPath)).toThrow(/Invalid semver/);
  });
});
