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

  const scopePayload = {
    baseRef: deps.config.baseRef,
    gradedTestFiles: scope.gradedTestFiles,
    changedModules: scope.changedModules,
  };

  // Fail closed: production module changes without graded test updates cannot earn a free A.
  if (scope.gradedTestFiles.length === 0 && scope.changedModules.length > 0) {
    return {
      grade: {
        letter: 'F',
        score: 0,
        reasons: ['production modules changed without graded unit test updates'],
      },
      gates: {},
      scope: scopePayload,
      skipped: false,
      skipReason: undefined,
    };
  }

  if (scope.gradedTestFiles.length === 0) {
    return {
      grade: {
        letter: 'A',
        score: 100,
        reasons: ['no graded unit tests to evaluate'],
      },
      gates: {},
      scope: scopePayload,
      skipped: true,
      skipReason: 'No added/modified unit tests vs base ref',
    };
  }

  const gates: FireguardReport['gates'] = {};

  const files = await Promise.all(
    scope.gradedTestFiles.map(async (path) => ({
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
    files: scope.gradedTestFiles,
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
      relatedTests: scope.gradedTestFiles,
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
