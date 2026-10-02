// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { darkmechanicusPlanFixture } from '../test/fixtures/darkmechanicusPlan';
import { exportPlan } from './planExport';

const EPIC_ID = 'ep_01m3tyvkcv6kzg24j40g1mzh87';
const REVISION_ID = 'rv_01m3w0nmbqpnt36b7w59957sfx';
const OTHER_REVISION_ID = 'rv_01m3z7b7y30zmng2zerq6yp172';
const EPIC_DIR = `.darkmechanicus/epics/${EPIC_ID}`;
const POINTER = `${EPIC_DIR}/current.json`;
const STATE = `${EPIC_DIR}/state.json`;
const SNAPSHOT = `${EPIC_DIR}/snapshots/${REVISION_ID}.json`;
const FIXTURE_ROOT = fileURLToPath(
  new URL('../test/fixtures/darkmechanicus-records/', import.meta.url)
);

type Records = Map<string, string>;
type JsonPath = Array<string | number>;

interface FixtureSnapshot {
  revisionId: string;
  number: number;
  bundle: {
    epic: { title: string };
    sprints: Array<{ ordinal: number; ticketIds: string[] }>;
    tickets: Array<{ id: string; key: string }>;
    edges: Array<{ from: string; to: string }>;
  };
}

interface FixturePointer {
  revisionId: string;
  revisionNumber: number;
}

/** Every file of the committed records fixture, keyed by its repository-relative path. */
function loadFixture(): Records {
  const records: Records = new Map();
  for (const entry of readdirSync(FIXTURE_ROOT, { recursive: true, encoding: 'utf8' })) {
    if (entry.endsWith('.json')) {
      records.set(entry.split(sep).join('/'), readFileSync(join(FIXTURE_ROOT, entry), 'utf8'));
    }
  }
  return records;
}

function run(records: Records, epicId = EPIC_ID): string {
  return exportPlan({ epicId, readRecord: (path) => records.get(path) });
}

function editJson<T>(records: Records, file: string, edit: (record: T) => void): void {
  const record: T = JSON.parse(records.get(file) ?? 'null');
  edit(record);
  records.set(file, JSON.stringify(record, null, 2));
}

/** Sets (or, with `undefined`, removes) one value inside a record. */
function setAt(records: Records, file: string, path: JsonPath, value: unknown): void {
  editJson<Record<string | number, unknown>>(records, file, (record) => {
    let node = record;
    for (const key of path.slice(0, -1)) {
      node = node[key] as Record<string | number, unknown>;
    }
    node[path[path.length - 1]] = value;
  });
}

function ticketId(records: Records, key: string): string {
  const snapshot: FixtureSnapshot = JSON.parse(records.get(SNAPSHOT) ?? 'null');
  const ticket = snapshot.bundle.tickets.find((candidate) => candidate.key === key);
  if (!ticket) throw new Error(`fixture has no ticket ${key}`);
  return ticket.id;
}

/** Re-serializes every record with reversed key order and no whitespace. */
function reorderKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(reorderKeys);
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value).reverse();
    return Object.fromEntries(entries.map(([key, inner]) => [key, reorderKeys(inner)]));
  }
  return value;
}

