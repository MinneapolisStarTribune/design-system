import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import type { RadioOption } from './RadioGroup';

const options: RadioOption[] = [
  { value: 'a', title: 'Option A' },
  { value: 'b', title: 'Option B', description: 'Supporting copy for option B' },
  { value: 'c', title: 'Option C' },
];

describe('RadioGroup Accessibility', () => {
  it('has no violations in default state', async () => {
    await expectNoA11yViolations(
      <FormGroup>
        <FormGroup.Label>Choose one</FormGroup.Label>
        <FormControl.RadioGroup
          name="radio-group"
          value={null}
          onChange={() => {}}
          options={options}
          dataTestId="radio-group-default"
        />
      </FormGroup>
    );
  });

  it('has no violations in selected state', async () => {
    await expectNoA11yViolations(
      <FormGroup>
        <FormGroup.Label>Choose one</FormGroup.Label>
        <FormControl.RadioGroup
          name="radio-group"
          value="b"
          onChange={() => {}}
          options={options}
          color="brand"
          dataTestId="radio-group-selected"
        />
      </FormGroup>
    );
  });

  it('has no violations when disabled and in error', async () => {
    await expectNoA11yViolations(
      <FormGroup>
        <FormGroup.Label>Choose one</FormGroup.Label>
        <FormControl.RadioGroup
          name="radio-group"
          value={null}
          onChange={() => {}}
          options={options}
          disabled
          error
          dataTestId="radio-group-disabled-error"
        />
        <FormGroup.Caption variant="error">Please select one option</FormGroup.Caption>
      </FormGroup>
    );
  });

  it('has no violations after selecting an option', async () => {
    function InteractiveRadioGroup() {
      const [value, setValue] = useState<string | null>(null);

      return (
        <FormGroup>
          <FormGroup.Label>Choose one</FormGroup.Label>
          <FormControl.RadioGroup
            name="radio-group"
            value={value}
            onChange={setValue}
            options={options}
            dataTestId="radio-group-interactive"
          />
        </FormGroup>
      );
    }

    const { renderResult, checkA11y } = await renderAndCheckA11y(<InteractiveRadioGroup />);
    await userEvent.click(renderResult.getByTestId('radio-group-interactive-option-b'));
    await checkA11y();
  });
});
