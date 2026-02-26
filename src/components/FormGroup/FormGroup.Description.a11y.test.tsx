import { expectNoA11yViolations } from '@/test-utils/a11y';
import { FormGroupDescription } from './FormGroup.Description';

describe('FormGroupDescription Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations when description is associated with an input via id and aria-describedby', async () => {
      const descriptionId = 'email-description';
      await expectNoA11yViolations(
        <>
          <FormGroupDescription id={descriptionId}>
            We'll never share your email.
          </FormGroupDescription>
          <input
            id="email-input"
            type="email"
            aria-label="Email"
            aria-describedby={descriptionId}
          />
        </>
      );
    });

    it('has no violations with dataTestId', async () => {
      const descriptionId = 'desc-id';
      await expectNoA11yViolations(
        <>
          <FormGroupDescription
            id={descriptionId}
            dataTestId="form-group-description"
          >
            Help text for the field.
          </FormGroupDescription>
          <input
            id="field-input"
            type="text"
            aria-label="Field"
            aria-describedby={descriptionId}
          />
        </>
      );
    });

    it('has no violations when rendered standalone', async () => {
      await expectNoA11yViolations(
        <FormGroupDescription id="standalone-desc">
          Standalone description text
        </FormGroupDescription>
      );
    });
  });
});
