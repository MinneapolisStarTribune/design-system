import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { FormControl } from '@/components/FormControl/FormControl';

describe('Checkbox Accessibility', () => {
  describe('standalone', () => {
    it('has no violations with label association', async () => {
      await expectNoA11yViolations(
        <FormControl.Checkbox
          label="Accept terms"
          checked={false}
          onChange={() => {}}
          dataTestId="checkbox-standalone"
        />
      );
    });

    it('has no violations with caption', async () => {
      await expectNoA11yViolations(
        <FormControl.Checkbox
          label="Subscribe to newsletter"
          caption="Daily email updates"
          checked={false}
          onChange={() => {}}
          dataTestId="checkbox-with-desc"
        />
      );
    });

    it('has no violations when disabled', async () => {
      await expectNoA11yViolations(
        <FormControl.Checkbox
          label="Disabled option"
          checked={false}
          disabled
          onChange={() => {}}
          dataTestId="checkbox-disabled"
        />
      );
    });

    it('has no violations in error state (aria-invalid)', async () => {
      await expectNoA11yViolations(
        <FormControl.Checkbox
          label="Required option"
          caption="You must select this"
          checked={false}
          error
          onChange={() => {}}
          dataTestId="checkbox-error"
        />
      );
    });

    it('has no violations in indeterminate state (aria-checked="mixed")', async () => {
      await expectNoA11yViolations(
        <FormControl.Checkbox
          label="Select all"
          checked={false}
          indeterminate
          onChange={() => {}}
          dataTestId="checkbox-indeterminate"
        />
      );
    });

    it('has no violations when checked', async () => {
      await expectNoA11yViolations(
        <FormControl.Checkbox
          label="Checked option"
          checked={true}
          onChange={() => {}}
          dataTestId="checkbox-checked"
        />
      );
    });
  });

  describe('interactive', () => {
    it('has no violations when focused', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <FormControl.Checkbox
          label="Focus me"
          checked={false}
          onChange={() => {}}
          dataTestId="checkbox-focus"
        />
      );

      const checkbox = renderResult.getByTestId('checkbox-focus');
      await userEvent.tab();
      expect(checkbox.querySelector('input')).toHaveFocus();

      await checkA11y();
    });

    it('has no violations when toggled', async () => {
      function ToggleCheckbox() {
        const [checked, setChecked] = useState(false);
        return (
          <FormControl.Checkbox
            label="Toggle me"
            checked={checked}
            onChange={setChecked}
            dataTestId="checkbox-toggle"
          />
        );
      }

      const { renderResult, checkA11y } = await renderAndCheckA11y(<ToggleCheckbox />);

      const checkbox = renderResult.getByTestId('checkbox-toggle');
      const input = checkbox.querySelector('input')!;
      await userEvent.click(checkbox);
      expect(input).toBeChecked();

      await checkA11y();
    });
  });
});
