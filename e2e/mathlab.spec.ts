import { test, expect } from '@playwright/test';

test('Coding Reference showcases interactive worlds without a generator service', async ({
  page,
}) => {
  await page.goto('/coding-reference');
  const window = page.frameLocator('iframe[title="MathLab world showcase"]');
  await expect(window.getByRole('combobox', { name: 'World' })).toBeVisible();
  const world = window.frameLocator('iframe[title="Selected MathLab world"]');
  await expect(world.locator('#world-nest-summary')).toContainText('381 candidate species');
  await expect(world.locator('#world-generate')).toBeHidden();
  await world.locator('#world-nest-species').selectOption('glacier-dragons');
  await expect(world.locator('#world-nest-info')).toContainText('Glacier dragons');
  await window.getByRole('combobox', { name: 'World' }).selectOption('frost');
  await expect(window.getByRole('link', { name: 'Open selected world' })).toHaveAttribute(
    'href',
    './frost.html'
  );
  await expect(world.locator('#world-status')).toContainText('Seed 73');
  await window.getByRole('combobox', { name: 'World' }).selectOption('islands');
  await expect(world.locator('#world-status')).toContainText('Seed 108');
  await expect(page.getByRole('link', { name: 'Open showcase in a full window' })).toHaveAttribute(
    'href',
    '/mathlab/'
  );
});

test('showcase fits a narrow Coding Reference viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/coding-reference');
  const frame = page.locator('iframe[title="MathLab world showcase"]');
  await frame.scrollIntoViewIfNeeded();
  await expect(
    page.frameLocator('iframe[title="MathLab world showcase"]').getByLabel('World')
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: 'test-results/mathlab-mobile.png' });
});
