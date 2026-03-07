import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { NewsHeading } from './NewsHeading';

describe('NewsHeading Accessibility', () => {
  it('has no violations for each heading level (importance 1–6)', async () => {
    await expectNoA11yViolations(
      <main>
        <NewsHeading importance={1}>Heading 1</NewsHeading>
        <NewsHeading importance={2}>Heading 2</NewsHeading>
        <NewsHeading importance={3}>Heading 3</NewsHeading>
        <NewsHeading importance={4}>Heading 4</NewsHeading>
        <NewsHeading importance={5}>Heading 5</NewsHeading>
        <NewsHeading importance={6}>Heading 6</NewsHeading>
      </main>
    );
  });

  it('has no violations with id and aria-label', async () => {
    await expectNoA11yViolations(
      <NewsHeading importance={1} id="page-title" aria-label="Page title">
        News Article Title
      </NewsHeading>
    );
  });

  it('has no violations with custom className', async () => {
    await expectNoA11yViolations(
      <NewsHeading importance={2} className="custom-heading">
        Styled heading
      </NewsHeading>
    );
  });
});
