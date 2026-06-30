import { Page, Locator, expect } from '@playwright/test';

/** Mobile viewport shared by the responsive test cases. */
export const MOBILE = { width: 375, height: 667 };

/**
 * Common behaviour shared by every page: the top nav bar, the logo,
 * and the responsive overflow check. Page objects extend this.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  get nav(): Locator {
    return this.page.getByRole('navigation');
  }

  /** A nav-bar link by its exact text (Home / Projects / About Me). */
  navLink(name: string): Locator {
    return this.nav.getByRole('link', { name, exact: true });
  }

  get logo(): Locator {
    return this.nav.getByRole('link', { name: 'Logo' });
  }

  async clickNav(name: string) {
    await this.navLink(name).click();
  }

  async clickLogo() {
    await this.logo.click();
  }

  async setMobileViewport() {
    await this.page.setViewportSize(MOBILE);
  }

  /**
   * Assert the page content does not overflow horizontally.
   * Purely-decorative, animated layers (floating particles, the ★ sticker) are
   * excluded from the measurement — they can drift a few px past the edge over
   * time without being a real layout break, which would otherwise be flaky.
   */
  async expectNoHorizontalScroll(maxOverflow = 1) {
    const overflow = await this.page.evaluate(() => {
      const decorative = [
        ...document.querySelectorAll('.particles, .profile-sticker'),
      ] as HTMLElement[];
      const previous = decorative.map((el) => el.style.display);
      decorative.forEach((el) => (el.style.display = 'none'));
      const value = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      decorative.forEach((el, i) => (el.style.display = previous[i]));
      return value;
    });
    expect(overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(maxOverflow);
  }
}
