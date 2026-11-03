/**
 * Exports the committed Dark Mechanicus portable records of ONE configured epic as a sanitized,
 * static plan JSON for the site. Output is built from an allowlist: every exported field is
 * copied by name; nothing is passed through. Fails loudly (naming the file) on bad input.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** The one epic the site shows. Change this id to point the plan view at another epic. */
export const PLAN_EPIC_ID = 'ep_01m3tyvkcv6kzg24j40g1mzh87';

const STATUSES = ['backlog', 'in_progress', 'completed'];

function fail(file, message) {
  throw new Error(`Dark Mechanicus plan export: ${file}: ${message}`);
}

function readJson(file) {
  if (!existsSync(file)) fail(file, 'file is missing');
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    return fail(file, `invalid JSON (${error.message})`);
  }
}

function checkFormat(file, data, format) {
  if (data === null || typeof data !== 'object') fail(file, 'expected a JSON object');
  if (data.format !== format) {
    fail(file, `unknown format ${JSON.stringify(data.format)}, expected "${format}"`);
  }
  if (data.formatVersion !== 1) {
    fail(file, `unknown formatVersion ${JSON.stringify(data.formatVersion)}, expected 1`);
  }
}

function requireString(file, value, what) {
  if (typeof value !== 'string' || value.length === 0) {
    fail(file, `${what} must be a non-empty string`);
  }
  return value;
}

function requireArray(file, value, what) {
  if (!Array.isArray(value)) fail(file, `${what} must be an array`);
  return value;
}

function criteria(file, list, what) {
  return requireArray(file, list ?? [], what).map((c, i) => ({
    id: requireString(file, c?.id, `${what}[${i}].id`),
    text: requireString(file, c?.text, `${what}[${i}].text`),
  }));
}

function splitKey(key) {
  const m = /^(.*?)-?(\d+)$/.exec(key);
  return m ? [m[1], Number(m[2])] : [key, 0];
}

function keyOrder(a, b) {
  const [pa, na] = splitKey(a);
  const [pb, nb] = splitKey(b);
  if (pa !== pb) return pa < pb ? -1 : 1;
  return na - nb;
}

/**
 * @param {string} root checkout root containing `.darkmechanicus/`
 * @param {string} [epicId]
 */
export function exportPlan(root, epicId = PLAN_EPIC_ID) {
  const dir = join(root, '.darkmechanicus', 'epics', epicId);
  const pointerFile = join(dir, 'current.json');
  const stateFile = join(dir, 'state.json');

  const pointer = readJson(pointerFile);
  checkFormat(pointerFile, pointer, 'darkmechanicus.epic-pointer');
  const revisionId = requireString(pointerFile, pointer.revisionId, 'revisionId');
  if (!/^[A-Za-z0-9_-]+$/.test(revisionId)) {
    fail(pointerFile, 'revisionId has invalid characters');
  }

  const state = readJson(stateFile);
  checkFormat(stateFile, state, 'darkmechanicus.epic-state');
  if (!STATUSES.includes(state.status)) {
    fail(stateFile, `unknown status ${JSON.stringify(state.status)}`);
  }
  if (state.ticketStatuses === null || typeof state.ticketStatuses !== 'object') {
    fail(stateFile, 'ticketStatuses must be an object');
  }

  const snapshotFile = join(dir, 'snapshots', `${revisionId}.json`);
  const snapshot = readJson(snapshotFile);
  checkFormat(snapshotFile, snapshot, 'darkmechanicus.plan-snapshot');
  const bundle = snapshot.bundle;
  if (bundle === null || typeof bundle !== 'object') {
    fail(snapshotFile, 'bundle must be an object');
  }

  const tickets = requireArray(snapshotFile, bundle.tickets, 'bundle.tickets');
  if (tickets.length === 0) fail(snapshotFile, 'plan has no tickets');
  const sprints = requireArray(snapshotFile, bundle.sprints, 'bundle.sprints');
  if (sprints.length === 0) fail(snapshotFile, 'plan has no sprints');

  const ticketsById = new Map();
  for (const t of tickets) {
    const id = requireString(snapshotFile, t?.id, 'ticket id');
    if (ticketsById.has(id)) fail(snapshotFile, 'duplicate ticket id in plan');
    requireString(snapshotFile, t.key, 'ticket key');
    requireString(snapshotFile, t.title, `ticket ${t.key} title`);
    ticketsById.set(id, t);
  }

  const sprintOf = new Map();
  for (const s of sprints) {
    if (!Number.isInteger(s?.ordinal)) fail(snapshotFile, 'sprint ordinal must be an integer');
    for (const id of requireArray(snapshotFile, s.ticketIds, `sprint ${s.ordinal} ticketIds`)) {
      if (!ticketsById.has(id)) fail(snapshotFile, `sprint ${s.ordinal} names an unknown ticket`);
      sprintOf.set(id, s.ordinal);
    }
  }

  const outTickets = [...ticketsById].map(([id, t]) => {
    if (!sprintOf.has(id)) fail(snapshotFile, `ticket ${t.key} is in no sprint`);
    const status = state.ticketStatuses[id];
    if (!STATUSES.includes(status)) {
      fail(stateFile, `ticket ${t.key} has no valid status (got ${JSON.stringify(status)})`);
    }
    return {
      key: t.key,
      title: t.title,
      sprint: sprintOf.get(id),
      status,
      optional: t.optional === true,
    };
  });
  outTickets.sort((a, b) => a.sprint - b.sprint || keyOrder(a.key, b.key));

  const keyOf = (id) => ticketsById.get(id).key;
  const outEdges = requireArray(snapshotFile, bundle.edges ?? [], 'bundle.edges').map((e) => {
    for (const end of ['from', 'to']) {
      if (!ticketsById.has(e?.[end])) fail(snapshotFile, `edge ${end} names an unknown ticket`);
    }
    return { from: keyOf(e.from), to: keyOf(e.to) };
  });
  outEdges.sort((a, b) => keyOrder(a.from, b.from) || keyOrder(a.to, b.to));

  const epic = bundle.epic;
  return {
    schemaVersion: 1,
    epic: {
      title: requireString(snapshotFile, epic?.title, 'epic title'),
      status: state.status,
      revisionNumber: snapshot.number,
      savedAt: requireString(snapshotFile, snapshot.savedAt, 'savedAt'),
      successCriteria: criteria(snapshotFile, epic.successCriteria, 'epic.successCriteria'),
    },
    sprints: sprints
      .map((s) => ({
        ordinal: s.ordinal,
        goal: requireString(snapshotFile, s.goal, `sprint ${s.ordinal} goal`),
        exitCriteria: criteria(snapshotFile, s.exitCriteria, `sprint ${s.ordinal} exitCriteria`),
      }))
      .sort((a, b) => a.ordinal - b.ordinal),
    tickets: outTickets,
    edges: outEdges,
  };
}

/** Stable text form of an exported plan. */
export function serializePlan(plan) {
  return `${JSON.stringify(plan, null, 2)}\n`;
}
