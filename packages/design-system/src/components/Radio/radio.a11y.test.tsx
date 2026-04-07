import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Radio } from './radio';

describe('Radio Accessibility', () => {
  describe('standalone', () => {
    it('has no violations with title association', async () => {
      await expectNoA11yViolations(
        <Radio
          title="Accept terms"
          checked={false}
          onChange={() => {}}
          dataTestId="radio-standalone"
        />
      );
    });

    it('has no violations with description', async () => {
      await expectNoA11yViolations(
        <Radio
          title="Subscribe to newsletter"
          description="Daily email updates"
          checked={false}
          onChange={() => {}}
          dataTestId="radio-with-description"
        />
      );
    });

    it('has no violations when disabled', async () => {
      await expectNoA11yViolations(
        <Radio
          title="Disabled option"
          checked={false}
          disabled
          onChange={() => {}}
          dataTestId="radio-disabled"
        />
      );
    });

    it('has no violations in error state', async () => {
      await expectNoA11yViolations(
        <Radio
          title="Required option"
          description="You must select this"
          checked={false}
          error
          onChange={() => {}}
          dataTestId="radio-error"
        />
      );
    });

    it('has no violations when checked', async () => {
      await expectNoA11yViolations(
        <Radio
          title="Checked option"
          checked={true}
          onChange={() => {}}
          dataTestId="radio-checked"
        />
      );
    });
  });

  describe('interactive', () => {
    it('has no violations when focused', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <Radio title="Focus me" checked={false} onChange={() => {}} dataTestId="radio-focus" />
      );

      const radio = renderResult.getByTestId('radio-focus');
      await userEvent.tab();
      expect(radio.querySelector('input')).toHaveFocus();

      await checkA11y();
    });

    it('has no violations when toggled', async () => {
      function ToggleRadio() {
        const [checked, setChecked] = useState(false);
        return (
          <Radio
            title="Toggle me"
            checked={checked}
            onChange={setChecked}
            dataTestId="radio-toggle"
          />
        );
      }

      const { renderResult, checkA11y } = await renderAndCheckA11y(<ToggleRadio />);

      const radio = renderResult.getByTestId('radio-toggle');
      const input = radio.querySelector('input')!;
      await userEvent.click(radio);
      expect(input).toBeChecked();

      await checkA11y();
    });
  });
});
