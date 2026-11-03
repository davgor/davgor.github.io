/**
 * Vite plugin: serves the sanitized Dark Mechanicus plan at /darkmechanicus/plan.json in dev and
 * preview, and emits it into dist/ on build. Generated, never committed.
 */
import { exportPlan, serializePlan } from './export-dm-plan.mjs';

const FILE_NAME = 'darkmechanicus/plan.json';

/** @param {{ root?: string, epicId?: string }} [options] */
export function darkMechanicusPlan(options = {}) {
  let root = options.root ?? process.cwd();
  let base = '/';
  const generate = () => serializePlan(exportPlan(root, options.epicId));
  const middleware = (server) => {
    server.middlewares.use((req, res, next) => {
      const path = (req.url ?? '').split('?')[0];
      if (path !== `${base}${FILE_NAME}` && path !== `/${FILE_NAME}`) return next();
      try {
        const body = generate();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(body);
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(error.message);
      }
    });
  };
  return {
    name: 'darkmechanicus-plan',
    configResolved(config) {
      root = options.root ?? config.root;
      base = config.base.endsWith('/') ? config.base : `${config.base}/`;
    },
    configureServer: middleware,
    configurePreviewServer: middleware,
    // Throws (failing the build) when the records are missing or malformed.
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: FILE_NAME, source: generate() });
    },
  };
}
