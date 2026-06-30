import { test, expect } from '../pages/base/fixtures';
import { HomePage } from '../pages/homepage/homepage.page';
import { ProjectsPage, PROJECTS } from '../pages/project/projects.page';
import { ProjectDetailPage } from '../pages/project/projectDetail.page';
import { AboutPage, EMAIL } from '../pages/about/about.page';

// Sheet: "End-to-End Tests" — full cross-page user journeys
test.describe('End-to-End journeys', () => {
  test('TC_E2E_001 - recruiter evaluates the candidate and makes contact', async ({ page, context }) => {
    const home = new HomePage(page);
    const projects = new ProjectsPage(page);
    const detail = new ProjectDetailPage(page);
    const about = new AboutPage(page);

    // 1. Land on homepage and read the value proposition
    await home.goto();
    await expect(home.heading).toBeVisible();

    // 2-3. Explore work, open a relevant project in depth
    await home.clickExplore();
    await expect(page).toHaveURL(/projects\.html/);
    await projects.openCard('Manulife Web Automation');
    await expect(page).toHaveURL(/id=manulife/);
    await expect(detail.title).toHaveText('Manulife Web Automation');

    // 4. Return to projects, then go to About Me
    await page.goBack();
    await projects.clickNav('About Me');
    await expect(page).toHaveURL(/about\.html/);
    await expect(about.journeyItems).toHaveCount(4);

    // 5. Preview (opens a new tab) and download the resume
    const [preview] = await Promise.all([
      context.waitForEvent('page'),
      about.previewResume.click(),
    ]);
    expect(preview).toBeTruthy();
    await preview.close();
    const [file] = await Promise.all([
      page.waitForEvent('download'),
      about.downloadResume.click(),
    ]);
    expect(file.suggestedFilename()).toMatch(/\.pdf$/i);

    // 6. Reach the contact email — outcome of the journey
    await expect(about.email).toHaveAttribute('href', `mailto:${EMAIL}`);
  });

  test('TC_E2E_002 - prospective client browses every project then reaches out', async ({ page }) => {
    const home = new HomePage(page);
    const projects = new ProjectsPage(page);
    const about = new AboutPage(page);

    await home.goto();
    await home.clickNav('Projects');
    await expect(page).toHaveURL(/projects\.html/);

    for (const project of PROJECTS) {
      await projects.openCard(project.card);
      await expect(page).toHaveURL(new RegExp(`id=${project.id}`));
      await page.goBack();
      await expect(page).toHaveURL(/projects\.html/);
    }

    await projects.clickNav('About Me');
    await expect(about.email).toHaveAttribute('href', `mailto:${EMAIL}`);
  });

  test('TC_E2E_003 - technical peer traces skills to project evidence', async ({ page }) => {
    const projects = new ProjectsPage(page);
    const detail = new ProjectDetailPage(page);
    const about = new AboutPage(page);

    await projects.goto();

    await projects.openCard('Manulife Web Automation');
    await expect(detail.title).toHaveText('Manulife Web Automation');
    await page.goBack();

    await projects.openCard('Insurance Demo App');
    await expect(detail.title).toHaveText('Insurance Demo App');

    await projects.clickNav('About Me');
    await expect(about.skill('Playwright')).toBeVisible();
    await expect(about.skill('Angular')).toBeVisible();
  });

  test('TC_E2E_004 - mobile visitor completes discovery-to-contact journey', async ({ page, context }) => {
    const home = new HomePage(page);
    const projects = new ProjectsPage(page);
    const about = new AboutPage(page);

    await home.setMobileViewport();

    await home.goto();
    await home.expectNoHorizontalScroll();

    await home.clickExplore();
    await expect(page).toHaveURL(/projects\.html/);
    await projects.expectNoHorizontalScroll();

    await projects.openCard('Animated Ad Banners');
    await expect(page).toHaveURL(/id=banners/);

    await about.goto();
    await about.expectNoHorizontalScroll();
    const [preview] = await Promise.all([
      context.waitForEvent('page'),
      about.previewResume.click(),
    ]);
    expect(preview).toBeTruthy();
    await preview.close();
  });

  test('TC_E2E_005 - visitor enters via a shared deep link and explores the site', async ({ page }) => {
    const detail = new ProjectDetailPage(page);

    await detail.goto('banners');
    await expect(detail.title).toHaveText('Animated Ad Banners');

    await detail.clickNav('Projects');
    await expect(page).toHaveURL(/projects\.html/);

    await detail.clickNav('About Me');
    await expect(page).toHaveURL(/about\.html/);

    await detail.clickNav('Home');
    await expect(page).toHaveURL(/index\.html/);
  });
});
