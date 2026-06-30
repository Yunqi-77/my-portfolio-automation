import { Locator } from '@playwright/test';
import { BasePage } from '../../pages/base/base.page';

/** Page object for the homepage (index.html). */
export class HomePage extends BasePage {
  readonly path = 'index.html';

  async goto() {
    await this.page.goto(this.path);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get subtitle(): Locator {
    return this.page.locator('.hero-sub');
  }

  get exploreButton(): Locator {
    return this.page.getByRole('link', { name: /explore my work/i });
  }

  get aboutButton(): Locator {
    return this.page.locator('.hero-cta-row').getByRole('link', { name: /about me/i });
  }

  async clickExplore() {
    await this.exploreButton.click();
  }

  async clickAbout() {
    await this.aboutButton.click();
  }
}
