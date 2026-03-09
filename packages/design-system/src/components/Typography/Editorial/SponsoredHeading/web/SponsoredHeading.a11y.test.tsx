import { expectNoA11yViolations } from '@/test-utils/a11y';
import { SponsoredHeading } from './SponsoredHeading';

describe('SponsoredHeading Accessibility', () => {
  it('has no violations for default heading', async () => {
    await expectNoA11yViolations(
      <SponsoredHeading importance={1}>Sponsored Article Title</SponsoredHeading>
    );
  });
});
