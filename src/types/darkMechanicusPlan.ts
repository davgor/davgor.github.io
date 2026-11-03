/** Shape of /darkmechanicus/plan.json (see scripts/export-dm-plan.mjs). Allowlisted fields only. */
export type PlanStatus = 'backlog' | 'in_progress' | 'completed';

export interface PlanCriterion {
  id: string;
  text: string;
}

export interface PlanEpic {
  title: string;
  status: PlanStatus;
  revisionNumber: number;
  /** ISO date-time the revision was saved. */
  savedAt: string;
  successCriteria: PlanCriterion[];
}

export interface PlanSprint {
  ordinal: number;
  goal: string;
  exitCriteria: PlanCriterion[];
}

export interface PlanTicket {
  /** Display key, e.g. "DGI-3". */
  key: string;
  title: string;
  /** Ordinal of the sprint holding the ticket. */
  sprint: number;
  status: PlanStatus;
  optional: boolean;
}

/** `to` requires `from`'s accepted result. Both are display keys. */
export interface PlanEdge {
  from: string;
  to: string;
}

export interface DarkMechanicusPlan {
  schemaVersion: 1;
  epic: PlanEpic;
  sprints: PlanSprint[];
  tickets: PlanTicket[];
  edges: PlanEdge[];
}
