import { test, expect } from './fixtures';

test('Resume loads', async ({ page }) => {
    await expect(await (await page.waitForSelector('#menu')).isVisible()).toBeTruthy();
});


