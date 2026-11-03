import type { DarkMechanicusPlan, PlanEdge, PlanTicket } from '../types/darkMechanicusPlan';

export const NODE_W = 208;
export const NODE_H = 96;
const COL_GAP = 64;
const ROW_GAP = 16;
const PAD = 12;
const LANE = 14;

interface PlacedTicket {
  ticket: PlanTicket;
  depth: number;
  row: number;
  /** Position in the left-to-right layout. */
  wide: { x: number; y: number };
  /** Position in the stacked (narrow) layout. */
  narrow: { x: number; y: number };
}

interface PlacedEdge {
  edge: PlanEdge;
  wide: string;
  narrow: string;
}

interface SprintLayout {
  ordinal: number;
  goal: string;
  nodes: PlacedTicket[];
  /** Edges whose endpoints are both in this sprint (the ones that can be drawn). */
  edges: PlacedEdge[];
  /** Prerequisites held by other sprints, by ticket key. */
  external: Map<string, string[]>;
  wideSize: { w: number; h: number };
  narrowSize: { w: number; h: number };
}

/** Longest prerequisite chain length within one sprint; cycles are cut instead of looping. */
function computeDepths(keys: string[], edges: PlanEdge[]): Map<string, number> {
  const prereqs = new Map<string, string[]>(keys.map((k) => [k, []]));
  for (const e of edges) prereqs.get(e.to)?.push(e.from);
  const depth = new Map<string, number>();
  const visiting = new Set<string>();
  const visit = (key: string): number => {
    const known = depth.get(key);
    if (known !== undefined) return known;
    if (visiting.has(key)) return 0;
    visiting.add(key);
    let d = 0;
    for (const p of prereqs.get(key) ?? []) d = Math.max(d, visit(p) + 1);
    visiting.delete(key);
    depth.set(key, d);
    return d;
  };
  keys.forEach(visit);
  return depth;
}

export function layoutPlan(plan: DarkMechanicusPlan): SprintLayout[] {
  const sprintOf = new Map(plan.tickets.map((t) => [t.key, t.sprint]));
  const edges = plan.edges.filter((e) => sprintOf.has(e.from) && sprintOf.has(e.to));

  return [...plan.sprints]
    .sort((a, b) => a.ordinal - b.ordinal)
    .map((sprint) => {
      const tickets = plan.tickets.filter((t) => t.sprint === sprint.ordinal);
      const keys = tickets.map((t) => t.key);
      const inSprint = edges.filter(
        (e) => sprintOf.get(e.from) === sprint.ordinal && sprintOf.get(e.to) === sprint.ordinal
      );
      const depths = computeDepths(keys, inSprint);
      const rowCounts = new Map<number, number>();
      const nodes: PlacedTicket[] = tickets.map((ticket) => {
        const depth = depths.get(ticket.key) ?? 0;
        const row = rowCounts.get(depth) ?? 0;
        rowCounts.set(depth, row + 1);
        return {
          ticket,
          depth,
          row,
          wide: {
            x: PAD + depth * (NODE_W + COL_GAP),
            y: PAD + row * (NODE_H + ROW_GAP),
          },
          narrow: { x: PAD, y: 0 },
        };
      });
      // Stacked layout: waves top to bottom, one node per row.
      [...nodes]
        .sort((a, b) => a.depth - b.depth || a.row - b.row)
        .forEach((n, i) => {
          n.narrow.y = PAD + i * (NODE_H + ROW_GAP);
        });

      const byKey = new Map(nodes.map((n) => [n.ticket.key, n]));
      const placedEdges: PlacedEdge[] = inSprint.flatMap((edge, i) => {
        const from = byKey.get(edge.from);
        const to = byKey.get(edge.to);
        if (!from || !to) return [];
        const x1 = from.wide.x + NODE_W;
        const y1 = from.wide.y + NODE_H / 2;
        const x2 = to.wide.x;
        const y2 = to.wide.y + NODE_H / 2;
        const mid = (x1 + x2) / 2;
        const wide = `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
        const lane = PAD + NODE_W + 8 + (i % 4) * LANE;
        const ny1 = from.narrow.y + NODE_H / 2;
        const ny2 = to.narrow.y + NODE_H / 2;
        const narrow = `M${PAD + NODE_W} ${ny1} H${lane} V${ny2} H${PAD + NODE_W}`;
        return [{ edge, wide, narrow }];
      });

      const external = new Map<string, string[]>();
      for (const e of edges) {
        if (sprintOf.get(e.to) === sprint.ordinal && sprintOf.get(e.from) !== sprint.ordinal) {
          external.set(e.to, [...(external.get(e.to) ?? []), e.from]);
        }
      }

      const cols = Math.max(1, ...nodes.map((n) => n.depth + 1));
      const maxRows = Math.max(1, ...rowCounts.values());
      const count = Math.max(1, nodes.length);
      return {
        ordinal: sprint.ordinal,
        goal: sprint.goal,
        nodes,
        edges: placedEdges,
        external,
        wideSize: {
          w: PAD * 2 + cols * NODE_W + (cols - 1) * COL_GAP,
          h: PAD * 2 + maxRows * NODE_H + (maxRows - 1) * ROW_GAP,
        },
        narrowSize: {
          w: PAD * 2 + NODE_W + 8 + 4 * LANE,
          h: PAD * 2 + count * NODE_H + (count - 1) * ROW_GAP,
        },
      };
    });
}
