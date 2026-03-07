import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { SponsoredHeading } from './SponsoredHeading';

describe('SponsoredHeading Accessibility', () => {
  it('has no violations for each heading level (importance 1–6)', async () => {
    await expectNoA11yViolations(
      <main>
        <SponsoredHeading importance={1}>Heading 1</SponsoredHeading>
        <SponsoredHeading importance={2}>Heading 2</SponsoredHeading>
        <SponsoredHeading importance={3}>Heading 3</SponsoredHeading>
        <SponsoredHeading importance={4}>Heading 4</SponsoredHeading>
        <SponsoredHeading importance={5}>Heading 5</SponsoredHeading>
        <SponsoredHeading importance={6}>Heading 6</SponsoredHeading>
      </main>
    );
  });

  it('has no violations with id and aria-label', async () => {
    await expectNoA11yViolations(
      <SponsoredHeading importance={1} id="page-title" aria-label="Page title">
        Sponsored Article Title
      </SponsoredHeading>
    );
  });

  it('has no violations with custom className', async () => {
    await expectNoA11yViolations(
      <SponsoredHeading importance={2} className="custom-heading">
        Styled heading
      </SponsoredHeading>
    );
  });
});
