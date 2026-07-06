import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

const OPTIONS = [
  { value: 'tech', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music', disabled: true },
];

describe('MultiSelect Accessibility', () => {
  describe('standalone', () => {
    it('has no violations with aria-label', async () => {
      await expectNoA11yViolations(
        <FormControl.MultiSelect
          options={OPTIONS}
          placeholderText="Select interests"
          aria-label="Interests"
        />
      );
    });

    it('has no violations when disabled', async () => {
      await expectNoA11yViolations(
        <FormControl.MultiSelect
          options={OPTIONS}
          disabled
          placeholderText="Select interests"
          aria-label="Disabled interests"
        />
      );
    });

    it('has no violations in error state', async () => {
      await expectNoA11yViolations(
        <FormControl.MultiSelect options={OPTIONS} error aria-label="Interests with error" />
      );
    });
  });

  describe('within FormGroup', () => {
    it('has no violations with label, description, and caption', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Interests</FormGroup.Label>
          <FormGroup.Description>Select all that apply</FormGroup.Description>
          <FormControl.MultiSelect options={OPTIONS} />
          <FormGroup.Caption variant="info">You can choose more than one option</FormGroup.Caption>
        </FormGroup>
      );
    });
  });

  describe('interactive keyboard behavior', () => {
    it('has no violations when opened and toggled from keyboard', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <FormControl.MultiSelect
          options={OPTIONS}
          aria-label="Keyboard interests"
          dataTestId="multi-select"
        />
      );

      const trigger = renderResult.getByRole('combobox');

      await userEvent.tab();
      expect(trigger).toHaveFocus();

      await userEvent.keyboard('{Enter}');
      expect(renderResult.getByRole('listbox')).toBeInTheDocument();

      const option = renderResult.getByRole('option', { name: 'Technology' });
      option.focus();
      await userEvent.keyboard(' ');

      await checkA11y();
    });
  });
});
