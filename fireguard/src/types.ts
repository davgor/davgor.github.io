export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface FireguardThresholds {
  maxMockToAssertRatio: number;
  maxTautologicalRatio: number;
  minAssertionsPerFile: number;
  minMutationScore: number;
  flakinessRuns: number;
  agenticFlakinessRuns: number;
  maxFlakeRate: number;
}

export interface FireguardConfig {
  thresholds: FireguardThresholds;
  include: string[];
  exclude: string[];
  baseRef: string;
  testCommand: string;
}

export interface AstFinding {
  file: string;
  line: number;
  rule: string;
  message: string;
}

export interface AstGateResult {
  name: 'ast';
  pass: boolean;
  assertionCount: number;
  mockCount: number;
  mockToAssertRatio: number;
  tautologicalCount: number;
  tautologicalRatio: number;
  emptyTests: Array<{ file: string; line: number; name: string }>;
  findings: AstFinding[];
}

export interface FlakeGateResult {
  name: 'flake';
  pass: boolean;
  runs: number;
  failures: number;
  flakeRate: number;
  files: string[];
  failedRuns: Array<{ run: number; error: string }>;
}

export interface MutationSurvivor {
  file: string;
  line: number;
  description: string;
}

export interface MutationGateResult {
  name: 'mutation';
  pass: boolean;
  killed: number;
  survived: number;
  total: number;
  score: number;
  survivors: MutationSurvivor[];
  modules: string[];
}

export type GateResult = AstGateResult | FlakeGateResult | MutationGateResult;

export interface GradeResult {
  letter: LetterGrade;
  score: number;
  reasons: string[];
}

export interface FireguardReport {
  grade: GradeResult;
  gates: {
    ast?: AstGateResult;
    flake?: FlakeGateResult;
    mutation?: MutationGateResult;
  };
  scope: {
    baseRef: string;
    newTestFiles: string[];
    changedModules: string[];
  };
  skipped: boolean;
  skipReason?: string;
}

export interface GitScope {
  newTestFiles: string[];
  changedModules: string[];
}

export type DiffStatus = 'A' | 'M' | 'D' | 'R' | 'C' | 'T' | 'U' | '?';

export interface DiffEntry {
  status: DiffStatus;
  path: string;
  /** For renames, the new path is `path`; old may be provided. */
  oldPath?: string;
}

export interface RunOnceResult {
  ok: boolean;
  error?: string;
}

export type TestRunner = (files: string[]) => Promise<RunOnceResult>;
