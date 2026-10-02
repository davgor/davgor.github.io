// @vitest-environment node
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { darkmechanicusPlanFixture } from '../test/fixtures/darkmechanicusPlan';
import { DARKMECHANICUS_PLAN_EPIC_ID } from './config';
import { darkmechanicusPlanPlugin } from './planPlugin';

const REPO_ROOT = fileURLToPath(new URL('../../', import.meta.url));
const FIXTURE_ROOT = fileURLToPath(
  new URL('../test/fixtures/darkmechanicus-records/', import.meta.url)
);
const NO_RECORDS_ROOT = fileURLToPath(new URL('../test/fixtures/', import.meta.url));
const EPIC_ID = 'ep_01m3tyvkcv6kzg24j40g1mzh87';
const POINTER = `.darkmechanicus/epics/${EPIC_ID}/current.json`;
const STATE = `.darkmechanicus/epics/${EPIC_ID}/state.json`;

interface Emitted {
  type: 'asset';
  fileName: string;
  source: string;
}

interface FakeResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string | undefined;
  setHeader(name: string, value: string): void;
  end(body: string): void;
}

function build(root: string, epicId?: string): Emitted[] {
  const plugin = darkmechanicusPlanPlugin(epicId);
  plugin.configResolved({ root, base: '/' });
  const emitted: Emitted[] = [];
  plugin.generateBundle.call({
    emitFile(file: Emitted) {
      emitted.push(file);
      return 'reference';
    },
    error(message: string): never {
      throw new Error(message);
    },
  });
  return emitted;
}

function startDevServer(root: string, base = '/') {
  const plugin = darkmechanicusPlanPlugin();
  plugin.configResolved({ root, base });
  const handlers: Array<
    Parameters<Parameters<typeof plugin.configureServer>[0]['middlewares']['use']>[0]
  > = [];
  const logged: string[] = [];
  plugin.configureServer({
    middlewares: {
      use(handler) {
        handlers.push(handler);
      },
    },
    config: { logger: { error: (message: string) => logged.push(message) } },
  });

  const request = (url: string | undefined) => {
    const response: FakeResponse = {
      statusCode: 0,
      headers: {},
      body: undefined,
      setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
      },
      end(body) {
        this.body = body;
      },
    };
    let passedOn = false;
    for (const handler of handlers) {
      handler({ url }, response, () => {
        passedOn = true;
      });
    }
    return { response, passedOn };
  };

  return { handlers, logged, request };
}

const tempDirs: string[] = [];

