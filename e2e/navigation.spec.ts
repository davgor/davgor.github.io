import { test, expect } from './modules/fixtures';

test.describe('Navigation Tests', () => {
    test('Resume loads', async ({ page }) => {
        await test.step('Then', async () => {
            await expect(await (await page.waitForSelector('#menu')).isVisible()).toBeTruthy();
        });
    });

    test('about me', async ({ page, navigation }) => {
        await test.step('When', async () => {
            await navigation.NavigateAboutMe();
        });

        await test.step('Then', async () => {
            await expect(await (await page.waitForSelector('.card')).isVisible()).toBeTruthy();
        });
    });
    
    test('experience', async ({ page, navigation }) => {
        await test.step('When', async () => {
            await navigation.NavigateExperience();
        });

        await test.step('Then', async () => {
            await expect(await (await page.waitForSelector('.card')).isVisible()).toBeTruthy();
        });
    });
    
    test('Coding Refrence', async ({ page, navigation }) => {
        await test.step('When', async () => {
            await navigation.NavigateCodingReference();
        });

        await test.step('Then', async () => {
            await expect(await (await page.waitForSelector('.card')).isVisible()).toBeTruthy();
        });
    });
    
    test('Dogs', async ({ page, navigation }) => {
        await test.step('When', async () => {
            await navigation.NavigateDogs();
        });

        await test.step('Then', async () => {
            await expect(await (await page.waitForSelector('.card')).isVisible()).toBeTruthy();
        });
    });
    
    test('Hobbies', async ({ page, navigation }) => {
        await test.step('When', async () => {
            await navigation.NavigateHobbies();
        });

        await test.step('Then', async () => {
            await expect(await (await page.waitForSelector('.card')).isVisible()).toBeTruthy();
        });
    });

    test('Contact Me', async ({ page, navigation }) => {
        await test.step('When', async () => {
            await navigation.NavigateContactMe();
        });

        await test.step('Then', async () => {
            await expect(await (await page.waitForSelector('.card')).isVisible()).toBeTruthy();
        });
    });
});
