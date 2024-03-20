import { expect, test } from "./modules/fixtures";
import { jobs } from "./data/jobs";

test.beforeEach(async ({ page, directory }) => {
    await test.step('Given', async () => {
        await page.goto(directory);
    });
});

test.describe('Verifying data off jobs file', () => {
    jobs.forEach(company => {
        test(company.website, async ({ page, navigation }) => {
            await test.step('When', async () => {
                await navigation.NavigateExperience();
            });
        
            await test.step('Then', async () => {
                await expect(await (await page.waitForSelector('.card')).isVisible()).toBeTruthy();
                // await expect(await (await page.getByRole('link', {})).isVisible()).toBeTruthy();
                // await page.getByRole('link', { name: 'Experience' }).isVisible();
                await expect(await (await page.waitForSelector(`[href*="${company.website}"]`)).isVisible()).toBeTruthy();
                await expect(await (await page.waitForSelector(`[src*="${company.logo}"]`)).isVisible()).toBeTruthy();
                for (const role of company.roles) {
                    await expect(await (await page.getByText(role.title)).isVisible()).toBeTruthy();
                    for (const paragraph of role.paragraphs) {
                        if (paragraph.title != "") {
                            await expect(await (await page.getByText(paragraph.title)).first().isVisible()).toBeTruthy();
                        }
                    }
                    for (const achievements of role.achievements.list) {
                        await expect(await (await page.getByText(achievements.replace('<b>', '').replace('</b>', ''))).first().isVisible()).toBeTruthy();
                    }
                }
            });
        });
    });
});
