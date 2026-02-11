import { expectNoA11yViolations } from '@/test-utils/a11y';
import { UtilityHeading } from './UtilityHeading';

describe('UtilityHeading Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with section heading h1', async () => {
      await expectNoA11yViolations(
        <UtilityHeading importance={1} headingType="section">
          Section Title
        </UtilityHeading>
      );
    });

    it('has no violations with section heading h2', async () => {
      await expectNoA11yViolations(
        <UtilityHeading importance={2} headingType="section">
          Section Subtitle
        </UtilityHeading>
      );
    });

    it('has no violations with page heading h1', async () => {
      await expectNoA11yViolations(
        <UtilityHeading importance={1} headingType="page">
          Page Title
        </UtilityHeading>
      );
    });

    it('has no violations with page heading h2', async () => {
      await expectNoA11yViolations(
        <UtilityHeading importance={2} headingType="page">
          Page Subtitle
        </UtilityHeading>
      );
    });

    it('has no violations with higher heading levels', async () => {
      await expectNoA11yViolations(
        <UtilityHeading importance={3} headingType="section">
          H3 Heading
        </UtilityHeading>
      );
    });

    it('has no violations with custom className', async () => {
      await expectNoA11yViolations(
        <UtilityHeading importance={1} headingType="page" className="custom-class">
          Styled Page Title
        </UtilityHeading>
      );
    });

    it('has no violations with all props combined', async () => {
      await expectNoA11yViolations(
        <UtilityHeading
          importance={2}
          headingType="section"
          className="custom-class"
          dataTestId="heading"
        >
          All Props Heading
        </UtilityHeading>
      );
    });
  });
});
