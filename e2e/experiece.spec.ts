import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/experience');
});

test.describe('Experience Page Tests', () => {
  test('should display experience cards', async ({ page }) => {
    // Verify at least one card is visible
    await expect(page.locator('.card').first()).toBeVisible();
  });

  test('should display Blackpoint Cyber experience', async ({ page }) => {
    await expect(page.locator('[href*="blackpointcyber.com"]')).toBeVisible();
    await expect(page.locator('[src*="blackpointlogo.png"]')).toBeVisible();
    await expect(page.getByText(/Blackpoint Cyber - QA Manager/)).toBeVisible();
  });

  test('should display Lyft experience', async ({ page }) => {
    await expect(page.locator('[href*="lyft.com"]')).toBeVisible();
    await expect(page.locator('[src*="lyft-logo"]')).toBeVisible();
    await expect(page.getByText(/Lyft - Software Engineer in Test/)).toBeVisible();
  });

  test('should display Atreo experience', async ({ page }) => {
    await expect(page.locator('[href*="atreo.io"]')).toBeVisible();
    await expect(page.locator('[src*="Atreo_logo"]')).toBeVisible();
    await expect(page.getByText(/Atreo\.io - Software Automation Engineer/)).toBeVisible();
  });

  test('should display EMC Insurance experience', async ({ page }) => {
    await expect(page.locator('[href*="emcins.com"]')).toBeVisible();
    await expect(page.locator('[src*="emc_insurance"]')).toBeVisible();
    await expect(page.getByText(/EMC Insurance/)).toBeVisible();
  });

  test('should display Geek Squad experience', async ({ page }) => {
    await expect(page.locator('[href*="geeksquad.com"]')).toBeVisible();
    await expect(page.locator('[src*="geek_squad"]')).toBeVisible();
    await expect(page.getByText(/Geek Squad - Consultation Agent/)).toBeVisible();
  });
});
