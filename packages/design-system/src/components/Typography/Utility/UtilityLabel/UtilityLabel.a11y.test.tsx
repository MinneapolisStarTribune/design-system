import { expectNoA11yViolations } from '@/test-utils/a11y';
import { UtilityLabel } from './UtilityLabel';

describe('UtilityLabel Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with small size', async () => {
      await expectNoA11yViolations(<UtilityLabel size="small">Small Label</UtilityLabel>);
    });

    it('has no violations with medium size', async () => {
      await expectNoA11yViolations(<UtilityLabel size="medium">Medium Label</UtilityLabel>);
    });

    it('has no violations with large size', async () => {
      await expectNoA11yViolations(<UtilityLabel size="large">Large Label</UtilityLabel>);
    });

    it('has no violations with regular weight', async () => {
      await expectNoA11yViolations(
        <UtilityLabel size="medium" weight="regular">
          Regular Weight
        </UtilityLabel>
      );
    });

    it('has no violations with semibold weight', async () => {
      await expectNoA11yViolations(
        <UtilityLabel size="medium" weight="semibold">
          Semibold Weight
        </UtilityLabel>
      );
    });

    it('has no violations with capitalize enabled', async () => {
      await expectNoA11yViolations(
        <UtilityLabel size="medium" capitalize>
          Capitalized Label
        </UtilityLabel>
      );
    });

    it('has no violations with all props combined', async () => {
      await expectNoA11yViolations(
        <UtilityLabel size="large" weight="semibold" capitalize>
          All Props Label
        </UtilityLabel>
      );
    });
  });
});
