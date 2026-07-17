/**
 * Guards against publishing the Vite *dev* entry HTML to GitHub Pages.
 * Production builds must reference hashed /assets/* bundles, never /src/main.tsx.
 */
export function isProductionIndexHtml(html: string): boolean {
  const hasDevEntry = /src=["']\/src\/main\.tsx["']/.test(html);
  const hasHashedAsset =
    /src=["'][^"']*\/assets\/[^"']+\.(js|mjs)["']/.test(html) ||
    /href=["'][^"']*\/assets\/[^"']+\.css["']/.test(html);
  return !hasDevEntry && hasHashedAsset;
}

export function assertProductionIndexHtml(html: string, label = 'index.html'): void {
  if (!isProductionIndexHtml(html)) {
    throw new Error(
      `${label} looks like a Vite dev entry (or is missing hashed /assets bundles). ` +
        'GitHub Pages must serve the Vite dist/ build via Actions, not the repo-root source. ' +
        'Check Settings → Pages → Source = GitHub Actions.'
    );
  }
}
