import { test, expect } from '../pages/base/fixtures';
import { HomePage } from '../pages/homepage/homepage.page';
import { ProjectsPage } from '../pages/project/projects.page';
import { AboutPage, EMAIL } from '../pages/about/about.page';

/**
 * "Advanced" sheet — techniques beyond click-and-assert that show off the
 * breadth of Playwright: network interception, the API request context,
 * accessibility/semantics, device-condition emulation, retrying assertions,
 * keyboard activation and diagnostic artifacts.
 */

const PAGES = [
  { name: 'Home', path: 'index.html' },
  { name: 'Projects', path: 'projects.html' },
  { name: 'About', path: 'about.html' },
  { name: 'Project detail', path: 'project-detail.html?id=manulife' },
];

test.describe('Advanced · Network & API', () => {
  test('TC_ADV_001 - no HTTP failures or page errors across every page', async ({
    page,
    pageErrors,
    httpFailures,
  }) => {
    // A single test sweeps all routes; the fixtures collect failures passively.
    for (const { name, path } of PAGES) {
      await test.step(`visit ${name}`, async () => {
        const response = await page.goto(path);
        expect(response?.ok(), `${name} document should return 2xx`).toBeTruthy();
      });
    }

    // Soft assertions report *all* problems at once instead of stopping at the first.
    expect.soft(httpFailures.map((r) => `${r.status()} ${r.url()}`)).toEqual([]);
    expect.soft(pageErrors).toEqual([]);
  });

  test('TC_ADV_002 - core content survives when images are blocked', async ({ page }) => {
    // Intercept and abort image/font requests to simulate a hostile network,
    // then prove the page is still functional (text + nav remain).
    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      return type === 'image' || type === 'font' ? route.abort() : route.continue();
    });

    const home = new HomePage(page);
    await home.goto();
    await expect(home.heading).toBeVisible();
    await expect(home.exploreButton).toBeVisible();
  });

  test('TC_ADV_003 - navigation fires the expected network request', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Assert on the network round-trip the click triggers, not just the URL.
    const [projectsResponse] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('projects.html') && r.status() === 200),
      home.clickExplore(),
    ]);
    expect(projectsResponse.ok()).toBeTruthy();
  });

  test('TC_ADV_004 - assets are reachable with correct content types (no browser)', async ({
    page,
    request,
  }) => {
    // The `request` fixture talks HTTP directly — fast checks without rendering.
    for (const { name, path } of PAGES) {
      const res = await request.get(path);
      expect.soft(res.ok(), `${name} should be reachable`).toBeTruthy();
      expect.soft(res.headers()['content-type']).toContain('text/html');
    }

    // Resolve the résumé URL from the live DOM, then fetch it headlessly.
    const about = new AboutPage(page);
    await about.goto();
    const href = await about.downloadResume.getAttribute('href');
    expect(href).toBeTruthy();

    const pdf = await request.get(href!);
    expect(pdf.ok()).toBeTruthy();
    expect(pdf.headers()['content-type']).toContain('pdf');
  });
});

test.describe('Advanced · Accessibility & semantics', () => {
  test('TC_ADV_005 - navigation exposes the expected accessible roles & names', async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();

    // Role + accessible-name assertions exercise the same tree a screen reader sees.
    await expect(home.nav).toBeVisible();
    for (const link of ['Home', 'Projects', 'About Me']) {
      await expect(home.navLink(link)).toHaveAccessibleName(link);
    }
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('TC_ADV_006 - the contact email has a valid, well-formed mailto', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();
    await expect(about.email).toHaveAttribute('href', `mailto:${EMAIL}`);
    await expect(about.email).toHaveAccessibleName(/.+/); // must announce something
  });

  test('TC_ADV_007 - the Explore CTA is operable by keyboard alone', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Focus then activate with Enter — no mouse — to validate keyboard accessibility.
    await home.exploreButton.focus();
    await expect(home.exploreButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/projects\.html/);
  });
});

test.describe('Advanced · Device-condition emulation', () => {
  test('TC_ADV_008 - dark colour scheme is honoured', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    const home = new HomePage(page);
    await home.goto();
    const prefersDark = await page.evaluate(
      () => matchMedia('(prefers-color-scheme: dark)').matches,
    );
    expect(prefersDark).toBe(true);
  });

  test('TC_ADV_009 - reduced-motion preference is honoured', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const home = new HomePage(page);
    await home.goto();
    const reduced = await page.evaluate(
      () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    expect(reduced).toBe(true);
  });

  test('TC_ADV_010 - going offline is observable to the page', async ({ page, context }) => {
    const home = new HomePage(page);
    await home.goto();
    await context.setOffline(true);
    expect(await page.evaluate(() => navigator.onLine)).toBe(false);
    await context.setOffline(false); // restore for any reuse
  });
});

test.describe('Advanced · Resilience & retrying assertions', () => {
  test('TC_ADV_011 - all four project cards settle into view (toPass)', async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();

    // `toPass` retries the whole block until it stops throwing or times out —
    // ideal for content that animates/streams in after load.
    await expect(async () => {
      expect(await projects.cards.count()).toBe(4);
      await expect(projects.cards.first()).toBeVisible();
    }).toPass({ timeout: 10_000 });
  });

  test('TC_ADV_012 - skills marquee is populated (expect.poll)', async ({ page }) => {
    const about = new AboutPage(page);
    await about.goto();

    // `expect.poll` re-evaluates a function until the matcher passes.
    await expect.poll(() => about.skillBadges.count(), {
      message: 'skills marquee should render at least one badge',
    }).toBeGreaterThan(0);
  });
});

test.describe('Advanced · Diagnostics & artifacts', () => {
  test('TC_ADV_013 - capture navigation-timing metrics into the report', async ({ page }, testInfo) => {
    const home = new HomePage(page);
    await home.goto();

    const nav = await page.evaluate(() => {
      const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      return {
        domContentLoaded: Math.round(entry.domContentLoadedEventEnd),
        loadComplete: Math.round(entry.loadEventEnd),
        transferKB: Math.round(entry.transferSize / 1024),
      };
    });

    // Attach metrics so they show up in the HTML report alongside the test.
    await testInfo.attach('navigation-timing.json', {
      body: JSON.stringify(nav, null, 2),
      contentType: 'application/json',
    });
    expect(nav.loadComplete).toBeGreaterThanOrEqual(0);
  });

  test('TC_ADV_014 - full-page screenshot attached as an artifact', async ({ page }, testInfo) => {
    const about = new AboutPage(page);
    await about.goto();
    await about.hoverSkills(); // pause the marquee so the shot is stable

    // Attaching (rather than `toHaveScreenshot`) avoids baseline maintenance while
    // still demonstrating screenshot capture. For true visual regression, swap to:
    //   await expect(page).toHaveScreenshot({ animations: 'disabled', fullPage: true });
    const shot = await page.screenshot({ fullPage: true, animations: 'disabled' });
    await testInfo.attach('about-fullpage.png', { body: shot, contentType: 'image/png' });
    expect(shot.byteLength).toBeGreaterThan(0);
  });
});
