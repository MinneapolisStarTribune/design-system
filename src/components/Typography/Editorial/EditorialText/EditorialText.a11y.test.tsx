import { expectNoA11yViolations } from '@/test-utils/a11y';
import { EditorialText } from './EditorialText';

describe('EditorialText Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with small size', async () => {
      await expectNoA11yViolations(
        <EditorialText size="small" weight="regular">
          Small Editorial Text
        </EditorialText>
      );
    });

    it('has no violations with medium size', async () => {
      await expectNoA11yViolations(
        <EditorialText size="medium" weight="regular">
          Medium Editorial Text
        </EditorialText>
      );
    });

    it('has no violations with large size', async () => {
      await expectNoA11yViolations(
        <EditorialText size="large" weight="regular">
          Large Editorial Text
        </EditorialText>
      );
    });

    it('has no violations with regular weight', async () => {
      await expectNoA11yViolations(
        <EditorialText size="medium" weight="regular">
          Regular Weight Editorial Text
        </EditorialText>
      );
    });

    it('has no violations with bold weight', async () => {
      await expectNoA11yViolations(
        <EditorialText size="medium" weight="bold">
          Bold Weight Editorial Text
        </EditorialText>
      );
    });

    it('has no violations with children', async () => {
      await expectNoA11yViolations(
        <EditorialText size="large" weight="bold">
          <span>Children Editorial Text</span>
        </EditorialText>
      );
    });

    it('has no violations with custom className', async () => {
      await expectNoA11yViolations(
        <EditorialText size="large" weight="bold" className="custom-class">
          Custom Class Editorial Text
        </EditorialText>
      );
    });
  });
});
