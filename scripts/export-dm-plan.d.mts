import type { DarkMechanicusPlan } from '../src/types/darkMechanicusPlan';

export const PLAN_EPIC_ID: string;
export function exportPlan(root: string, epicId?: string): DarkMechanicusPlan;
export function serializePlan(plan: DarkMechanicusPlan): string;
