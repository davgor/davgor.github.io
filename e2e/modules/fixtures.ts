import { test as base } from '@playwright/test'
import { Navigation } from './navigation';

interface MyFixtures {
    directory: string;
    navigation: Navigation;
}

export const test = base.extend<MyFixtures>({
    directory: async ({ baseURL }, use) => {
        await use(baseURL || 'http://localhost:5173');
    },
    navigation: async ({page}, use) => {
        await use (new Navigation(page));
    }
});

export { expect } from '@playwright/test';
