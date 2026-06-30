import { Locator } from '@playwright/test';
import { BasePage } from '../../pages/base/base.page';

/** Page object for a project detail page (project-detail.html?id=...). */
export class ProjectDetailPage extends BasePage {
  /** Open a detail page directly by its project id (e.g. a shared deep link). */
  async goto(id: string) {
    await this.page.goto(`project-detail.html?id=${id}`);
  }

  get title(): Locator {
    return this.page.locator('#detail-title');
  }
}
