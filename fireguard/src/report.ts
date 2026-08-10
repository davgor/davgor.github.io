import type { FireguardReport } from './types.js';

export function formatHumanReport(report: FireguardReport): string {
  const lines: string[] = [];
  lines.push('════════════════════════════════════════');
  lines.push(`FIREGUARD GRADE: ${report.grade.letter} (score ${report.grade.score})`);
  lines.push('════════════════════════════════════════');

  if (report.skipped) {
    lines.push(`Skipped: ${report.skipReason ?? 'nothing to grade'}`);
    return lines.join('\n');
  }

  lines.push(`Base ref: ${report.scope.baseRef}`);
  lines.push(`Graded tests: ${report.scope.gradedTestFiles.join(', ') || '(none)'}`);
  lines.push(`Changed modules: ${report.scope.changedModules.join(', ') || '(none)'}`);
  lines.push('');

  for (const reason of report.grade.reasons) {
    lines.push(`• ${reason}`);
  }
  lines.push('');

  const ast = report.gates.ast;
  if (ast) {
    lines.push(`Gate 1 AST: ${ast.pass ? 'PASS' : 'FAIL'}`);
    lines.push(
      `  asserts=${ast.assertionCount} mocks=${ast.mockCount} ratio=${ast.mockToAssertRatio.toFixed(2)} tautology=${ast.tautologicalRatio.toFixed(2)}`
    );
    for (const finding of ast.findings) {
      lines.push(`  - ${finding.file}:${finding.line} [${finding.rule}] ${finding.message}`);
    }
  }

  const flake = report.gates.flake;
  if (flake) {
    lines.push(`Gate 2 Flake: ${flake.pass ? 'PASS' : 'FAIL'}`);
    lines.push(
      `  executed=${flake.runs}/${flake.configuredRuns} failures=${flake.failures} rate=${flake.flakeRate} failFast=${flake.failFast}`
    );
    for (const failed of flake.failedRuns) {
      lines.push(`  - run #${failed.run}: ${failed.error}`);
    }
  }

  const mutation = report.gates.mutation;
  if (mutation) {
    lines.push(`Gate 3 Mutation: ${mutation.pass ? 'PASS' : 'FAIL'}`);
    lines.push(
      `  score=${mutation.score}% killed=${mutation.killed} survived=${mutation.survived} total=${mutation.total}`
    );
    for (const survivor of mutation.survivors.slice(0, 20)) {
      lines.push(`  - survivor ${survivor.file}:${survivor.line} ${survivor.description}`);
    }
  }

  return lines.join('\n');
}

export function formatJsonReport(report: FireguardReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}
