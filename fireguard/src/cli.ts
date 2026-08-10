import { loadConfig } from './config.js';
import {
  createMutationApplier,
  createVitestRunner,
  getGitDiffEntries,
  readWorkspaceFile,
} from './processAdapters.js';
import { formatHumanReport, formatJsonReport } from './report.js';
import { runFireguard } from './runFireguard.js';

export interface CliOptions {
  cwd?: string;
  argv?: string[];
  stdout?: (text: string) => void;
  stderr?: (text: string) => void;
}

export async function runCli(options: CliOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const argv = options.argv ?? process.argv.slice(2);
  const stdout = options.stdout ?? ((text: string) => process.stdout.write(text));
  const stderr = options.stderr ?? ((text: string) => process.stderr.write(text));

  const json = argv.includes('--json');
  const help = argv.includes('--help') || argv.includes('-h');

  if (help) {
    stdout(`fireguard — deterministic unit-test quality grader

Usage:
  fireguard [--json]

Grades NEW unit tests (git diff vs baseRef, default main) through:
  Gate 1  AST mock/assert/tautology/empty checks
  Gate 2  Flakiness (default 100 isolated runs, 0% flake)
  Gate 3  Mutation score on changed production modules (≥75%)

Exit codes:
  0  pass (grade not F)
  1  quality failure (grade F)
  2  tool error
`);
    return 0;
  }

  try {
    const config = loadConfig({ cwd });
    const runOnce = createVitestRunner({ cwd, config });
    const applyAndTest = createMutationApplier({ cwd, runOnce });

    const report = await runFireguard({
      config,
      getDiffEntries: () => getGitDiffEntries({ cwd, baseRef: config.baseRef }),
      readFile: (path) => readWorkspaceFile(cwd, path),
      runOnce,
      applyAndTest,
    });

    if (json) {
      stdout(formatJsonReport(report));
    } else {
      stdout(`${formatHumanReport(report)}\n`);
    }

    if (report.grade.letter === 'F') {
      return 1;
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    stderr(`fireguard error: ${message}\n`);
    return 2;
  }
}