describe('exportPlan: allowlisted output (a1)', () => {
  it('exports the records fixture as exactly the committed plan fixture', () => {
    expect(JSON.parse(run(loadFixture()))).toStrictEqual(darkmechanicusPlanFixture);
  });

  it('emits no field outside the documented allowlist', () => {
    const plan = JSON.parse(run(loadFixture()));

    expect(Object.keys(plan)).toEqual(['edges', 'epic', 'sprints', 'tickets']);
    expect(Object.keys(plan.epic)).toEqual([
      'revision',
      'savedAt',
      'status',
      'successCriteria',
      'title',
    ]);
    for (const sprint of plan.sprints) {
      expect(Object.keys(sprint)).toEqual(['exitCriteria', 'goal', 'ordinal']);
    }
    for (const ticket of plan.tickets) {
      expect(Object.keys(ticket)).toEqual(['key', 'optional', 'sprintOrdinal', 'status', 'title']);
    }
    for (const edge of plan.edges) {
      expect(Object.keys(edge)).toEqual(['from', 'to']);
    }
  });

  it('orders sprints by ordinal and tickets by sprint, whatever order the records use', () => {
    const records = loadFixture();
    editJson<FixtureSnapshot>(records, SNAPSHOT, (snapshot) => {
      snapshot.bundle.sprints.reverse();
      snapshot.bundle.tickets.reverse();
    });

    const plan = JSON.parse(run(records));

    expect(plan.sprints.map((sprint: { ordinal: number }) => sprint.ordinal)).toEqual([1, 2, 3]);
    expect(plan.tickets.map((ticket: { key: string }) => ticket.key)).toEqual([
      'DGI-1',
      'DGI-2',
      'DGI-3',
      'DGI-4',
      'DGI-5',
      'DGI-6',
    ]);
  });

  it("keeps each sprint's own ticket order", () => {
    const records = loadFixture();
    editJson<FixtureSnapshot>(records, SNAPSHOT, (snapshot) => {
      snapshot.bundle.sprints[0].ticketIds.reverse();
    });

    const plan = JSON.parse(run(records));

    expect(plan.tickets.slice(0, 3).map((ticket: { key: string }) => ticket.key)).toEqual([
      'DGI-2',
      'DGI-1',
      'DGI-3',
    ]);
  });

  it('sorts edges by the position of their prerequisite, then their dependent', () => {
    const records = loadFixture();
    const dgi1 = ticketId(records, 'DGI-1');
    const dgi3 = ticketId(records, 'DGI-3');
    editJson<FixtureSnapshot>(records, SNAPSHOT, (snapshot) => {
      snapshot.bundle.edges.reverse();
      snapshot.bundle.edges.push({ from: dgi1, to: dgi3 });
    });

    expect(JSON.parse(run(records)).edges).toEqual([
      { from: 'DGI-1', to: 'DGI-3' },
      { from: 'DGI-1', to: 'DGI-5' },
      { from: 'DGI-2', to: 'DGI-5' },
      { from: 'DGI-3', to: 'DGI-4' },
      { from: 'DGI-4', to: 'DGI-5' },
      { from: 'DGI-5', to: 'DGI-6' },
    ]);
  });

  it('reads the revision the pointer names, not the newest snapshot file', () => {
    const records = loadFixture();
    editJson<FixtureSnapshot>(records, SNAPSHOT, (snapshot) => {
      snapshot.revisionId = OTHER_REVISION_ID;
      snapshot.number = 2;
      snapshot.bundle.epic.title = 'Revised plan';
    });
    records.set(`${EPIC_DIR}/snapshots/${OTHER_REVISION_ID}.json`, records.get(SNAPSHOT) ?? '');
    records.set(SNAPSHOT, loadFixture().get(SNAPSHOT) ?? '');

    expect(JSON.parse(run(records)).epic.title).toBe(
      'Showcase Dark Mechanicus on Coding Reference'
    );

    editJson<FixturePointer>(records, POINTER, (pointer) => {
      pointer.revisionId = OTHER_REVISION_ID;
      pointer.revisionNumber = 2;
    });
    const revised = JSON.parse(run(records));

    expect(revised.epic.title).toBe('Revised plan');
    expect(revised.epic.revision).toBe(2);
  });

  it('ignores status entries for tickets that are no longer in the plan', () => {
    const records = loadFixture();
    setAt(records, STATE, ['ticketStatuses', 'tk_01m3zzzzzz9rem0vedzzzzzzzz'], 'in_progress');

    expect(JSON.parse(run(records)).tickets).toHaveLength(6);
  });
});

