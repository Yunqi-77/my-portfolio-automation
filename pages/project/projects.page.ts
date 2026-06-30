import { Locator } from '@playwright/test';
import { BasePage } from '../../pages/base/base.page';

/** The four projects shown on the Projects page. */
export const PROJECTS = [
  { card: 'Manulife Web Automation', id: 'manulife', detailTitle: 'Manulife Web Automation', tc: '006' },
  { card: 'Website of TF Systems', id: 'website', detailTitle: 'Company Website of TF Systems', tc: '007' },
  { card: 'Animated Ad Banners', id: 'banners', detailTitle: 'Animated Ad Banners', tc: '008' },
  { card: 'Insurance Demo App', id: 'insurance', detailTitle: 'Insurance Demo App', tc: '009' },
];

/** Page object for the Projects listing page (projects.html). */
export class ProjectsPage extends BasePage {
  readonly path = 'projects.html';

  async goto() {
    await this.page.goto(this.path);
  }

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'Work Showcase' });
  }

  get subtitle(): Locator {
    return this.page.locator('.section-sub');
  }

  get cards(): Locator {
    return this.page.locator('.bento-item');
  }

  /** A project card located by its title. */
  card(title: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(title, 'i') });
  }

  async openCard(title: string) {
    await this.card(title).click();
  }
}
