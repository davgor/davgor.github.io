import { test as base } from '@playwright/test'
import * as path from 'path'
import { Navigation } from './navigation';

interface MyFixtures {
    directory: string;
    navigation: Navigation;
}

export const test = base.extend<MyFixtures>({
    directory: async ({}, use) => {
        await use(`file:${path.join(__dirname, 'index.html')}`.replace('/e2e/modules', ''));
    },
    navigation: async ({page}, use) => {
        await use (new Navigation(page));
    }
});

export { expect } from '@playwright/test';

test.beforeEach(async ({ page, directory }) => {
    await test.step('Load homepage', async () => {
        await page.goto(directory);
    });
});