describe('exportPlan: sanitizing (a2)', () => {
  const POISON = [
    // absolute paths and usernames
    '/Users/jdoe-secret',
    'AppData',
    'jdoe-secret',
    'private-client-repo',
    // project, machine, session, run, comment and other ids
    'pj_01m3zzzzzz9pr0jectzzzzzzzz',
    'mc_01m3zzzzzz9mach1nezzzzzzzz',
    'ss_01m3zzzzzz9sess10nzzzzzzzz',
    'rn_01m3zzzzzz9r0nzzzzzzzzzzzz',
    'cm_01m3zzzzzz9c0mmentzzzzzzzz',
    'ep_01m3zzzzzz9s0rczzzzzzzzzzz',
    'tk_01m3zzzzzz9rem0vedzzzzzzzz',
    // branch and commit data
    '0123456789abcdef0123456789abcdef01234567',
    'jdoe-secret/wip',
    // ticket bodies, references, capability profiles, comments and other free text
    'Add a dev/build-time export that reads',
    'POISON-COMMENT',
    'POISON-REFERENCE',
    'Vite config',
    'POISON-MODEL-OVERRIDE',
    'multi_step',
    'POISON-ARTIFACT',
    'poison-tag',
    'POISON-INTENT',
    'Who benefits',
    'POISON-RATIONALE',
    'POISON-ENTRY',
    'POISON-EDGE-NOTE',
    'POISON-OUTCOME',
    'POISON-PROVENANCE',
  ];

  it('has every poisoned value somewhere in the fixture records', () => {
    const allRecords = [...loadFixture().values()].join('\n');

    for (const value of POISON) {
      expect(allRecords).toContain(value);
    }
  });

  it('leaves out every path, username, id, body, reference and comment', () => {
    const output = run(loadFixture());

    for (const value of POISON) {
      expect(output).not.toContain(value);
    }
  });

  it('contains no stable id, absolute path or e-mail-style user at all', () => {
    const output = run(loadFixture());

    expect(output).not.toMatch(/\b[a-z]{2}_[0-9a-z]{26}\b/);
    expect(output).not.toMatch(/\/Users\/|\/home\/|[A-Za-z]:\\\\/);
    expect(output).not.toMatch(/[\w.-]+@[\w-]+\./);
  });
});

describe('exportPlan: determinism (a3)', () => {
  it('produces byte-identical output for the same records', () => {
    expect(run(loadFixture())).toBe(run(loadFixture()));
  });

  it('does not depend on key order or whitespace in the records', () => {
    const reordered: Records = new Map();
    for (const [path, text] of loadFixture()) {
      reordered.set(path, JSON.stringify(reorderKeys(JSON.parse(text))));
    }

    expect(run(reordered)).toBe(run(loadFixture()));
  });

  it('writes sorted keys, two-space indentation and a trailing newline', () => {
    const output = run(loadFixture());

    expect(output.startsWith('{\n  "edges": [\n    {\n      "from": "DGI-1",\n')).toBe(true);
    expect(output.endsWith('\n  ]\n}\n')).toBe(true);
    expect(Object.keys(JSON.parse(output).tickets[0])).toEqual([
      'key',
      'optional',
      'sprintOrdinal',
      'status',
      'title',
    ]);
  });

  it('carries no export-time timestamp, only the saved-at time from the records', () => {
    const timestamps = run(loadFixture()).match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/g);

    expect(timestamps).toEqual(['2026-10-01T15:17']);
  });
});

