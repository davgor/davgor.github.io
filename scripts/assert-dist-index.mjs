/**
 * CLI guard for dist/index.html (and optional live-site HTML via argv).
 * Keep regexes in sync with src/deploy/assertProductionHtml.ts
 */
import { readFileSync } from 'node:fs';

export function isProductionIndexHtml(html) {
  const hasDevEntry = /src=["']\/src\/main\.tsx["']/.test(html);
  const hasHashedAsset =
    /src=["'][^"']*\/assets\/[^"']+\.(js|mjs)["']/.test(html) ||
    /href=["'][^"']*\/assets\/[^"']+\.css["']/.test(html);
  return !hasDevEntry && hasHashedAsset;
}

const label = process.argv[2] ?? 'dist/index.html';
const html = label.startsWith('http://') || label.startsWith('https://')
  ? await (await fetch(label)).text()
  : readFileSync(label, 'utf8');

if (!isProductionIndexHtml(html)) {
  console.error(
    `${label} looks like a Vite dev entry (or is missing hashed /assets bundles).`,
  );
  console.error(
    'GitHub Pages must serve the Vite dist/ build via Actions, not the repo-root source.',
  );
  console.error('Check Settings → Pages → Source = GitHub Actions.');
  process.exit(1);
}

console.log(`OK: ${label} looks like a production Vite build`);
