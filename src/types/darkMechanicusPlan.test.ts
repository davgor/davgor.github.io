import { describe, expect, it } from 'vitest';
import { exportPlan } from '../../scripts/export-dm-plan.mjs';
import type { DarkMechanicusPlan } from './darkMechanicusPlan';

const FIXTURE = 'scripts/__fixtures__/dm-plan';

describe('DarkMechanicusPlan type', () => {
  it('describes what the exporter produces for the fixture records', () => {
    const plan: DarkMechanicusPlan = exportPlan(FIXTURE, 'ep_01m3tyvkcv6kzg24j40g1mzh87');
    expect(plan.schemaVersion).toBe(1);
    expect(plan.tickets.every((t) => plan.sprints.some((s) => s.ordinal === t.sprint))).toBe(true);
    const keys = new Set(plan.tickets.map((t) => t.key));
    expect(plan.edges.every((e) => keys.has(e.from) && keys.has(e.to))).toBe(true);
  });
});
