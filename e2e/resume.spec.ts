import { test, expect } from '@playwright/test';
import * as path from 'path'

const directory = `file:${path.join(__dirname, 'index.html')}`.replace('/e2e', '');

test('Resume loads', async ({ page }) => {
    await page.goto(directory);
    await page.waitForSelector('#menu');
});


