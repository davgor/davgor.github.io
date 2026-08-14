import { describe, it, expect, vi } from 'vitest';
import { runFlakeGate } from '../src/gates/flakeGate.js';
import { DEFAULT_CONFIG } from '../src/config.js';

describe('runFlakeGate', () => {
  it('passes when every isolated run succeeds for new tests', async () => {
    const runOnce = vi.fn(async () => ({ ok: true }));
    const gate = await runFlakeGate({
      config: {
        ...DEFAULT_CONFIG,
        thresholds: { ...DEFAULT_CONFIG.thresholds, agenticFlakinessRuns: 5 },
      },
      files: ['src/new.test.ts'],
      runOnce,
    });
    expect(gate.pass).toBe(true);
    expect(gate.runs).toBe(5);
    expect(gate.configuredRuns).toBe(5);
    expect(gate.failFast).toBe(true);
    expect(gate.failures).toBe(0);
    expect(runOnce).toHaveBeenCalledTimes(5);
  });

  it('fails on first flake and records the failing run', async () => {
    let n = 0;
    const runOnce = vi.fn(async () => {
      n += 1;
      if (n === 3) return { ok: false, error: 'boom' };
      return { ok: true };
    });
    const gate = await runFlakeGate({
      config: {
        ...DEFAULT_CONFIG,
        thresholds: { ...DEFAULT_CONFIG.thresholds, agenticFlakinessRuns: 5 },
      },
      files: ['src/flaky.test.ts'],
      runOnce,
    });
    expect(gate.pass).toBe(false);
    expect(gate.failures).toBe(1);
    expect(gate.configuredRuns).toBe(5);
    expect(gate.runs).toBe(3);
    expect(gate.flakeRate).toBe(1 / 5);
    expect(gate.failedRuns[0]).toEqual({ run: 3, error: 'boom' });
    expect(runOnce).toHaveBeenCalledTimes(3);
  });

  it('skips with pass when there are no new test files', async () => {
    const runOnce = vi.fn(async () => ({ ok: true }));
    const gate = await runFlakeGate({
      config: DEFAULT_CONFIG,
      files: [],
      runOnce,
    });
    expect(gate.pass).toBe(true);
    expect(gate.runs).toBe(0);
    expect(runOnce).not.toHaveBeenCalled();
  });
});
