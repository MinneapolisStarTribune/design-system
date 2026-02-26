import { expectNoA11yViolations } from '@/test-utils/a11y';
import { FormGroupCaption } from './FormGroup.Caption';
import { FormGroupProvider } from './FormGroupContext';

describe('FormGroupCaption Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with info variant', async () => {
      await expectNoA11yViolations(
        <FormGroupCaption variant="info">Informational caption</FormGroupCaption>
      );
    });

    it('has no violations with error variant', async () => {
      await expectNoA11yViolations(
        <FormGroupCaption variant="error">Error caption</FormGroupCaption>
      );
    });

    it('has no violations with success variant', async () => {
      await expectNoA11yViolations(
        <FormGroupCaption variant="success">Success caption</FormGroupCaption>
      );
    });

    it('has no violations when used within FormGroupProvider context', async () => {
      await expectNoA11yViolations(
        <FormGroupProvider hasLabel hasDescription hasCaption>
          <FormGroupCaption variant="info">Contextual caption</FormGroupCaption>
        </FormGroupProvider>
      );
    });
  });
});
