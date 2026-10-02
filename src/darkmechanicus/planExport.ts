/**
 * Turns one epic's committed Dark Mechanicus records into the sanitized plan JSON the site serves.
 *
 * Inputs (all under `.darkmechanicus/epics/<epicId>/`, treated as untrusted data):
 * - `current.json`: `darkmechanicus.epic-pointer` v1, naming the saved revision;
 * - `snapshots/<revisionId>.json`: `darkmechanicus.plan-snapshot` v1, the plan bundle;
 * - `state.json`: `darkmechanicus.epic-state` v1, the epic and ticket statuses.
 *
 * The output is built field by field from an allowlist (see `ExportedPlan`); nothing is copied
 * wholesale, so unknown or private fields can never pass through. Any missing, unknown or
 * inconsistent record throws an error naming the file, so a build can never ship an empty plan.
 * The result is deterministic: sorted keys, stable array order and no export-time values.
 *
 * Pure: no Node APIs. `planPlugin.ts` supplies the file reader.
 */
import { type ExportedPlan, PLAN_STATUSES } from '../types/darkmechanicusPlan';

type PlanStatus = ExportedPlan['epic']['status'];
type JsonObject = Record<string, unknown>;

/** Reads a repository-relative file; `undefined` means the file does not exist. */
type ReadRecord = (path: string) => string | undefined;

const RECORD_FORMAT_VERSION = 1;
const PLAN_BUNDLE_FORMAT_VERSION = 1;
const STABLE_ID_BODY = '[0-9a-hjkmnp-tv-z]{26}';
const EPIC_ID_PATTERN = new RegExp(`^ep_${STABLE_ID_BODY}$`);
const REVISION_ID_PATTERN = new RegExp(`^rv_${STABLE_ID_BODY}$`);
const ISO_DATE_TIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const ERROR_PREFIX = 'Dark Mechanicus plan export failed';

function fail(file: string, reason: string): never {
  throw new Error(`${ERROR_PREFIX}: ${file}: ${reason}`);
}

function asObject(value: unknown, file: string, where: string): JsonObject {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    fail(file, `${where} must be an object`);
  }
  return value as JsonObject;
}

function asArray(value: unknown, file: string, where: string): unknown[] {
  if (!Array.isArray(value)) fail(file, `${where} must be an array`);
  return value;
}

function asString(value: unknown, file: string, where: string): string {
  if (typeof value !== 'string') fail(file, `${where} must be a string`);
  return value;
}

function asBoolean(value: unknown, file: string, where: string): boolean {
  if (typeof value !== 'boolean') fail(file, `${where} must be a boolean`);
  return value;
}

function asPositiveInteger(value: unknown, file: string, where: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    fail(file, `${where} must be a positive integer`);
  }
  return value;
}

/** Criterion lists (`[{ id, text }]`) reduced to their text, in plan order. */
function criteriaText(value: unknown, file: string, where: string): string[] {
  return asArray(value, file, where).map((item, index) => {
    const criterion = asObject(item, file, `${where}[${index}]`);
    return asString(criterion.text, file, `${where}[${index}].text`);
  });
}

function isPlanStatus(value: unknown): value is PlanStatus {
  return PLAN_STATUSES.some((status) => status === value);
}

function readRecordFile(
  readRecord: ReadRecord,
  file: string,
  format: string,
  missingReason = 'record is missing'
): JsonObject {
  const text = readRecord(file);
  if (text === undefined) fail(file, missingReason);
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    fail(file, `not valid JSON (${error instanceof Error ? error.message : String(error)})`);
  }
  const record = asObject(value, file, 'record');
  if (record.format !== format || record.formatVersion !== RECORD_FORMAT_VERSION) {
    fail(
      file,
      `unknown format ${String(record.format)} v${String(record.formatVersion)}; ` +
        `expected ${format} v${RECORD_FORMAT_VERSION}`
    );
  }
  return record;
}

function expectEpic(record: JsonObject, file: string, epicId: string): void {
  if (record.epicId !== epicId) fail(file, `epicId does not match the configured epic ${epicId}`);
}

