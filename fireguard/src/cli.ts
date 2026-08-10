import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { loadConfig } from './config.js';
import {
  createMutationApplier,
  createVitestRunner,
  getGitDiffEntries,
  readWorkspaceFile,
} from './processAdapters.js';
import {
  formatPrMarkdown,
  postPrCommentViaGithub,
  resolvePullNumberFromEvent,
} from './prComment.js';
import { formatHumanReport, formatJsonReport } from './report.js';
import { runFireguard, type RunFireguardDeps } from './runFireguard.js';
import type { FireguardReport } from './types.js';

export interface CliOptions {
  cwd?: string;
  argv?: string[];
  env?: Record<string, string | undefined>;
  stdout?: (text: string) => void;
  stderr?: (text: string) => void;
  readFileSyncFn?: (path: string, encoding: 'utf8') => string;
  writeFileSyncFn?: (path: string, data: string) => void;
  appendFileSyncFn?: (path: string, data: string) => void;
  postComment?: typeof postPrCommentViaGithub;
  /** Test seam — overrides the default git/vitest-backed runner. */
  runFireguardFn?: (deps: RunFireguardDeps) => Promise<FireguardReport>;
}

function flagValue(argv: string[], name: string): string | undefined {
  const idx = argv.indexOf(name);
  if (idx === -1) return undefined;
  return argv[idx + 1];
}

export async function runCli(options: CliOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const argv = options.argv ?? process.argv.slice(2);
  const env = options.env ?? process.env;
  const stdout = options.stdout ?? ((text: string) => process.stdout.write(text));
  const stderr = options.stderr ?? ((text: string) => process.stderr.write(text));
  const readFile = options.readFileSyncFn ?? ((path, encoding) => readFileSync(path, encoding));
  const writeFile = options.writeFileSyncFn ?? ((path, data) => writeFileSync(path, data, 'utf8'));
  const appendFile =
    options.appendFileSyncFn ?? ((path, data) => appendFileSync(path, data, 'utf8'));
  const postComment = options.postComment ?? postPrCommentViaGithub;

  const json = argv.includes('--json');
  const commentPr = argv.includes('--comment-pr');
  const help = argv.includes('--help') || argv.includes('-h');
  const markdownOut = flagValue(argv, '--markdown-out');
  const jsonOut = flagValue(argv, '--json-out');

  if (help) {
    stdout(`fireguard — deterministic unit-test quality grader

Usage:
  fireguard [--json] [--comment-pr] [--markdown-out path] [--json-out path]

Grades added or modified unit tests (git diff vs baseRef, default main) through:
  Gate 1  AST mock/assert/tautology/empty checks
  Gate 2  Flakiness (default 100 isolated runs, 0% flake; fail-fast)
  Gate 3  Mutation score on changed production modules (≥75%)

PR integration:
  --comment-pr     Upsert a sticky grade comment on the current GitHub PR
                   (uses GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_EVENT_PATH)
  --markdown-out   Write PR markdown to a file
  --json-out       Write JSON report to a file

Exit codes:
  0  pass (grade not F)
  1  quality failure (grade F)
  2  tool error
`);
    return 0;
  }

  let report: FireguardReport;
  try {
    const config = loadConfig({ cwd, env });
    const runOnce = createVitestRunner({ cwd, config });
    const applyAndTest = createMutationApplier({ cwd, runOnce });
    const deps: RunFireguardDeps = {
      config,
      getDiffEntries: () => getGitDiffEntries({ cwd, baseRef: config.baseRef }),
      readFile: (path) => readWorkspaceFile(cwd, path),
      runOnce,
      applyAndTest,
    };
    const run = options.runFireguardFn ?? runFireguard;
    report = await run(deps);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    stderr(`fireguard error: ${message}\n`);
    return 2;
  }

  if (json) {
    stdout(formatJsonReport(report));
  } else {
    stdout(`${formatHumanReport(report)}\n`);
  }

  const markdown = formatPrMarkdown(report);
  if (markdownOut) {
    writeFile(markdownOut, markdown);
  }
  if (jsonOut) {
    writeFile(jsonOut, formatJsonReport(report));
  }

  const stepSummary = env.GITHUB_STEP_SUMMARY;
  if (stepSummary) {
    try {
      // Append — never truncate other job summary content.
      appendFile(stepSummary, `${markdown}\n`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      stderr(`fireguard warning: could not write GITHUB_STEP_SUMMARY: ${message}\n`);
    }
  }

  if (commentPr) {
    const token = env.GITHUB_TOKEN ?? env.GH_TOKEN;
    const repository = env.GITHUB_REPOSITORY;
    const pullNumber =
      (env.FIREGUARD_PULL_NUMBER ? Number(env.FIREGUARD_PULL_NUMBER) : undefined) ??
      resolvePullNumberFromEvent(env.GITHUB_EVENT_PATH, (path) => readFile(path, 'utf8'));

    const onPullRequest =
      env.GITHUB_EVENT_NAME === 'pull_request' ||
      env.GITHUB_EVENT_NAME === 'pull_request_target' ||
      Boolean(env.FIREGUARD_PULL_NUMBER);

    if (!token || !repository || !pullNumber) {
      if (env.GITHUB_ACTIONS === 'true' && !onPullRequest) {
        stderr('fireguard: --comment-pr skipped (not a pull_request event)\n');
      } else {
        stderr(
          'fireguard error: --comment-pr requires GITHUB_TOKEN, GITHUB_REPOSITORY, and a pull request number\n'
        );
        return 2;
      }
    } else {
      try {
        const action = await postComment({
          token,
          repository,
          pullNumber,
          body: markdown,
        });
        stdout(`fireguard: PR comment ${action} (grade ${report.grade.letter})\n`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        stderr(`fireguard error: failed to post PR comment: ${message}\n`);
        return 2;
      }
    }
  }

  if (report.grade.letter === 'F') {
    return 1;
  }
  return 0;
}
