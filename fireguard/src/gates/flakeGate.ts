import type { FireguardConfig, FlakeGateResult, TestRunner } from '../types.js';

export async function runFlakeGate(options: {
  config: FireguardConfig;
  files: string[];
  runOnce: TestRunner;
}): Promise<FlakeGateResult> {
  const files = options.files;
  if (files.length === 0) {
    return {
      name: 'flake',
      pass: true,
      runs: 0,
      failures: 0,
      flakeRate: 0,
      files: [],
      failedRuns: [],
    };
  }

  const runs = options.config.thresholds.agenticFlakinessRuns;
  const failedRuns: FlakeGateResult['failedRuns'] = [];

  for (let i = 1; i <= runs; i += 1) {
    const result = await options.runOnce(files);
    if (!result.ok) {
      failedRuns.push({ run: i, error: result.error ?? 'test run failed' });
      // Fail fast — one flake is enough for a failing grade
      break;
    }
  }

  const failures = failedRuns.length;
  const flakeRate = failures === 0 ? 0 : failures / Math.max(failedRuns[0]?.run ?? runs, 1);
  const pass = failures === 0 && flakeRate <= options.config.thresholds.maxFlakeRate;

  return {
    name: 'flake',
    pass,
    runs: failures === 0 ? runs : (failedRuns[0]?.run ?? runs),
    failures,
    flakeRate,
    files,
    failedRuns,
  };
}
