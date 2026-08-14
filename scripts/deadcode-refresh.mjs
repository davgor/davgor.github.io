/**
 * Rewrite .tsprune-ignore from current ts-prune findings.
 * Use after intentional export moves/deletes so `npm run deadcode` stays green.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeTsPruneLine } from './deadcode-check.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IGNORE_PATH = join(ROOT, '.tsprune-ignore');
const PROJECTS = ['tsconfig.json'];

/** @param {string} project */
function runTsPrune(project) {
  const result = spawnSync('npx', ['ts-prune', '--project', project], {
    cwd: ROOT,
    encoding: 'utf8',
    shell: true,
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    throw new Error(stderr || `ts-prune failed for ${project} with exit code ${result.status}`);
  }
  return result.stdout
    .split(/\r?\n/)
    .map((line) => normalizeTsPruneLine(line))
    .filter(Boolean);
}

function main() {
  const findings = new Set();
  for (const project of PROJECTS) {
    for (const line of runTsPrune(project)) {
      findings.add(line);
    }
  }
  const lines = [...findings].sort();
  const header = [
    '# Baseline ignore for ts-prune (one pattern per line)',
    '# Generated from tsconfig.json',
    '# Refresh after export moves/deletes: npm run deadcode:refresh',
    `# Refreshed ${new Date().toISOString().slice(0, 10)} (${lines.length} entries)`,
    '',
  ];
  writeFileSync(IGNORE_PATH, `${header.concat(lines).join('\n')}\n`, 'utf8');
  console.log(`Wrote ${lines.length} entries to .tsprune-ignore`);
}

main();
