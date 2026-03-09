import { expectNoA11yViolations } from '@/test-utils/a11y';
import { EditorialSponsoredText } from './EditorialSponsoredText';

describe('EditorialSponsoredText Accessibility', () => {
  it('has no violations with default props', async () => {
    await expectNoA11yViolations(
      <EditorialSponsoredText size="medium">Editorial sponsored text</EditorialSponsoredText>
    );
  });
});