function tempCopyOfFixture(): string {
  const dir = mkdtempSync(join(tmpdir(), 'dm-plan-'));
  tempDirs.push(dir);
  cpSync(FIXTURE_ROOT, dir, { recursive: true });
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('darkmechanicusPlanPlugin: build', () => {
  it('emits darkmechanicus/plan.json as an asset with the exported plan', () => {
    const emitted = build(FIXTURE_ROOT);

    expect(emitted.map(({ type, fileName }) => ({ type, fileName }))).toEqual([
      { type: 'asset', fileName: 'darkmechanicus/plan.json' },
    ]);
    expect(JSON.parse(emitted[0].source)).toStrictEqual(darkmechanicusPlanFixture);
  });

  it('emits byte-identical JSON on every build of the same records', () => {
    expect(build(FIXTURE_ROOT)[0].source).toBe(build(FIXTURE_ROOT)[0].source);
  });

  it('fails the build, naming the file, when the records are missing', () => {
    expect(() => build(NO_RECORDS_ROOT)).toThrow(`${POINTER}: record is missing`);
  });

  it('fails the build, naming the file, when a record cannot be read', () => {
    const root = mkdtempSync(join(tmpdir(), 'dm-plan-'));
    tempDirs.push(root);
    mkdirSync(join(root, POINTER), { recursive: true });

    expect(() => build(root)).toThrow(`${POINTER}: could not be read`);
  });

  it('exports the configured epic from the committed records with only allowlisted fields', () => {
    const pointer = JSON.parse(
      readFileSync(
        join(REPO_ROOT, `.darkmechanicus/epics/${DARKMECHANICUS_PLAN_EPIC_ID}/current.json`),
        'utf8'
      )
    );
    const output = build(REPO_ROOT)[0].source;
    const plan = JSON.parse(output);
    const keys = new Set(plan.tickets.map((ticket: { key: string }) => ticket.key));

    expect(Object.keys(plan)).toEqual(['edges', 'epic', 'sprints', 'tickets']);
    expect(Object.keys(plan.epic)).toEqual([
      'revision',
      'savedAt',
      'status',
      'successCriteria',
      'title',
    ]);
    expect(plan.epic.revision).toBe(pointer.revisionNumber);
    expect(plan.sprints.map((sprint: { ordinal: number }) => sprint.ordinal)).toEqual(
      plan.sprints.map((_: unknown, index: number) => index + 1)
    );
    for (const sprint of plan.sprints) {
      expect(Object.keys(sprint)).toEqual(['exitCriteria', 'goal', 'ordinal']);
    }
    expect(plan.tickets.length).toBeGreaterThan(0);
    for (const ticket of plan.tickets) {
      expect(Object.keys(ticket)).toEqual(['key', 'optional', 'sprintOrdinal', 'status', 'title']);
      expect(ticket.key).toMatch(/^[A-Za-z0-9]{1,12}-\d{1,9}$/);
      expect(['backlog', 'in_progress', 'completed']).toContain(ticket.status);
    }
    for (const edge of plan.edges) {
      expect(Object.keys(edge)).toEqual(['from', 'to']);
      expect(keys.has(edge.from) && keys.has(edge.to)).toBe(true);
    }
    expect(output).not.toMatch(/\b[a-z]{2}_[0-9a-z]{26}\b/);
    expect(output).not.toMatch(/\/Users\/|\/home\/|[A-Za-z]:\\\\/);
  });
});

describe('darkmechanicusPlanPlugin: dev server', () => {
  it('serves the exported plan at /darkmechanicus/plan.json', () => {
    const { response, passedOn } = startDevServer(FIXTURE_ROOT).request(
      '/darkmechanicus/plan.json'
    );

    expect(passedOn).toBe(false);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.body).toBe(build(FIXTURE_ROOT)[0].source);
  });

  it('serves the plan when the URL has a query string', () => {
    const { response } = startDevServer(FIXTURE_ROOT).request('/darkmechanicus/plan.json?v=2');

    expect(JSON.parse(response.body ?? '')).toStrictEqual(darkmechanicusPlanFixture);
  });

  it('serves the plan under the configured base path only', () => {
    const server = startDevServer(FIXTURE_ROOT, '/portfolio/');
    const underBase = server.request('/portfolio/darkmechanicus/plan.json');
    const atRoot = server.request('/darkmechanicus/plan.json');

    expect(underBase.response.statusCode).toBe(200);
    expect(atRoot.passedOn).toBe(true);
    expect(atRoot.response.body).toBeUndefined();
  });

  it.each([
    '/',
    '/coding-reference',
    '/darkmechanicus/plan.json.map',
    '/darkmechanicus/',
    undefined,
  ])('passes %j on to the next middleware', (url) => {
    const { response, passedOn } = startDevServer(FIXTURE_ROOT).request(url);

    expect(passedOn).toBe(true);
    expect(response.body).toBeUndefined();
  });

  it('answers 500 with a message naming the file, and logs it, when records are missing', () => {
    const server = startDevServer(NO_RECORDS_ROOT);
    server.logged.length = 0;
    const { response, passedOn } = server.request('/darkmechanicus/plan.json');

    expect(passedOn).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.headers['content-type']).toBe('text/plain; charset=utf-8');
    expect(response.body).toContain(`${POINTER}: record is missing`);
    expect(server.logged).toEqual([response.body]);
  });

  it('logs a broken export as soon as the dev server starts', () => {
    expect(startDevServer(NO_RECORDS_ROOT).logged).toEqual([
      expect.stringContaining(`${POINTER}: record is missing`),
    ]);
    expect(startDevServer(FIXTURE_ROOT).logged).toEqual([]);
  });

  it('re-reads the records on every request, so edits show without a restart', () => {
    const root = tempCopyOfFixture();
    const server = startDevServer(root);
    const before = JSON.parse(server.request('/darkmechanicus/plan.json').response.body ?? '');
    const state = JSON.parse(readFileSync(join(root, STATE), 'utf8'));
    state.status = 'completed';
    writeFileSync(join(root, STATE), JSON.stringify(state));
    const after = JSON.parse(server.request('/darkmechanicus/plan.json').response.body ?? '');

    expect(before.epic.status).toBe('in_progress');
    expect(after.epic.status).toBe('completed');
  });
});
