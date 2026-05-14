import { expectNoA11yViolations } from '@/test-utils/a11y';
import { EyebrowBadge } from './EyebrowBadge';

describe('EyebrowBadge Accessibility', () => {
  it('has no violations with primary label only', async () => {
    await expectNoA11yViolations(<EyebrowBadge label="Live" />);
  });

  it('has no violations with secondary label', async () => {
    await expectNoA11yViolations(
      <EyebrowBadge label="Live" secondaryLabel="Updated 12 mins ago" variant="live" />
    );
  });
});
