import { expect, test } from "@playwright/test";
import { jobs } from "../src/data/jobs";

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/experience');
});

test.describe('Verifying data off jobs file', () => {
  jobs.forEach(company => {
    test(company.website, async ({ page }) => {
      await expect(page.locator('.card').first()).toBeVisible();
      await expect(page.locator(`[href*="${company.website}"]`)).toBeVisible();
      await expect(page.locator(`[src*="${company.logo}"]`)).toBeVisible();
      
      for (const role of company.roles) {
        await expect(page.getByText(role.title)).toBeVisible();
        
        for (const paragraph of role.paragraphs) {
          if (paragraph.title != "") {
            await expect(page.getByText(paragraph.title).first()).toBeVisible();
          }
        }
        
        if (role.achievements) {
          for (const achievements of role.achievements.list) {
            const cleanText = achievements.replace('<b>', '').replace('</b>', '');
            await expect(page.getByText(cleanText).first()).toBeVisible();
          }
        }
      }
    });
  });
});
