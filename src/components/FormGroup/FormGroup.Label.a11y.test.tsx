import { expectNoA11yViolations } from '@/test-utils/a11y';
import { FormGroupLabel } from './FormGroup.Label';

describe('FormGroupLabel Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations when label is associated with an input via id and htmlFor', async () => {
      const inputId = 'email-input';
      await expectNoA11yViolations(
        <>
          <FormGroupLabel id="email-label" htmlFor={inputId}>
            Email address
          </FormGroupLabel>
          <input id={inputId} type="email" aria-labelledby="email-label" />
        </>
      );
    });

    it('has no violations with required (optional indicator)', async () => {
      const inputId = 'optional-field';
      await expectNoA11yViolations(
        <>
          <FormGroupLabel id="optional-label" htmlFor={inputId} required>
            Optional field
          </FormGroupLabel>
          <input id={inputId} type="text" aria-labelledby="optional-label" />
        </>
      );
    });

    it('has no violations with dataTestId', async () => {
      const inputId = 'test-id-input';
      await expectNoA11yViolations(
        <>
          <FormGroupLabel id="test-label" htmlFor={inputId} dataTestId="form-group-label">
            Label with test id
          </FormGroupLabel>
          <input id={inputId} type="text" aria-labelledby="test-label" />
        </>
      );
    });

    it('has no violations when used without htmlFor (standalone label)', async () => {
      await expectNoA11yViolations(
        <FormGroupLabel id="standalone-label">Standalone label text</FormGroupLabel>
      );
    });
  });
});
