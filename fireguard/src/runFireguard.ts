import { runAstGate } from './gates/astGate.js';
import { runFlakeGate } from './gates/flakeGate.js';
import { runMutationGate } from './gates/mutationGate.js';
import { computeGrade } from './grade.js';
import { resolveGitScope } from './gitScope.js';
import type {
  DiffEntry,
  FireguardConfig,
  FireguardReport,
  RunOnceResult,
  TestRunner,
} from './types.js';

export interface RunFireguardDeps {
  config: FireguardConfig;
  getDiffEntries: () => Promise<DiffEntry[]>;
  readFile: (path: string) => Promise<string>;
  runOnce: TestRunner;
  applyAndTest: (input: {
    file: string;
    originalSource: string;
    mutatedSource: string;
    relatedTests: string[];
  }) => Promise<RunOnceResult>;
}

export async function runFireguard(deps: RunFireguardDeps): Promise<FireguardReport> {
  const entries = await deps.getDiffEntries();
  const scope = resolveGitScope({ config: deps.config, entries });

  // Agentic grading targets NEW unit tests. Module-only diffs are not graded here
  // (no new test payload). Mutation requires both new tests and changed modules.
  if (scope.newTestFiles.length === 0) {
    return {
      grade: {
        letter: 'A',
        score: 100,
        reasons: ['no new tests to grade'],
      },
      gates: {},
      scope: {
        baseRef: deps.config.baseRef,
        newTestFiles: [],
        changedModules: scope.changedModules,
      },
      skipped: true,
      skipReason: 'No new unit tests vs base ref',
    };
  }

  const gates: FireguardReport['gates'] = {};
  const scopePayload = {
    baseRef: deps.config.baseRef,
    newTestFiles: scope.newTestFiles,
    changedModules: scope.changedModules,
  };

  const files = await Promise.all(
    scope.newTestFiles.map(async (path) => ({
      path,
      source: await deps.readFile(path),
    }))
  );
  gates.ast = runAstGate({ config: deps.config, files });
  if (!gates.ast.pass) {
    return {
      grade: computeGrade(gates),
      gates,
      scope: scopePayload,
      skipped: false,
    };
  }

  gates.flake = await runFlakeGate({
    config: deps.config,
    files: scope.newTestFiles,
    runOnce: deps.runOnce,
  });
  if (!gates.flake.pass) {
    return {
      grade: computeGrade(gates),
      gates,
      scope: scopePayload,
      skipped: false,
    };
  }

  if (scope.changedModules.length > 0) {
    const modules = await Promise.all(
      scope.changedModules.map(async (path) => ({
        path,
        source: await deps.readFile(path),
      }))
    );
    gates.mutation = await runMutationGate({
      config: deps.config,
      modules,
      relatedTests: scope.newTestFiles,
      applyAndTest: deps.applyAndTest,
    });
  }

  return {
    grade: computeGrade(gates),
    gates,
    scope: scopePayload,
    skipped: false,
  };
}
