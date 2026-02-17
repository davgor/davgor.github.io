import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test.describe('Navigation Tests', () => {
  test('Resume loads', async ({ page }) => {
    await expect(page.locator('#menu')).toBeVisible();
  });

  test('about me', async ({ page }) => {
    await page.getByRole('link', { name: 'About Me' }).click();
    await expect(page.locator('.card')).toBeVisible();
    await expect(page).toHaveURL(/\//);
  });
  
  test('experience', async ({ page }) => {
    await page.getByRole('link', { name: 'Experience' }).click();
    await expect(page.locator('.card').first()).toBeVisible();
    await expect(page).toHaveURL(/\/experience/);
  });
  
  test('Coding Reference', async ({ page }) => {
    await page.getByRole('link', { name: 'Coding Reference' }).click();
    await expect(page.locator('.card')).toBeVisible();
    await expect(page).toHaveURL(/\/coding-reference/);
  });
  
  test('Dogs', async ({ page }) => {
    await page.getByRole('link', { name: 'Dogs!' }).click();
    await expect(page.locator('.card').first()).toBeVisible();
    await expect(page).toHaveURL(/\/dogs/);
  });
  
  test('Hobbies', async ({ page }) => {
    await page.getByRole('link', { name: 'Hobbies' }).click();
    await expect(page.locator('.card').first()).toBeVisible();
    await expect(page).toHaveURL(/\/hobbies/);
  });

  test('Contact Me', async ({ page }) => {
    await page.getByRole('link', { name: 'Contact Me' }).click();
    await expect(page.locator('.card')).toBeVisible();
    await expect(page).toHaveURL(/\/contact/);
  });
});
