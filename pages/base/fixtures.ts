import { test as base, expect, type Response } from '@playwright/test';

/**
 * Custom test fixtures layered on top of Playwright's built-ins.
 *
 * `pageErrors`  - auto-collects every `console.error` and uncaught page error
 *                 for the lifetime of the test, so any test can assert "the page
 *                 logged nothing nasty" without wiring up listeners itself.
 * `httpFailures`- auto-collects every response whose status is >= 400 that came
 *                 from the site's own origin, for HTTP health assertions.
 *
 * Fixtures run their setup before the test body and their teardown after, which
 * is exactly where listener attach/detach belongs.
 */
type Fixtures = {
  pageErrors: string[];
  httpFailures: Response[];
};

export const test = base.extend<Fixtures>({
  pageErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error → ${msg.text()}`);
    });
    page.on('pageerror', (err) => errors.push(`pageerror → ${err.message}`));
    await use(errors);
  },

  httpFailures: async ({ page, baseURL }, use) => {
    const origin = baseURL ? new URL(baseURL).origin : '';
    const failures: Response[] = [];
    page.on('response', (res) => {
      if (res.status() >= 400 && res.url().startsWith(origin)) failures.push(res);
    });
    await use(failures);
  },
});

export { expect };
