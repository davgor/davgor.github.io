import { test as base } from '@playwright/test'
import * as path from 'path'

interface MyFixtures {
    directory: string;
}

export const test = base.extend<MyFixtures>({
    directory: async ({page}, use) => {
        await use(`file:${path.join(__dirname, 'index.html')}`.replace('/e2e', ''));
    }
});

export { expect } from '@playwright/test';

test.beforeEach(async ({ page, directory }) => {
    test.step('Load homepage', async () => {
        await page.goto(directory);
    });
});
