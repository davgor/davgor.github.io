import { test, expect } from './fixtures';

test('Resume loads', async ({ page }) => {
    await page.waitForSelector('#menu');
});