/** Recursively sorts object keys so equal plans always serialize to the same bytes. */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === 'object') {
    const object = value as JsonObject;
    return Object.fromEntries(
      Object.keys(object)
        .sort()
        .map((key) => [key, sortKeys(object[key])])
    );
  }
  return value;
}

/**
 * Exports the saved plan of `epicId` as pretty, key-sorted JSON (with a trailing newline).
 * Throws an `Error` naming the offending file when the records are missing or invalid.
 */
export function exportPlan({
  epicId,
  readRecord,
}: {
  epicId: string;
  readRecord: ReadRecord;
}): string {
  if (!EPIC_ID_PATTERN.test(epicId)) {
    throw new Error(
      `${ERROR_PREFIX}: configured epic id ${JSON.stringify(epicId)} is not an epic id ` +
        '(see src/darkmechanicus/config.ts)'
    );
  }
  const epicDir = `.darkmechanicus/epics/${epicId}`;
  const pointerFile = `${epicDir}/current.json`;
  const stateFile = `${epicDir}/state.json`;

  const pointer = readRecordFile(readRecord, pointerFile, 'darkmechanicus.epic-pointer');
  expectEpic(pointer, pointerFile, epicId);
  const revisionId = asString(pointer.revisionId, pointerFile, 'revisionId');
  if (!REVISION_ID_PATTERN.test(revisionId)) {
    fail(pointerFile, `revisionId ${JSON.stringify(revisionId)} is not a revision id`);
  }
  const revisionNumber = asPositiveInteger(pointer.revisionNumber, pointerFile, 'revisionNumber');

  const state = readRecordFile(readRecord, stateFile, 'darkmechanicus.epic-state');
  expectEpic(state, stateFile, epicId);
  if (!isPlanStatus(state.status)) {
    fail(stateFile, `status "${String(state.status)}" is not one of ${PLAN_STATUSES.join(', ')}`);
  }
  const epicStatus = state.status;
  const ticketStatuses = asObject(state.ticketStatuses, stateFile, 'ticketStatuses');

  const snapshotFile = `${epicDir}/snapshots/${revisionId}.json`;
  const snapshot = readRecordFile(
    readRecord,
    snapshotFile,
    'darkmechanicus.plan-snapshot',
    `snapshot named by ${pointerFile} is missing`
  );
  expectEpic(snapshot, snapshotFile, epicId);
  if (snapshot.revisionId !== revisionId) {
    fail(snapshotFile, `revisionId does not match ${pointerFile}`);
  }
  const revision = asPositiveInteger(snapshot.number, snapshotFile, 'number');
  if (revision !== revisionNumber) {
    fail(
      snapshotFile,
      `number ${revision} does not match revisionNumber ${revisionNumber} in ${pointerFile}`
    );
  }
  const savedAt = asString(snapshot.savedAt, snapshotFile, 'savedAt');
  if (!ISO_DATE_TIME_PATTERN.test(savedAt)) {
    fail(snapshotFile, 'savedAt must be an ISO 8601 date-time');
  }

  const bundle = asObject(snapshot.bundle, snapshotFile, 'bundle');
  if (bundle.formatVersion !== PLAN_BUNDLE_FORMAT_VERSION) {
    fail(snapshotFile, `unknown plan bundle formatVersion ${String(bundle.formatVersion)}`);
  }
  const epic = asObject(bundle.epic, snapshotFile, 'bundle.epic');

  const sprintOrdinals = new Set<number>();
  const sprints = asArray(bundle.sprints, snapshotFile, 'bundle.sprints')
    .map((value, index) => {
      const where = `bundle.sprints[${index}]`;
      const sprint = asObject(value, snapshotFile, where);
      const ordinal = asPositiveInteger(sprint.ordinal, snapshotFile, `${where}.ordinal`);
      if (sprintOrdinals.has(ordinal)) {
        fail(snapshotFile, `sprint ordinal ${ordinal} is used twice`);
      }
      sprintOrdinals.add(ordinal);
      return {
        ordinal,
        goal: asString(sprint.goal, snapshotFile, `${where}.goal`),
        exitCriteria: criteriaText(sprint.exitCriteria, snapshotFile, `${where}.exitCriteria`),
        ticketIds: asArray(sprint.ticketIds, snapshotFile, `${where}.ticketIds`).map((id, at) =>
          asString(id, snapshotFile, `${where}.ticketIds[${at}]`)
        ),
      };
    })
    .sort((a, b) => a.ordinal - b.ordinal);

  const ticketsById = new Map<string, { key: string; title: string; optional: boolean }>();
  const keys = new Set<string>();
  asArray(bundle.tickets, snapshotFile, 'bundle.tickets').forEach((value, index) => {
    const where = `bundle.tickets[${index}]`;
    const ticket = asObject(value, snapshotFile, where);
    const id = asString(ticket.id, snapshotFile, `${where}.id`);
    const key = asString(ticket.key, snapshotFile, `${where}.key`);
    if (ticketsById.has(id)) fail(snapshotFile, `ticket id ${id} is used twice`);
    if (keys.has(key)) fail(snapshotFile, `display key ${key} is used twice`);
    keys.add(key);
    ticketsById.set(id, {
      key,
      title: asString(ticket.title, snapshotFile, `${where}.title`),
      optional: asBoolean(ticket.optional, snapshotFile, `${where}.optional`),
    });
  });

  // Tickets by sprint ordinal, then in the order each sprint lists them.
  const tickets: ExportedPlan['tickets'] = [];
  const positionById = new Map<string, number>();
  for (const sprint of sprints) {
    for (const id of sprint.ticketIds) {
      const ticket = ticketsById.get(id);
      if (ticket === undefined) {
        fail(snapshotFile, `sprint ${sprint.ordinal} lists unknown ticket ${id}`);
      }
      if (positionById.has(id)) {
        fail(snapshotFile, `ticket ${ticket.key} is in more than one sprint`);
      }
      const status = ticketStatuses[id];
      if (!isPlanStatus(status)) {
        fail(
          stateFile,
          `ticket ${ticket.key} has status "${String(status)}"; ` +
            `expected one of ${PLAN_STATUSES.join(', ')}`
        );
      }
      positionById.set(id, tickets.length);
      tickets.push({
        key: ticket.key,
        title: ticket.title,
        sprintOrdinal: sprint.ordinal,
        status,
        optional: ticket.optional,
      });
    }
  }
  for (const [id, ticket] of ticketsById) {
    if (!positionById.has(id)) fail(snapshotFile, `ticket ${ticket.key} is not in any sprint`);
  }

  const positionOf = (value: unknown, where: string): number => {
    const id = asString(value, snapshotFile, where);
    const position = positionById.get(id);
    if (position === undefined) fail(snapshotFile, `edge names unknown ticket ${id} (${where})`);
    return position;
  };
  const edges = asArray(bundle.edges, snapshotFile, 'bundle.edges')
    .map((value, index) => {
      const where = `bundle.edges[${index}]`;
      const edge = asObject(value, snapshotFile, where);
      return {
        from: positionOf(edge.from, `${where}.from`),
        to: positionOf(edge.to, `${where}.to`),
      };
    })
    .sort((a, b) => a.from - b.from || a.to - b.to)
    .map((edge) => ({ from: tickets[edge.from].key, to: tickets[edge.to].key }));

  const plan: ExportedPlan = {
    epic: {
      title: asString(epic.title, snapshotFile, 'bundle.epic.title'),
      successCriteria: criteriaText(
        epic.successCriteria,
        snapshotFile,
        'bundle.epic.successCriteria'
      ),
      status: epicStatus,
      revision,
      savedAt,
    },
    sprints: sprints.map(({ ordinal, goal, exitCriteria }) => ({ ordinal, goal, exitCriteria })),
    tickets,
    edges,
  };
  return `${JSON.stringify(sortKeys(plan), null, 2)}\n`;
}
