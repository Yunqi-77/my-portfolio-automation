import { test, expect } from '../pages/base/fixtures';
import { ProjectsPage, PROJECTS } from '../pages/project/projects.page';

// Sheet: "Projects Page" — module projects.html
test.describe('Projects Page', () => {
  test('TC_PROJ_001 - projects page loads successfully', async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await expect(page).toHaveURL(/projects\.html/);
    await expect(projects.navLink('Projects')).toHaveClass(/active/);
    await expect(projects.title).toBeVisible();
    await expect(projects.subtitle).toBeVisible();
    await expect(projects.cards).toHaveCount(4);
  });

  test("TC_PROJ_002 - 'Home' nav item navigates to homepage", async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await projects.clickNav('Home');
    await expect(page).toHaveURL(/index\.html/);
  });

  test("TC_PROJ_003 - 'About Me' nav item navigates to About", async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await projects.clickNav('About Me');
    await expect(page).toHaveURL(/about\.html/);
  });

  test('TC_PROJ_004 - logo navigates back to homepage', async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await projects.clickLogo();
    await expect(page).toHaveURL(/index\.html/);
  });

  test('TC_PROJ_005 - all project cards display required details', async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    for (const project of PROJECTS) {
      const card = projects.card(project.card);
      await expect(card).toBeVisible();
      await expect(card.locator('h3')).toHaveText(project.card);
      await expect(card.locator('.tech-tag').first()).toBeVisible();
      await expect(card.locator('img')).toBeVisible();
    }
  });

  // TC_PROJ_006..009 - each card links to its detail page
  for (const project of PROJECTS) {
    test(`TC_PROJ_${project.tc} - '${project.card}' card opens its detail page`, async ({ page }) => {
      const projects = new ProjectsPage(page);
      await projects.goto();
      await projects.openCard(project.card);
      await expect(page).toHaveURL(new RegExp(`project-detail\\.html\\?id=${project.id}`));
    });
  }

  test('TC_PROJ_010 - projects page layout on mobile viewport', async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.setMobileViewport();
    await projects.goto();
    await expect(projects.cards).toHaveCount(4);
    await projects.expectNoHorizontalScroll();
  });
});