describe('exportPlan: failures name the file (a4)', () => {
  it('fails when the pointer record is missing', () => {
    const records = loadFixture();
    records.delete(POINTER);

    expect(() => run(records)).toThrow(`${POINTER}: record is missing`);
  });

  it('fails when the state record is missing', () => {
    const records = loadFixture();
    records.delete(STATE);

    expect(() => run(records)).toThrow(`${STATE}: record is missing`);
  });

  it("fails when the pointer's snapshot is missing", () => {
    const records = loadFixture();
    records.delete(SNAPSHOT);

    expect(() => run(records)).toThrow(`${SNAPSHOT}: snapshot named by ${POINTER} is missing`);
  });

  it.each([
    [POINTER, 'format', 'darkmechanicus.epic-pointer-v9'],
    [POINTER, 'formatVersion', 2],
    [STATE, 'format', 'darkmechanicus.epic-status'],
    [STATE, 'formatVersion', '1'],
    [SNAPSHOT, 'format', 'darkmechanicus.plan-draft'],
    [SNAPSHOT, 'formatVersion', 2],
  ])('fails on an unknown %s %s', (file, field, value) => {
    const records = loadFixture();
    setAt(records, file, [field], value);

    expect(() => run(records)).toThrow(`${file}: unknown format`);
  });

  it('fails on an unknown plan bundle format version', () => {
    const records = loadFixture();
    setAt(records, SNAPSHOT, ['bundle', 'formatVersion'], 2);

    expect(() => run(records)).toThrow(`${SNAPSHOT}: unknown plan bundle formatVersion 2`);
  });

  it('fails on an edge whose prerequisite is an unknown ticket', () => {
    const records = loadFixture();
    setAt(records, SNAPSHOT, ['bundle', 'edges', 0, 'from'], 'tk_01m3zzzzzz9dang1ngzzzzzzzz');

    expect(() => run(records)).toThrow(
      `${SNAPSHOT}: edge names unknown ticket tk_01m3zzzzzz9dang1ngzzzzzzzz`
    );
  });

  it('fails on an edge whose dependent is an unknown ticket', () => {
    const records = loadFixture();
    setAt(records, SNAPSHOT, ['bundle', 'edges', 4, 'to'], 'tk_01m3zzzzzz9dang1ngzzzzzzzz');

    expect(() => run(records)).toThrow(
      `${SNAPSHOT}: edge names unknown ticket tk_01m3zzzzzz9dang1ngzzzzzzzz`
    );
  });

  it('fails on a record that is not valid JSON', () => {
    const records = loadFixture();
    records.set(STATE, '<<<<<<< HEAD\n{}');

    expect(() => run(records)).toThrow(`${STATE}: not valid JSON`);
  });

  it('fails on a record that is not a JSON object', () => {
    const records = loadFixture();
    records.set(POINTER, '[]');

    expect(() => run(records)).toThrow(`${POINTER}: record must be an object`);
  });

  it('prefixes every failure so the build log says where it came from', () => {
    const records = loadFixture();
    records.delete(POINTER);

    expect(() => run(records)).toThrow(/^Dark Mechanicus plan export failed: /);
  });

  it.each(['latest', '../../etc', 'rv_01m3w0nmbqpnt36b7w59957sfx', ''])(
    'refuses the configured epic id %j without reading anything',
    (epicId) => {
      const read: string[] = [];
      const attempt = () =>
        exportPlan({
          epicId,
          readRecord: (path) => {
            read.push(path);
            return undefined;
          },
        });

      expect(attempt).toThrow(`configured epic id ${JSON.stringify(epicId)} is not an epic id`);
      expect(read).toEqual([]);
    }
  );

  it('refuses a pointer whose revision id would leave the snapshots folder', () => {
    const records = loadFixture();
    const read: string[] = [];
    setAt(records, POINTER, ['revisionId'], '../../../../etc/passwd');

    const attempt = () =>
      exportPlan({
        epicId: EPIC_ID,
        readRecord: (path) => {
          read.push(path);
          return records.get(path);
        },
      });

    expect(attempt).toThrow(`${POINTER}: revisionId "../../../../etc/passwd" is not a revision id`);
    expect(read.some((path) => path.includes('..'))).toBe(false);
  });

  it.each([
    [POINTER, ['epicId'], 'ep_01m3zzzzzz9s0rczzzzzzzzzzz', 'epicId does not match'],
    [STATE, ['epicId'], 'ep_01m3zzzzzz9s0rczzzzzzzzzzz', 'epicId does not match'],
    [SNAPSHOT, ['epicId'], 'ep_01m3zzzzzz9s0rczzzzzzzzzzz', 'epicId does not match'],
    [SNAPSHOT, ['revisionId'], OTHER_REVISION_ID, 'revisionId does not match'],
    [SNAPSHOT, ['number'], 7, `number 7 does not match revisionNumber 1 in ${POINTER}`],
  ])('fails when %s %j disagrees with the other records', (file, path, value, message) => {
    const records = loadFixture();
    setAt(records, file, path, value);

    expect(() => run(records)).toThrow(`${file}: ${message}`);
  });

  it.each([
    [['status'], 'paused', 'status "paused" is not one of backlog, in_progress, completed'],
    [['status'], undefined, 'status "undefined" is not one of'],
    [['ticketStatuses'], [], 'ticketStatuses must be an object'],
    [['ticketStatuses'], null, 'ticketStatuses must be an object'],
  ])('fails on a state record with %j = %j', (path, value, message) => {
    const records = loadFixture();
    setAt(records, STATE, path, value);

    expect(() => run(records)).toThrow(`${STATE}: ${message}`);
  });

  it('fails when a ticket has no status', () => {
    const records = loadFixture();
    setAt(records, STATE, ['ticketStatuses', ticketId(records, 'DGI-4')], undefined);

    expect(() => run(records)).toThrow(`${STATE}: ticket DGI-4 has status "undefined"`);
  });

  it('fails when a ticket has an unknown status', () => {
    const records = loadFixture();
    setAt(records, STATE, ['ticketStatuses', ticketId(records, 'DGI-2')], 'done');

    expect(() => run(records)).toThrow(`${STATE}: ticket DGI-2 has status "done"`);
  });

  it('fails when a sprint lists an unknown ticket', () => {
    const records = loadFixture();
    setAt(
      records,
      SNAPSHOT,
      ['bundle', 'sprints', 1, 'ticketIds', 0],
      'tk_01m3zzzzzz9gh0stzzzzzzzzzz'
    );

    expect(() => run(records)).toThrow(
      `${SNAPSHOT}: sprint 2 lists unknown ticket tk_01m3zzzzzz9gh0stzzzzzzzzzz`
    );
  });

  it('fails when a ticket is in no sprint', () => {
    const records = loadFixture();
    editJson<FixtureSnapshot>(records, SNAPSHOT, (snapshot) => {
      snapshot.bundle.sprints[2].ticketIds.pop();
    });

    expect(() => run(records)).toThrow(`${SNAPSHOT}: ticket DGI-6 is not in any sprint`);
  });

  it('fails when a ticket is in two sprints', () => {
    const records = loadFixture();
    const dgi1 = ticketId(records, 'DGI-1');
    editJson<FixtureSnapshot>(records, SNAPSHOT, (snapshot) => {
      snapshot.bundle.sprints[2].ticketIds.push(dgi1);
    });

    expect(() => run(records)).toThrow(`${SNAPSHOT}: ticket DGI-1 is in more than one sprint`);
  });

  it('fails when two tickets share a display key', () => {
    const records = loadFixture();
    setAt(records, SNAPSHOT, ['bundle', 'tickets', 4, 'key'], 'DGI-1');

    expect(() => run(records)).toThrow(`${SNAPSHOT}: display key DGI-1 is used twice`);
  });

  it('fails when two tickets share an id', () => {
    const records = loadFixture();
    const dgi1 = ticketId(records, 'DGI-1');
    setAt(records, SNAPSHOT, ['bundle', 'tickets', 1, 'id'], dgi1);

    expect(() => run(records)).toThrow(`${SNAPSHOT}: ticket id ${dgi1} is used twice`);
  });

  it('fails when two sprints share an ordinal', () => {
    const records = loadFixture();
    setAt(records, SNAPSHOT, ['bundle', 'sprints', 2, 'ordinal'], 2);

    expect(() => run(records)).toThrow(`${SNAPSHOT}: sprint ordinal 2 is used twice`);
  });

  it.each([
    [POINTER, ['revisionNumber'], 0, 'revisionNumber must be a positive integer'],
    [POINTER, ['revisionNumber'], 1.5, 'revisionNumber must be a positive integer'],
    [POINTER, ['revisionId'], 42, 'revisionId must be a string'],
    [SNAPSHOT, ['savedAt'], '2026-10-01', 'savedAt must be an ISO 8601 date-time'],
    [SNAPSHOT, ['savedAt'], null, 'savedAt must be a string'],
    [SNAPSHOT, ['bundle'], 'plan', 'bundle must be an object'],
    [SNAPSHOT, ['bundle', 'epic', 'title'], 7, 'bundle.epic.title must be a string'],
    [SNAPSHOT, ['bundle', 'epic', 'successCriteria'], 'all', 'successCriteria must be an array'],
    [SNAPSHOT, ['bundle', 'epic', 'successCriteria', 0], 'text', 'successCriteria[0] must be'],
    [SNAPSHOT, ['bundle', 'sprints'], {}, 'bundle.sprints must be an array'],
    [SNAPSHOT, ['bundle', 'sprints', 0, 'ordinal'], -1, 'ordinal must be a positive integer'],
    [SNAPSHOT, ['bundle', 'sprints', 0, 'goal'], null, 'goal must be a string'],
    [SNAPSHOT, ['bundle', 'sprints', 0, 'exitCriteria', 1, 'text'], 3, 'text must be a string'],
    [SNAPSHOT, ['bundle', 'sprints', 0, 'ticketIds', 0], 5, 'ticketIds[0] must be a string'],
    [SNAPSHOT, ['bundle', 'tickets', 0, 'title'], undefined, 'title must be a string'],
    [SNAPSHOT, ['bundle', 'tickets', 0, 'optional'], 'no', 'optional must be a boolean'],
    [SNAPSHOT, ['bundle', 'edges', 0], 'a->b', 'bundle.edges[0] must be an object'],
  ])('fails on a malformed %s field %j', (file, path, value, message) => {
    const records = loadFixture();
    setAt(records, file, path, value);

    expect(() => run(records)).toThrow(`${file}: `);
    expect(() => run(records)).toThrow(message);
  });
});
