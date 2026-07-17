import { describe, expect, it } from 'vitest';
import { assertProductionIndexHtml, isProductionIndexHtml } from './assertProductionHtml';

const DEV_HTML = `<!doctype html>
<html lang="en">
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

const PRODUCTION_HTML = `<!doctype html>
<html lang="en">
  <head>
    <script type="module" crossorigin src="/assets/index-abc123.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-abc123.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

describe('isProductionIndexHtml', () => {
  it('rejects the Vite dev entry that causes a white page on GitHub Pages', () => {
    expect(isProductionIndexHtml(DEV_HTML)).toBe(false);
  });

  it('accepts a Vite production index with hashed /assets bundles', () => {
    expect(isProductionIndexHtml(PRODUCTION_HTML)).toBe(true);
  });

  it('rejects HTML that still points at /src/main.tsx even if assets exist', () => {
    const mixed = PRODUCTION_HTML.replace(
      '</body>',
      '<script type="module" src="/src/main.tsx"></script></body>'
    );
    expect(isProductionIndexHtml(mixed)).toBe(false);
  });

  it('rejects HTML with neither a hashed JS nor CSS asset', () => {
    expect(isProductionIndexHtml('<html><body><div id="root"></div></body></html>')).toBe(false);
  });
});

describe('assertProductionIndexHtml', () => {
  it('throws a Settings → Pages hint for the white-page HTML shape', () => {
    expect(() => assertProductionIndexHtml(DEV_HTML, 'live')).toThrow(/GitHub Actions/i);
  });

  it('does not throw for production HTML', () => {
    expect(() => assertProductionIndexHtml(PRODUCTION_HTML)).not.toThrow();
  });
});
