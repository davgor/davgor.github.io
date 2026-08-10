import { minimatch } from 'minimatch';
import type { DiffEntry, FireguardConfig, GitScope } from './types.js';

function matchesAny(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => minimatch(path, pattern, { dot: true, matchBase: false }));
}

function isTestFile(path: string, config: FireguardConfig): boolean {
  return matchesAny(path, config.include) && !matchesAny(path, config.exclude);
}

function isProductionModule(path: string, config: FireguardConfig): boolean {
  if (matchesAny(path, config.exclude)) return false;
  if (isTestFile(path, config)) return false;
  if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(path)) return false;
  if (path.endsWith('.d.ts')) return false;
  if (path.includes('e2e/')) return false;
  if (path.includes('fireguard/')) return false;
  // Test helpers (render wrappers, setup) are not production modules.
  if (path.startsWith('src/test/')) return false;
  // Prefer src/ modules; still allow other app roots when included by convention
  return path.startsWith('src/') || path.startsWith('lib/') || path.startsWith('app/');
}

export function resolveGitScope(options: {
  config: FireguardConfig;
  entries: DiffEntry[];
}): GitScope {
  const gradedTestFiles: string[] = [];
  const changedModules: string[] = [];

  for (const entry of options.entries) {
    if (entry.status === 'D') continue;
    const path = entry.path;

    // Grade added AND modified unit tests so agents cannot evade by editing existing files.
    if (
      (entry.status === 'A' ||
        entry.status === 'M' ||
        entry.status === 'R' ||
        entry.status === 'C') &&
      isTestFile(path, options.config)
    ) {
      gradedTestFiles.push(path);
    }

    if (
      (entry.status === 'A' ||
        entry.status === 'M' ||
        entry.status === 'R' ||
        entry.status === 'C') &&
      isProductionModule(path, options.config)
    ) {
      changedModules.push(path);
    }
  }

  return {
    gradedTestFiles: [...new Set(gradedTestFiles)].sort(),
    changedModules: [...new Set(changedModules)].sort(),
  };
}

/** Parse `git diff --name-status` output. */
export function parseNameStatus(output: string): DiffEntry[] {
  const entries: DiffEntry[] = [];
  for (const line of output.split('\n')) {
    const trimmed = line.trimEnd();
    if (!trimmed) continue;
    const parts = trimmed.split('\t');
    const statusRaw = parts[0] ?? '';
    const status = statusRaw[0] as DiffEntry['status'];
    if (status === 'R' || status === 'C') {
      entries.push({
        status,
        oldPath: parts[1],
        path: parts[2] ?? parts[1] ?? '',
      });
      continue;
    }
    if (parts[1]) {
      entries.push({ status, path: parts[1] });
    }
  }
  return entries;
}
