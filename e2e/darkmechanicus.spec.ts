import { test, expect } from '@playwright/test';

const KEYS = ['DGI-1', 'DGI-2', 'DGI-3', 'DGI-4', 'DGI-5', 'DGI-6'];

test.describe('Coding Reference: Dark Mechanicus', () => {
  test('card is visible with correct links', async ({ page }) => {
    await page.goto('/coding-reference');
    await expect(page.getByText('Dark Mechanicus', { exact: true }).first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'https://github.com/davgor/DarkMechanicus', exact: true })
    ).toHaveAttribute('href', 'https://github.com/davgor/DarkMechanicus');
    await expect(
      page.getByRole('link', {
        name: 'https://github.com/davgor/DarkMechanicus/releases/latest',
        exact: true,
      })
    ).toHaveAttribute('href', 'https://github.com/davgor/DarkMechanicus/releases/latest');
  });

  test('every screenshot loads', async ({ page }) => {
    await page.goto('/coding-reference');
    const images = page.locator('img[src^="/assets/darkmechanicus/"]');
    await expect(images).toHaveCount(2);
    for (const img of await images.all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveAttribute('alt', /Dark Mechanicus/);
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth))
        .toBeGreaterThan(0);
    }
  });

  test('plan view lists every ticket of this epic', async ({ page }) => {
    await page.goto('/coding-reference');
    const list = page.getByTestId('plan-list');
    await expect(list).toBeVisible();
    for (const key of KEYS) {
      await expect(list.getByText(key, { exact: false }).first()).toBeVisible();
    }
    await expect(list.locator('li')).toHaveCount(KEYS.length);
    await expect(page.getByRole('heading', { name: /plan/i }).first()).toBeVisible();
    await expect(page.getByText(/saved 2 October 2026/)).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Dark Mechanicus on GitHub', exact: true })
    ).toHaveAttribute('href', 'https://github.com/davgor/DarkMechanicus');
  });

  test('no page-level horizontal scroll at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/coding-reference');
    await expect(page.getByTestId('plan-list')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      375
    );
  });

  test('Fantasy World Generator showcase and other project cards still render', async ({
    page,
  }) => {
    await page.goto('/coding-reference');
    await expect(page.locator('iframe[title="MathLab world showcase"]')).toBeAttached();
    await expect(page.getByRole('heading', { name: /Fantasy World Generator/ })).toBeVisible();
    for (const title of [
      'davgor.github.io',
      'Electron Server Manager',
      'AI-DND-Matrix',
      'BoosterSeat',
    ]) {
      await expect(page.getByText(title, { exact: true }).first()).toBeVisible();
    }
  });
});
