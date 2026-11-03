import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { exportPlan, PLAN_EPIC_ID, serializePlan } from './export-dm-plan.mjs';

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), '__fixtures__', 'dm-plan');
const EPIC = 'ep_01m3tyvkcv6kzg24j40g1mzh87';
const REV = 'rv_01m3z7b7y30zmng2zerq6yp172';
const epicDir = (root) => join(root, '.darkmechanicus', 'epics', EPIC);
const snapshotPath = (root) => join(epicDir(root), 'snapshots', `${REV}.json`);

const temps = [];
function copyFixture() {
  const dir = mkdtempSync(join(tmpdir(), 'dm-plan-'));
  temps.push(dir);
  cpSync(FIXTURE, dir, { recursive: true });
  return dir;
}
function editJson(path, edit) {
  const data = JSON.parse(readFileSync(path, 'utf8'));
  edit(data);
  writeFileSync(path, JSON.stringify(data));
}
afterEach(() => {
  while (temps.length) rmSync(temps.pop(), { recursive: true, force: true });
});

describe('exportPlan', () => {
  it('is configured for this epic', () => {
    expect(PLAN_EPIC_ID).toBe(EPIC);
  });

  it('a1: exports epic, ordered sprints, tickets and key edges', () => {
    const plan = exportPlan(FIXTURE, EPIC);
    expect(Object.keys(plan)).toEqual(['schemaVersion', 'epic', 'sprints', 'tickets', 'edges']);
    expect(Object.keys(plan.epic)).toEqual([
      'title',
      'status',
      'revisionNumber',
      'savedAt',
      'successCriteria',
    ]);
    expect(plan.epic.title).toBe('Showcase Dark Mechanicus on Coding Reference');
    expect(plan.epic.status).toBe('backlog');
    expect(plan.epic.revisionNumber).toBe(2);
    expect(plan.epic.savedAt).toBe('2026-10-02T21:11:56.611Z');
    expect(plan.epic.successCriteria.length).toBeGreaterThan(0);
    expect(plan.sprints.map((s) => s.ordinal)).toEqual([1]);
    expect(Object.keys(plan.sprints[0])).toEqual(['ordinal', 'goal', 'exitCriteria']);
    expect(plan.tickets.map((t) => t.key)).toEqual([
      'DGI-1',
      'DGI-2',
      'DGI-3',
      'DGI-4',
      'DGI-5',
      'DGI-6',
    ]);
    expect(plan.tickets[2]).toEqual({
      key: 'DGI-3',
      title: 'Export the saved plan as sanitized static JSON',
      sprint: 1,
      status: 'in_progress',
      optional: false,
    });
    expect(plan.edges).toContainEqual({ from: 'DGI-3', to: 'DGI-4' });
    for (const e of plan.edges) {
      expect(e.from).toMatch(/^DGI-\d+$/);
      expect(e.to).toMatch(/^DGI-\d+$/);
    }
  });

  it('a2: leaks none of the poisoned values', () => {
    const text = serializePlan(exportPlan(FIXTURE, EPIC));
    for (const bad of [
      'POISON',
      'poisonuser',
      'C:\\\\Users',
      '/home/',
      '/Users/',
      'deadbeef',
      'tk_',
      'sp_',
      'rv_',
      'ep_',
      'pj_',
      'mc_',
      'ss_',
      'rn_',
    ]) {
      expect(text).not.toContain(bad);
    }
    const firstBody = JSON.parse(readFileSync(snapshotPath(FIXTURE), 'utf8')).bundle.tickets[0]
      .body;
    expect(text).not.toContain(firstBody.slice(60, 120));
  });

  it('a3: is byte-identical across runs', () => {
    const a = serializePlan(exportPlan(FIXTURE, EPIC));
    const b = serializePlan(exportPlan(copyFixture(), EPIC));
    expect(a).toBe(b);
    expect(a.endsWith('\n')).toBe(true);
  });

  describe('a4: fails loudly naming the file', () => {
    it('when the records are missing', () => {
      const dir = mkdtempSync(join(tmpdir(), 'dm-empty-'));
      temps.push(dir);
      expect(() => exportPlan(dir, EPIC)).toThrow(/current\.json/);
    });
    it('when state.json is missing', () => {
      const dir = copyFixture();
      rmSync(join(epicDir(dir), 'state.json'));
      expect(() => exportPlan(dir, EPIC)).toThrow(/state\.json/);
    });
    it('on an unknown pointer format', () => {
      const dir = copyFixture();
      editJson(join(epicDir(dir), 'current.json'), (d) => (d.format = 'other.thing'));
      expect(() => exportPlan(dir, EPIC)).toThrow(/current\.json.*format/s);
    });
    it('on an unknown pointer formatVersion', () => {
      const dir = copyFixture();
      editJson(join(epicDir(dir), 'current.json'), (d) => (d.formatVersion = 2));
      expect(() => exportPlan(dir, EPIC)).toThrow(/current\.json.*formatVersion/s);
    });
    it('on an unknown state formatVersion', () => {
      const dir = copyFixture();
      editJson(join(epicDir(dir), 'state.json'), (d) => (d.formatVersion = 9));
      expect(() => exportPlan(dir, EPIC)).toThrow(/state\.json.*formatVersion/s);
    });
    it('on an unknown snapshot format', () => {
      const dir = copyFixture();
      editJson(snapshotPath(dir), (d) => (d.format = 'nope'));
      expect(() => exportPlan(dir, EPIC)).toThrow(new RegExp(`${REV}\\.json.*format`, 's'));
    });
    it('when the pointer snapshot is missing', () => {
      const dir = copyFixture();
      rmSync(snapshotPath(dir));
      expect(() => exportPlan(dir, EPIC)).toThrow(new RegExp(`${REV}\\.json`));
    });
    it('on a dangling edge', () => {
      const dir = copyFixture();
      editJson(snapshotPath(dir), (d) =>
        d.bundle.edges.push({ from: d.bundle.edges[0].from, to: 'tk_missing' })
      );
      expect(() => exportPlan(dir, EPIC)).toThrow(new RegExp(`${REV}\\.json.*unknown ticket`, 's'));
    });
    it('when a ticket has no status', () => {
      const dir = copyFixture();
      editJson(join(epicDir(dir), 'state.json'), (d) => (d.ticketStatuses = {}));
      expect(() => exportPlan(dir, EPIC)).toThrow(/state\.json/);
    });
    it('when the plan has no tickets', () => {
      const dir = copyFixture();
      editJson(snapshotPath(dir), (d) => {
        d.bundle.tickets = [];
        d.bundle.edges = [];
        d.bundle.sprints.forEach((s) => (s.ticketIds = []));
      });
      expect(() => exportPlan(dir, EPIC)).toThrow(new RegExp(`${REV}\\.json.*no tickets`, 's'));
    });
  });
});
