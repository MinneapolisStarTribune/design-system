import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { OpinionHeading } from './OpinionHeading';

describe('OpinionHeading Accessibility', () => {
  it('has no violations for each heading level (importance 1–6)', async () => {
    await expectNoA11yViolations(
      <main>
        <OpinionHeading importance={1}>Heading 1</OpinionHeading>
        <OpinionHeading importance={2}>Heading 2</OpinionHeading>
        <OpinionHeading importance={3}>Heading 3</OpinionHeading>
        <OpinionHeading importance={4}>Heading 4</OpinionHeading>
        <OpinionHeading importance={5}>Heading 5</OpinionHeading>
        <OpinionHeading importance={6}>Heading 6</OpinionHeading>
      </main>
    );
  });

  it('has no violations with id and aria-label', async () => {
    await expectNoA11yViolations(
      <OpinionHeading importance={1} id="page-title" aria-label="Page title">
        Opinion Article Title
      </OpinionHeading>
    );
  });

  it('has no violations with custom className', async () => {
    await expectNoA11yViolations(
      <OpinionHeading importance={2} className="custom-heading">
        Styled heading
      </OpinionHeading>
    );
  });
});
