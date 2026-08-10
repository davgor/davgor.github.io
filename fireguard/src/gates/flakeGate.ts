import type { FireguardConfig, FlakeGateResult, TestRunner } from '../types.js';

export async function runFlakeGate(options: {
  config: FireguardConfig;
  files: string[];
  runOnce: TestRunner;
  /** When true (default), stop after the first failure. Metrics still report configuredRuns. */
  failFast?: boolean;
}): Promise<FlakeGateResult> {
  const files = options.files;
  const failFast = options.failFast ?? true;
  const configuredRuns = options.config.thresholds.agenticFlakinessRuns;

  if (files.length === 0) {
    return {
      name: 'flake',
      pass: true,
      runs: 0,
      configuredRuns,
      failures: 0,
      flakeRate: 0,
      files: [],
      failedRuns: [],
      failFast,
    };
  }

  const failedRuns: FlakeGateResult['failedRuns'] = [];
  let executed = 0;

  for (let i = 1; i <= configuredRuns; i += 1) {
    executed = i;
    const result = await options.runOnce(files);
    if (!result.ok) {
      failedRuns.push({ run: i, error: result.error ?? 'test run failed' });
      if (failFast) break;
    }
  }

  const failures = failedRuns.length;
  // Honest rate: failures against the configured budget, not only executed runs.
  const flakeRate = failures === 0 ? 0 : failures / configuredRuns;
  const pass = failures === 0 && flakeRate <= options.config.thresholds.maxFlakeRate;

  return {
    name: 'flake',
    pass,
    runs: executed,
    configuredRuns,
    failures,
    flakeRate,
    files,
    failedRuns,
    failFast,
  };
}
