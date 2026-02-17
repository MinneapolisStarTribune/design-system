import { expectNoA11yViolations } from '@/test-utils/a11y';
import { EditorialSponsoredText } from './EditorialSponsoredText';

describe('EditorialSponsoredText Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with small size', async () => {
      await expectNoA11yViolations(
        <EditorialSponsoredText size="small" weight="regular">
          Small Editorial Sponsored Text
        </EditorialSponsoredText>
      );
    });

    it('has no violations with medium size', async () => {
      await expectNoA11yViolations(
        <EditorialSponsoredText size="medium" weight="regular">
          Medium Editorial Sponsored Text
        </EditorialSponsoredText>
      );
    });

    it('has no violations with large size', async () => {
      await expectNoA11yViolations(
        <EditorialSponsoredText size="large" weight="regular">
          Large Editorial Sponsored Text
        </EditorialSponsoredText>
      );
    });

    it('has no violations with regular weight', async () => {
      await expectNoA11yViolations(
        <EditorialSponsoredText size="medium" weight="regular">
          Regular Weight Editorial Sponsored Text
        </EditorialSponsoredText>
      );
    });

    it('has no violations with bold weight', async () => {
      await expectNoA11yViolations(
        <EditorialSponsoredText size="medium" weight="bold">
          Bold Weight Editorial Sponsored Text
        </EditorialSponsoredText>
      );
    });

    it('has no violations with children', async () => {
      await expectNoA11yViolations(
        <EditorialSponsoredText size="large" weight="bold">
          <span>Children Editorial Sponsored Text</span>
        </EditorialSponsoredText>
      );
    });

    it('has no violations with custom className', async () => {
      await expectNoA11yViolations(
        <EditorialSponsoredText size="large" weight="bold" className="custom-class">
          Custom Class Editorial Sponsored Text
        </EditorialSponsoredText>
      );
    });
  });
});
