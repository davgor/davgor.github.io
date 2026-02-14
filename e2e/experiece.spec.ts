import { expect, test } from "@playwright/test";
import { jobs } from "../src/data/jobs.ts";

test.beforeEach(async ({ page }) => {
  await page.goto('./experience');
});

test.describe('Experience Page - Job Data Validation', () => {
  // Loop through each job
  for (const job of jobs) {
    test.describe(`${job.id} - Job Card Tests`, () => {
      test('should display job card and logo', async ({ page }) => {
        // Verify job card is visible
        await expect(page.getByTestId(`job-card-${job.id}`)).toBeVisible();
        
        // Verify logo is visible
        await expect(page.getByTestId(`job-logo-${job.id}`)).toBeVisible();
        
        // Verify website link exists
        await expect(page.getByTestId(`job-website-link-${job.id}`)).toHaveAttribute('href', job.website);
      });

      // Loop through each role in the job
      for (let roleIndex = 0; roleIndex < job.roles.length; roleIndex++) {
        const role = job.roles[roleIndex];
        
        test.describe(`Role ${roleIndex}: ${role.title}`, () => {
          test('should display role title', async ({ page }) => {
            // Verify role title is visible and contains correct text
            const roleTitle = page.getByTestId(`job-role-title-${job.id}-${roleIndex}`);
            await expect(roleTitle).toBeVisible();
            await expect(roleTitle).toHaveText(role.title);
          });

          // Loop through each paragraph in the role
          for (let paragraphIndex = 0; paragraphIndex < role.paragraphs.length; paragraphIndex++) {
            const paragraph = role.paragraphs[paragraphIndex];
            
            test(`should display paragraph ${paragraphIndex}`, async ({ page }) => {
              // If paragraph has a title, verify it
              if (paragraph.title && paragraph.title.trim() !== "") {
                const paragraphTitle = page.getByTestId(`job-paragraph-title-${job.id}-${roleIndex}-${paragraphIndex}`);
                await expect(paragraphTitle).toBeVisible();
                await expect(paragraphTitle).toContainText(paragraph.title);
              }
              
              // Verify paragraph text is visible
              const paragraphText = page.getByTestId(`job-paragraph-text-${job.id}-${roleIndex}-${paragraphIndex}`);
              await expect(paragraphText).toBeVisible();
              
              // Strip HTML tags for text comparison
              const cleanText = paragraph.text.replace(/<[^>]*>/g, '').trim();
              if (cleanText) {
                await expect(paragraphText).toContainText(cleanText.substring(0, 50)); // Check first 50 chars
              }
            });
          }

          // Loop through achievements if they exist
          if (role.achievements && role.achievements.list.length > 0) {
            test('should display achievements section', async ({ page }) => {
              // Verify achievements container is visible
              await expect(page.getByTestId(`job-achievements-${job.id}-${roleIndex}`)).toBeVisible();
              
              // Verify achievements title
              const achievementsTitle = page.getByTestId(`job-achievements-title-${job.id}-${roleIndex}`);
              await expect(achievementsTitle).toBeVisible();
              if (role.achievements) {
                await expect(achievementsTitle).toContainText(role.achievements.title);
              }
              
              // Verify achievements list is visible
              await expect(page.getByTestId(`job-achievements-list-${job.id}-${roleIndex}`)).toBeVisible();
            });

            for (let achievementIndex = 0; achievementIndex < role.achievements.list.length; achievementIndex++) {
              const achievement = role.achievements.list[achievementIndex];
              
              test(`should display achievement ${achievementIndex}`, async ({ page }) => {
                const achievementItem = page.getByTestId(`job-achievement-item-${job.id}-${roleIndex}-${achievementIndex}`);
                await expect(achievementItem).toBeVisible();
                
                // Strip HTML tags for text comparison
                const cleanAchievement = achievement.replace(/<[^>]*>/g, '').trim();
                if (cleanAchievement) {
                  await expect(achievementItem).toContainText(cleanAchievement);
                }
              });
            }
          }
        });
      }
    });
  }
});
