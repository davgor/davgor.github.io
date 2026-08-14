import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/**
 * Bumps package.json minor version (x.Y.0) and syncs package-lock.json.
 * Prints the new version to stdout for CI.
 */
export function bumpMinorVersion(pkgPath = 'package.json', lockPath = 'package-lock.json') {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const parts = String(pkg.version)
    .split('.')
    .map((part) => Number.parseInt(part, 10));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    throw new Error(`Invalid semver in ${pkgPath}: ${pkg.version}`);
  }
  const [major, minor] = parts;
  const nextVersion = `${major}.${minor + 1}.0`;
  pkg.version = nextVersion;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  try {
    const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
    lock.version = nextVersion;
    if (lock.packages?.['']) {
      lock.packages[''].version = nextVersion;
    }
    writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  } catch {
    // package-lock may be absent in some environments
  }

  return nextVersion;
}

const isCli =
  typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  process.stdout.write(bumpMinorVersion());
}
