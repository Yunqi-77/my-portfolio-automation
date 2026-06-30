import { Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';

/** Contact email shown on the About page. */
export const EMAIL = 'yunqi.tyq@gmail.com';

/** Page object for the About page (about.html). */
export class AboutPage extends BasePage {
  readonly path = 'about.html';

  async goto() {
    await this.page.goto(this.path);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Nice to Meet You' });
  }

  get lede(): Locator {
    return this.page.locator('.about-lede-strong');
  }

  get journeyItems(): Locator {
    return this.page.locator('.journey-item');
  }

  get skillBadges(): Locator {
    return this.page.locator('.language-badge');
  }

  get marqueeTrack(): Locator {
    return this.page.locator('.marquee-track-1');
  }

  /** A single skill badge by exact text (first match — the marquee duplicates them). */
  skill(name: string): Locator {
    return this.page.getByText(name, { exact: true }).first();
  }

  /** Hover the skills marquee to pause it (force past the never-ending CSS animation). */
  async hoverSkills() {
    await this.marqueeTrack.hover({ force: true });
  }

  get downloadResume(): Locator {
    return this.page.getByRole('link', { name: /download/i });
  }

  get previewResume(): Locator {
    return this.page.getByRole('link', { name: /preview/i });
  }

  get contact(): Locator {
    return this.page.locator('#contact');
  }

  get email(): Locator {
    return this.page.locator('a.term-email');
  }
}
