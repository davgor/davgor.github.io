export { DEFAULT_CONFIG, loadConfig, mergeConfig } from './config.js';
export { computeGrade } from './grade.js';
export { resolveGitScope, parseNameStatus } from './gitScope.js';
export { runAstGate, analyzeTestSource } from './gates/astGate.js';
export { runFlakeGate } from './gates/flakeGate.js';
export { generateMutants, runMutationGate, scoreMutations } from './gates/mutationGate.js';
export { runFireguard } from './runFireguard.js';
export { formatHumanReport, formatJsonReport } from './report.js';
export { runCli } from './cli.js';
export {
  FIREGUARD_COMMENT_MARKER,
  formatPrMarkdown,
  upsertPrComment,
  postPrCommentViaGithub,
  resolvePullNumberFromEvent,
} from './prComment.js';
export type {
  LetterGrade,
  FireguardConfig,
  FireguardReport,
  FireguardThresholds,
  AstGateResult,
  FlakeGateResult,
  MutationGateResult,
  GradeResult,
  GitScope,
  DiffEntry,
} from './types.js';
