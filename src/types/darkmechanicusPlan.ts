/** Work statuses of Dark Mechanicus epics and tickets (`darkmechanicus.epic-state` v1). */
export const PLAN_STATUSES = ['backlog', 'in_progress', 'completed'] as const;

type PlanStatus = (typeof PLAN_STATUSES)[number];

/**
 * The sanitized plan the site serves at `${import.meta.env.BASE_URL}darkmechanicus/plan.json`.
 *
 * Generated at dev/build time from committed `.darkmechanicus/` records by
 * `src/darkmechanicus/planExport.ts`. Every field here is allowlisted; nothing else is exported
 * (no ids, paths, ticket bodies, references, comments, branches or run history).
 * Keys are sorted and arrays are in a stable order, so the same records give byte-identical JSON.
 */
export interface ExportedPlan {
  epic: {
    title: string;
    /** Success-criteria text, in plan order. */
    successCriteria: string[];
    status: PlanStatus;
    /** Display number of the saved revision (1, 2, ...). */
    revision: number;
    /** When that revision was saved (ISO 8601, from the records; never the export time). */
    savedAt: string;
  };
  /** Sprints in ordinal order. */
  sprints: Array<{
    ordinal: number;
    goal: string;
    /** Exit-criteria text, in plan order. */
    exitCriteria: string[];
  }>;
  /** Tickets by sprint ordinal, then in the order the sprint lists them. */
  tickets: Array<{
    /** Display key, e.g. `DGI-3`. Unique within the plan. */
    key: string;
    title: string;
    sprintOrdinal: number;
    status: PlanStatus;
    optional: boolean;
  }>;
  /**
   * Dependency edges by display key: `{ from: 'DGI-3', to: 'DGI-4' }` means DGI-4 requires
   * DGI-3. Sorted by the position of `from`, then `to`, in `tickets`.
   */
  edges: Array<{ from: string; to: string }>;
}
