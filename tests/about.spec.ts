import { test, expect } from '../pages/base/fixtures';
import { AboutPage, EMAIL } from '../pages/about/about.page';

// Sheet: "About Me Page" — module about.html
test.describe('About Me Page', () => {
  test('TC_ABT_001 - about page loads successfully', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(page).toHaveURL(/about\.html/);
    await expect(about.navLink('About Me')).toHaveClass(/active/);
    await expect(about.heading).toBeVisible();
    await expect(about.lede).toBeVisible();
  });

  test("TC_ABT_002 - 'Home' nav item navigates to homepage", async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await about.clickNav('Home');
    await expect(page).toHaveURL(/index\.html/);
  });

  test("TC_ABT_003 - 'Projects' nav item navigates to Projects", async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await about.clickNav('Projects');
    await expect(page).toHaveURL(/projects\.html/);
  });

  test('TC_ABT_004 - logo navigates back to homepage', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await about.clickLogo();
    await expect(page).toHaveURL(/index\.html/);
  });

  test('TC_ABT_005 - Career Journey shows four entries', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(about.journeyItems).toHaveCount(4);
  });

  test('TC_ABT_006 - Skills section lists skills and pauses on hover', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    expect(await about.skillBadges.count()).toBeGreaterThan(0);
    await expect(about.skill('Playwright')).toBeVisible();
    await about.hoverSkills();
    await expect(about.marqueeTrack.locator('.language-badge').first()).toBeVisible();
  });

  test("TC_ABT_007 - Resume 'Download' downloads the PDF", async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(about.downloadResume).toHaveAttribute('href', /resume_than_yun_qi\.pdf/);
    const [file] = await Promise.all([
      page.waitForEvent('download'),
      about.downloadResume.click(),
    ]);
    expect(file.suggestedFilename()).toMatch(/\.pdf$/i);
  });

  test("TC_ABT_008 - Resume 'Preview' opens the PDF in a new tab", async ({ page, context }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(about.previewResume).toHaveAttribute('target', '_blank');
    await expect(about.previewResume).toHaveAttribute('href', /resume_than_yun_qi\.pdf/);
    // A new browser tab opens for the PDF. (The browser's PDF handler may render or
    // download it, so we assert the tab opened rather than polling its URL.)
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      about.previewResume.click(),
    ]);
    expect(popup).toBeTruthy();
    await popup.close();
  });

  test('TC_ABT_009 - Contact section shows email, location and status', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(about.contact.locator('a.term-email')).toBeVisible();
    await expect(about.contact).toContainText('Malaysia');
    await expect(about.contact).toContainText(/open to opportunities/i);
  });

  test('TC_ABT_010 - contact email is a correct mailto link', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(about.email).toHaveAttribute('href', `mailto:${EMAIL}`);
  });

  test('TC_ABT_011 - about page layout on mobile viewport', async ({ page }) => {
    const about = new AboutPage(page);
    await about.setMobileViewport();
    await about.goto();
    await expect(about.heading).toBeVisible();
    await about.expectNoHorizontalScroll();
  });
});
