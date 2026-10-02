/**
 * Vite plugin that serves the sanitized Dark Mechanicus plan at `<base>darkmechanicus/plan.json`.
 *
 * - `npm run dev`: the JSON is regenerated from the records on every request, so edits to
 *   `.darkmechanicus/` show without a restart. A broken export is logged when the server starts
 *   and answers the request with a 500 whose plain-text body names the broken file.
 * - `npm run build`: the JSON is emitted into `dist/darkmechanicus/plan.json`; a broken export
 *   fails the build.
 *
 * The JSON is generated, never committed, and needs no Dark Mechanicus install: it only reads the
 * committed JSON records. This module runs in Node (from `vite.config.ts`), not in the browser.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { DARKMECHANICUS_PLAN_EPIC_ID } from './config';
import { exportPlan } from './planExport';

const PLAN_FILE = 'darkmechanicus/plan.json';

interface DevResponse {
  statusCode: number;
  setHeader(name: string, value: string): unknown;
  end(body: string): unknown;
}

type DevHandler = (req: { url?: string }, res: DevResponse, next: () => void) => void;

/** The parts of Vite's dev server the plugin uses. */
interface DevServer {
  middlewares: { use(handler: DevHandler): unknown };
  config: { logger: { error(message: string): unknown } };
}

/** The parts of Rollup's plugin context the plugin uses. */
interface BuildContext {
  emitFile(file: { type: 'asset'; fileName: string; source: string }): string;
  error(message: string): never;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Reads a repository-relative file; `undefined` only when it does not exist. */
function readRepositoryFile(root: string, path: string): string | undefined {
  try {
    return readFileSync(join(root, path), 'utf8');
  } catch (error) {
    if ((error as { code?: unknown } | null)?.code === 'ENOENT') return undefined;
    throw new Error(
      `Dark Mechanicus plan export failed: ${path}: could not be read (${messageOf(error)})`
    );
  }
}

export function darkmechanicusPlanPlugin(epicId: string = DARKMECHANICUS_PLAN_EPIC_ID) {
  let root = '';
  let planPath = `/${PLAN_FILE}`;
  const generate = (): string =>
    exportPlan({ epicId, readRecord: (path) => readRepositoryFile(root, path) });

  return {
    name: 'darkmechanicus-plan',

    configResolved(config: { root: string; base: string }) {
      root = config.root;
      planPath = new URL(PLAN_FILE, new URL(config.base, 'http://localhost/')).pathname;
    },

    configureServer(server: DevServer) {
      const logError = (error: unknown): string => {
        const message = messageOf(error);
        server.config.logger.error(message);
        return message;
      };
      try {
        generate();
      } catch (error) {
        logError(error);
      }
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== planPath) {
          next();
          return;
        }
        try {
          const json = generate();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(json);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(logError(error));
        }
      });
    },

    generateBundle(this: BuildContext) {
      try {
        this.emitFile({ type: 'asset', fileName: PLAN_FILE, source: generate() });
      } catch (error) {
        this.error(messageOf(error));
      }
    },
  } satisfies Plugin;
}
