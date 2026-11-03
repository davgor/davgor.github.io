/// <reference types="vite/client" />
import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { DarkMechanicusPlan, PlanStatus } from '../types/darkMechanicusPlan';
import { layoutPlan, NODE_H, NODE_W } from './planLayout';

const STATUS_LABEL: Record<PlanStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'In progress',
  completed: 'Completed',
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isStatus = (v: unknown): v is PlanStatus =>
  isStr(v) && Object.prototype.hasOwnProperty.call(STATUS_LABEL, v);

/** Structural check of untrusted JSON; anything off means "malformed". */
function parsePlan(data: unknown): DarkMechanicusPlan | null {
  if (!isRecord(data) || data.schemaVersion !== 1) return null;
  const { epic, sprints, tickets, edges } = data;
  if (!isRecord(epic) || !isStr(epic.title) || typeof epic.revisionNumber !== 'number') {
    return null;
  }
  if (!Array.isArray(sprints) || !Array.isArray(tickets) || !Array.isArray(edges)) return null;
  const sprintsOk = sprints.every(
    (s) => isRecord(s) && typeof s.ordinal === 'number' && isStr(s.goal)
  );
  if (!sprintsOk) return null;
  const ordinals = new Set(sprints.map((s) => (s as { ordinal: number }).ordinal));
  const ticketsOk = tickets.every(
    (t) =>
      isRecord(t) &&
      isStr(t.key) &&
      isStr(t.title) &&
      isStatus(t.status) &&
      typeof t.sprint === 'number' &&
      ordinals.has(t.sprint)
  );
  const edgesOk = edges.every((e) => isRecord(e) && isStr(e.from) && isStr(e.to));
  return ticketsOk && edgesOk ? (data as unknown as DarkMechanicusPlan) : null;
}

/** A settled result for one URL; anything not yet settled for the current URL is "loading". */
type Settled = { url: string; plan: DarkMechanicusPlan | null };

function defaultUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.endsWith('/') ? base : `${base}/`}darkmechanicus/plan.json`;
}

interface Props {
  /** Override the plan location (defaults to `<BASE_URL>darkmechanicus/plan.json`). */
  url?: string;
}

const DarkMechanicusPlanView: React.FC<Props> = ({ url }) => {
  const [settled, setSettled] = useState<Settled | null>(null);
  const target = url ?? defaultUrl();

  useEffect(() => {
    const controller = new AbortController();
    const settle = (plan: DarkMechanicusPlan | null) => {
      if (!controller.signal.aborted) setSettled({ url: target, plan });
    };
    fetch(target, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<unknown>;
      })
      .then((data) => settle(parsePlan(data)))
      .catch(() => settle(null));
    return () => controller.abort();
  }, [target]);

  const current = settled?.url === target ? settled : null;

  return (
    <section className="plan-view" aria-labelledby="plan-view-title">
      {current?.plan ? (
        <PlanBody plan={current.plan} />
      ) : (
        <>
          <h3 id="plan-view-title" className="plan-view__title">
            Dark Mechanicus plan
          </h3>
          {current === null ? (
            <p className="plan-view__message" role="status">
              Loading plan…
            </p>
          ) : (
            <p className="plan-view__message plan-view__message--error" role="alert">
              The plan could not be loaded right now.
            </p>
          )}
        </>
      )}
    </section>
  );
};

const sizeVars = (s: { w: number; h: number }, prefix: string) =>
  ({ [`--${prefix}w`]: `${s.w}px`, [`--${prefix}h`]: `${s.h}px` }) as CSSProperties;

function formatSavedOn(iso: unknown): string | null {
  if (typeof iso !== 'string') return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const PlanBody: React.FC<{ plan: DarkMechanicusPlan }> = ({ plan }) => {
  const savedOn = formatSavedOn(plan.epic.savedAt);
  const sprints = layoutPlan(plan);
  const titleOf = new Map(plan.tickets.map((t) => [t.key, t.title]));
  const prereqsOf = (key: string) =>
    plan.edges.filter((e) => e.to === key && titleOf.has(e.from)).map((e) => e.from);

  return (
    <>
      <h3 id="plan-view-title" className="plan-view__title">
        {plan.epic.title}
      </h3>
      <p className="plan-view__meta">
        Read-only snapshot of the saved plan (revision {plan.epic.revisionNumber}
        {savedOn ? `, saved ${savedOn}` : ''}).
      </p>
      {sprints.map((sprint) => (
        <div className="plan-view__sprint" key={sprint.ordinal}>
          <h4 className="plan-view__sprint-title">
            Sprint {sprint.ordinal}
            <span className="plan-view__goal">{sprint.goal}</span>
          </h4>
          <div
            className="plan-view__scroller"
            // Scrollable region: focusable so keyboard users can scroll it; Tab still moves on.
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            role="region"
            aria-label={`Sprint ${sprint.ordinal} dependency diagram. The same information is in the text list below.`}
          >
            <div
              className="plan-view__canvas"
              aria-hidden="true"
              style={{ ...sizeVars(sprint.wideSize, ''), ...sizeVars(sprint.narrowSize, 'n') }}
            >
              {(['wide', 'narrow'] as const).map((layout) => {
                const size = layout === 'wide' ? sprint.wideSize : sprint.narrowSize;
                const markerId = `plan-arrow-${sprint.ordinal}-${layout}`;
                return (
                  <svg
                    key={layout}
                    className={`plan-view__edges plan-view__edges--${layout}`}
                    data-layout={layout}
                    width={size.w}
                    height={size.h}
                    focusable="false"
                  >
                    <defs>
                      <marker
                        id={markerId}
                        viewBox="0 0 10 10"
                        refX="9"
                        refY="5"
                        markerWidth="7"
                        markerHeight="7"
                        orient="auto"
                      >
                        <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
                      </marker>
                    </defs>
                    {sprint.edges.map((e) => (
                      <path
                        key={`${e.edge.from}-${e.edge.to}`}
                        data-edge={`${e.edge.from}>${e.edge.to}`}
                        d={e[layout]}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        markerEnd={`url(#${markerId})`}
                      />
                    ))}
                  </svg>
                );
              })}
              {sprint.nodes.map((n) => {
                const outside = sprint.external.get(n.ticket.key) ?? [];
                return (
                  <div
                    key={n.ticket.key}
                    className={`plan-view__node plan-view__node--${n.ticket.status}`}
                    data-testid="plan-node"
                    data-depth={n.depth}
                    style={
                      {
                        '--wx': `${n.wide.x}px`,
                        '--wy': `${n.wide.y}px`,
                        '--nx': `${n.narrow.x}px`,
                        '--ny': `${n.narrow.y}px`,
                        width: NODE_W,
                        minHeight: NODE_H,
                      } as CSSProperties
                    }
                  >
                    <span className="plan-view__key">{n.ticket.key}</span>
                    <span className="plan-view__ticket-title">{n.ticket.title}</span>
                    <span className="plan-view__status">
                      <span className="plan-view__status-mark" aria-hidden="true" />
                      Status: {STATUS_LABEL[n.ticket.status]}
                      {n.ticket.optional ? ' (optional)' : ''}
                    </span>
                    {outside.length > 0 && (
                      <span className="plan-view__external">Also after {outside.join(', ')}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      <details className="plan-view__text" open>
        <summary>Plan as a text list</summary>
        {sprints.map((sprint) => (
          <div key={sprint.ordinal}>
            <h4 className="plan-view__sprint-title">
              Sprint {sprint.ordinal}: {sprint.goal}
            </h4>
            <ul data-testid="plan-list">
              {sprint.nodes.map((n) => {
                const reqs = prereqsOf(n.ticket.key);
                return (
                  <li key={n.ticket.key}>
                    {`Sprint ${sprint.ordinal} · ${n.ticket.key} ${n.ticket.title}, status: ${STATUS_LABEL[
                      n.ticket.status
                    ].toLowerCase()}${n.ticket.optional ? ', optional' : ''}, ${
                      reqs.length > 0 ? `requires ${reqs.join(', ')}` : 'no prerequisites'
                    }`}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </details>
    </>
  );
};

export default DarkMechanicusPlanView;
