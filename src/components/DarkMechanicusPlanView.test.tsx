/// <reference types="node" />
/// <reference types="vite/client" />
import { render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolve } from 'node:path';
import { exportPlan, PLAN_EPIC_ID } from '../../scripts/export-dm-plan.mjs';
import DarkMechanicusPlanView from './DarkMechanicusPlanView';
import { layoutPlan } from './planLayout';
import type { DarkMechanicusPlan } from '../types/darkMechanicusPlan';

const FIXTURE = resolve(import.meta.dirname, '../../scripts/__fixtures__/dm-plan');
const plan = exportPlan(FIXTURE, PLAN_EPIC_ID);

function mockFetch(body: unknown, ok = true) {
  const fn = vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => (body instanceof Error ? Promise.reject(body) : Promise.resolve(body)),
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe('DarkMechanicusPlanView with the DGI-3 fixture', () => {
  it('a1: renders sprints with goals, depth columns, keys, titles and status text', async () => {
    mockFetch(plan);
    render(<DarkMechanicusPlanView />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    await screen.findByText(plan.epic.title);

    for (const sprint of plan.sprints) {
      expect(screen.getAllByText(sprint.goal).length).toBeGreaterThan(0);
    }
    const nodes = screen.getAllByTestId('plan-node');
    expect(nodes).toHaveLength(plan.tickets.length);
    const depthOf = (key: string) =>
      Number(nodes.find((n) => within(n).queryByText(key))!.getAttribute('data-depth'));
    expect(depthOf('DGI-1')).toBe(0);
    expect(depthOf('DGI-2')).toBe(0);
    expect(depthOf('DGI-3')).toBe(0);
    expect(depthOf('DGI-4')).toBe(1);
    expect(depthOf('DGI-5')).toBe(2);
    expect(depthOf('DGI-6')).toBe(3);

    const labels = { backlog: 'Backlog', in_progress: 'In progress', completed: 'Completed' };
    for (const t of plan.tickets) {
      const node = nodes.find((n) => within(n).queryByText(t.key))!;
      expect(within(node).getByText(t.title)).toBeInTheDocument();
      expect(node).toHaveTextContent(`Status: ${labels[t.status]}`);
    }
  });

  it('a2: draws every edge in both layouts and names prerequisites in the list', async () => {
    mockFetch(plan);
    const { container } = render(<DarkMechanicusPlanView />);
    await screen.findByText(plan.epic.title);

    for (const layout of ['wide', 'narrow']) {
      const paths = container.querySelectorAll(`svg[data-layout="${layout}"] path[data-edge]`);
      expect([...paths].map((p) => p.getAttribute('data-edge')).sort()).toEqual(
        plan.edges.map((e) => `${e.from}>${e.to}`).sort()
      );
    }

    const items = within(screen.getByTestId('plan-list'))
      .getAllByRole('listitem')
      .map((li) => li.textContent);
    expect(items).toHaveLength(plan.tickets.length);
    expect(items).toContain(
      'Sprint 1 · DGI-4 Build the read-only plan view component, status: backlog, requires DGI-3'
    );
    expect(items.find((t) => t!.includes('DGI-5 '))).toContain('requires DGI-1, DGI-2, DGI-4');
    expect(items.find((t) => t!.includes('DGI-1 '))).toContain('no prerequisites');
  });

  it('contains no editing or run affordances', async () => {
    mockFetch(plan);
    render(<DarkMechanicusPlanView />);
    await screen.findByText(plan.epic.title);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });
});

describe('DarkMechanicusPlanView failures', () => {
  it('a3: shows a message when the fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network')));
    render(<DarkMechanicusPlanView />);
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be loaded');
  });

  it('a3: shows a message for an HTTP error', async () => {
    mockFetch({}, false);
    render(<DarkMechanicusPlanView />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('a3: shows a message for unparseable JSON', async () => {
    mockFetch(new SyntaxError('Unexpected token <'));
    render(<DarkMechanicusPlanView />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it.each([
    ['wrong shape', { hello: 'world' }],
    ['null', null],
    ['unknown status', { ...plan, tickets: [{ ...plan.tickets[0], status: 'weird' }] }],
    ['ticket in missing sprint', { ...plan, tickets: [{ ...plan.tickets[0], sprint: 9 }] }],
    ['wrong schema version', { ...plan, schemaVersion: 2 }],
  ])('a3: shows a message for malformed JSON (%s)', async (_name, body) => {
    mockFetch(body);
    render(<DarkMechanicusPlanView />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('requests the plan under the Vite base URL', async () => {
    const fn = mockFetch(plan);
    render(<DarkMechanicusPlanView />);
    await waitFor(() => expect(fn).toHaveBeenCalled());
    expect(fn.mock.calls[0][0]).toBe(`${import.meta.env.BASE_URL}darkmechanicus/plan.json`);
  });
});

describe('layoutPlan', () => {
  const multi: DarkMechanicusPlan = {
    ...plan,
    sprints: [
      { ordinal: 2, goal: 'Second', exitCriteria: [] },
      { ordinal: 1, goal: 'First', exitCriteria: [] },
    ],
    tickets: [
      { key: 'A-1', title: 'a', sprint: 1, status: 'completed', optional: false },
      { key: 'A-2', title: 'b', sprint: 1, status: 'backlog', optional: false },
      { key: 'B-1', title: 'c', sprint: 2, status: 'backlog', optional: false },
      { key: 'B-2', title: 'd', sprint: 2, status: 'backlog', optional: true },
    ],
    edges: [
      { from: 'A-1', to: 'A-2' },
      { from: 'A-2', to: 'B-1' },
      { from: 'B-1', to: 'B-2' },
      { from: 'B-2', to: 'B-1' },
    ],
  };

  it('orders sprints, restarts depth per sprint and survives cycles', () => {
    const layout = layoutPlan(multi);
    expect(layout.map((s) => s.ordinal)).toEqual([1, 2]);
    expect(layout[0].nodes.map((n) => n.depth)).toEqual([0, 1]);
    expect(layout[1].nodes.map((n) => n.depth).every(Number.isFinite)).toBe(true);
    expect(layout[1].external.get('B-1')).toEqual(['A-2']);
  });

  it('renders multi-sprint plans in order with cross-sprint prerequisites in the list', async () => {
    mockFetch(multi);
    render(<DarkMechanicusPlanView />);
    await screen.findByText(plan.epic.title);
    const headings = screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent);
    expect(headings.slice(0, 2)).toEqual(['Sprint 1First', 'Sprint 2Second']);
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items.find((t) => t!.includes('B-1'))).toContain('requires A-2, B-2');
  });

  it('stacks the narrow layout one node per row, wave by wave', () => {
    const [sprint] = layoutPlan(plan);
    const ys = [...sprint.nodes]
      .sort((a, b) => a.depth - b.depth || a.row - b.row)
      .map((n) => n.narrow.y);
    expect(new Set(ys).size).toBe(plan.tickets.length);
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
  });
});

describe('layoutPlan geometry', () => {
  it('places fixture nodes in exact wide and stacked positions', () => {
    const [sprint] = layoutPlan(plan);
    const at = (key: string) => sprint.nodes.find((n) => n.ticket.key === key)!;
    expect(sprint.nodes.map((n) => [n.ticket.key, n.depth, n.row])).toEqual([
      ['DGI-1', 0, 0],
      ['DGI-2', 0, 1],
      ['DGI-3', 0, 2],
      ['DGI-4', 1, 0],
      ['DGI-5', 2, 0],
      ['DGI-6', 3, 0],
    ]);
    expect(at('DGI-2').wide).toEqual({ x: 12, y: 124 });
    expect(at('DGI-3').wide).toEqual({ x: 12, y: 236 });
    expect(at('DGI-4').wide).toEqual({ x: 284, y: 12 });
    expect(at('DGI-6').wide).toEqual({ x: 828, y: 12 });
    expect(sprint.nodes.map((n) => n.narrow)).toEqual(
      [12, 124, 236, 348, 460, 572].map((y) => ({ x: 12, y }))
    );
    expect(sprint.wideSize).toEqual({ w: 1048, h: 344 });
    expect(sprint.narrowSize).toEqual({ w: 296, h: 680 });
  });

  it('routes edges from the right of a prerequisite to the left of its dependant', () => {
    const [sprint] = layoutPlan(plan);
    const path = (from: string, to: string) =>
      sprint.edges.find((e) => e.edge.from === from && e.edge.to === to)!;
    expect(path('DGI-3', 'DGI-4').wide).toBe('M220 284 C252 284 252 60 284 60');
    expect(path('DGI-1', 'DGI-5').wide).toBe('M220 60 C388 60 388 60 556 60');
    expect(path('DGI-3', 'DGI-4').narrow).toBe('M220 284 H256 V396 H220');
    expect(path('DGI-5', 'DGI-6').narrow).toBe('M220 508 H228 V620 H220');
  });

  it('sizes the drawing surfaces from the layout', async () => {
    mockFetch(plan);
    const { container } = render(<DarkMechanicusPlanView />);
    await screen.findByText(plan.epic.title);
    const wide = container.querySelector('svg[data-layout="wide"]')!;
    const narrow = container.querySelector('svg[data-layout="narrow"]')!;
    expect([wide.getAttribute('width'), wide.getAttribute('height')]).toEqual(['1048', '344']);
    expect([narrow.getAttribute('width'), narrow.getAttribute('height')]).toEqual(['296', '680']);
    const canvas = container.querySelector('.plan-view__canvas') as HTMLElement;
    expect(canvas.style.getPropertyValue('--w')).toBe('1048px');
    expect(canvas.style.getPropertyValue('--nh')).toBe('680px');
  });

  const multi: DarkMechanicusPlan = {
    ...plan,
    sprints: [
      { ordinal: 1, goal: 'First', exitCriteria: [] },
      { ordinal: 2, goal: 'Second', exitCriteria: [] },
    ],
    tickets: [
      { key: 'A-1', title: 'a', sprint: 1, status: 'completed', optional: false },
      { key: 'B-1', title: 'c', sprint: 2, status: 'backlog', optional: false },
      { key: 'B-2', title: 'd', sprint: 2, status: 'in_progress', optional: true },
    ],
    edges: [
      { from: 'A-1', to: 'B-1' },
      { from: 'B-1', to: 'B-2' },
      { from: 'B-2', to: 'B-1' },
      { from: 'GHOST-1', to: 'B-1' },
    ],
  };

  it('cuts cycles deterministically, ignores unknown keys and keeps cross-sprint edges off the drawing', () => {
    const [first, second] = layoutPlan(multi);
    expect(second.nodes.map((n) => [n.ticket.key, n.depth])).toEqual([
      ['B-1', 2],
      ['B-2', 1],
    ]);
    expect(first.edges).toEqual([]);
    expect(second.edges.map((e) => `${e.edge.from}>${e.edge.to}`)).toEqual(['B-1>B-2', 'B-2>B-1']);
    expect(second.external.get('B-1')).toEqual(['A-1']);
    expect(second.external.has('B-2')).toBe(false);
  });

  it('labels optional tickets and cross-sprint prerequisites in the node', async () => {
    mockFetch(multi);
    render(<DarkMechanicusPlanView />);
    await screen.findByText(plan.epic.title);
    const nodes = screen.getAllByTestId('plan-node');
    const byKey = (k: string) => nodes.find((n) => within(n).queryByText(k))!;
    expect(byKey('A-1')).toHaveTextContent('Status: Completed');
    expect(byKey('A-1')).not.toHaveTextContent('Also after');
    expect(byKey('B-1')).toHaveTextContent('Also after A-1');
    expect(byKey('B-2')).toHaveTextContent('Status: In progress (optional)');
    expect(byKey('B-1')).not.toHaveTextContent('optional');
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items.find((t) => t!.includes('B-2 '))).toContain('in progress, optional, requires B-1');
    expect(items.find((t) => t!.includes('B-1 '))).toContain('requires A-1, B-2');
    expect(items.find((t) => t!.includes('B-1 '))).not.toContain('GHOST');
  });

  it('shows a loading status before the plan settles', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {}))
    );
    render(<DarkMechanicusPlanView />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading plan');
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
