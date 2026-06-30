import { test, expect } from '../pages/base/fixtures';
import { HomePage } from '../pages/homepage/homepage.page';

// Sheet: "Homepage (index)" — module index.html
test.describe('Homepage (index)', () => {
  test('TC_HOME_001 - homepage loads successfully', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveURL(/index\.html/);
    await expect(home.navLink('Home')).toHaveClass(/active/);
    await expect(home.heading).toContainText('Than Yun Qi');
    await expect(home.subtitle).toBeVisible();
    await expect(home.exploreButton).toBeVisible();
    await expect(home.aboutButton).toBeVisible();
  });

  test("TC_HOME_002 - 'Explore My Work' button navigates to Projects", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickExplore();
    await expect(page).toHaveURL(/projects\.html/);
  });

  test("TC_HOME_003 - 'About Me' button navigates to About", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickAbout();
    await expect(page).toHaveURL(/about\.html/);
  });

  test("TC_HOME_004 - 'Projects' nav item navigates to Projects", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickNav('Projects');
    await expect(page).toHaveURL(/projects\.html/);
  });

  test("TC_HOME_005 - 'About Me' nav item navigates to About", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickNav('About Me');
    await expect(page).toHaveURL(/about\.html/);
  });

  test("TC_HOME_006 - 'Home' nav item stays on homepage and active", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickNav('Home');
    await expect(page).toHaveURL(/index\.html/);
    await expect(home.navLink('Home')).toHaveClass(/active/);
  });

  test('TC_HOME_007 - logo navigates back to homepage', async ({ page }) => {
    const home = new HomePage(page);
    await page.goto('about.html');
    await home.clickLogo();
    await expect(page).toHaveURL(/index\.html/);
  });

  test('TC_HOME_008 - homepage layout on mobile viewport', async ({ page }) => {
    const home = new HomePage(page);
    await home.setMobileViewport();
    await home.goto();
    await expect(home.heading).toBeVisible();
    await expect(home.exploreButton).toBeVisible();
    await home.expectNoHorizontalScroll();
  });
});
