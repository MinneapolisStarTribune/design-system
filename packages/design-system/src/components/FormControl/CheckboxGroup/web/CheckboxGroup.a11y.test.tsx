import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/FormGroup';
import type { CheckboxOption, CheckboxCategory } from './CheckboxGroup';

const flatOptions: CheckboxOption[] = [
  { value: 'a', title: 'Option A' },
  { value: 'b', title: 'Option B', description: 'Optional description' },
];

const categoryOptions: CheckboxCategory[] = [
  {
    parentOption: { value: 'cat1', title: 'Category 1', description: 'Category description' },
    options: [
      { value: 'c1a', title: 'Option C1A' },
      { value: 'c1b', title: 'Option C1B' },
    ],
  },
];

describe('CheckboxGroup Accessibility', () => {
  describe('flat mode', () => {
    it('has no violations with flat options', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Select options</FormGroup.Label>
          <FormControl.CheckboxGroup
            value={[]}
            onChange={() => {}}
            options={flatOptions}
            dataTestId="checkbox-group-flat"
          />
        </FormGroup>
      );
    });

    it('has no violations when some options selected', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Select options</FormGroup.Label>
          <FormControl.CheckboxGroup
            value={['a']}
            onChange={() => {}}
            options={flatOptions}
            dataTestId="checkbox-group-flat-selected"
          />
        </FormGroup>
      );
    });

    it('has no violations when disabled', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Select options</FormGroup.Label>
          <FormControl.CheckboxGroup
            value={[]}
            onChange={() => {}}
            options={flatOptions}
            disabled
            dataTestId="checkbox-group-flat-disabled"
          />
        </FormGroup>
      );
    });

    it('has no violations when error', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Select options</FormGroup.Label>
          <FormControl.CheckboxGroup
            value={[]}
            onChange={() => {}}
            options={flatOptions}
            error
            dataTestId="checkbox-group-flat-error"
          />
        </FormGroup>
      );
    });

    it('has no violations when focused and toggled', async () => {
      function InteractiveCheckboxGroup() {
        const [value, setValue] = useState<string[]>([]);
        return (
          <FormGroup>
            <FormGroup.Label>Select options</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={value}
              onChange={setValue}
              options={flatOptions}
              dataTestId="checkbox-group-flat-interactive"
            />
          </FormGroup>
        );
      }

      const { renderResult, checkA11y } = await renderAndCheckA11y(<InteractiveCheckboxGroup />);

      const firstCheckbox = renderResult.getByTestId('checkbox-group-flat-interactive-option-a');
      await userEvent.click(firstCheckbox);
      await checkA11y();
    });
  });

  describe('category mode', () => {
    it('has no violations with categories', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Select options</FormGroup.Label>
          <FormControl.CheckboxGroup
            value={[]}
            onChange={() => {}}
            categories={categoryOptions}
            dataTestId="checkbox-group-categories"
          />
        </FormGroup>
      );
    });

    it('has no violations when category is indeterminate', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Select options</FormGroup.Label>
          <FormControl.CheckboxGroup
            value={['c1a']}
            onChange={() => {}}
            categories={categoryOptions}
            dataTestId="checkbox-group-categories-indeterminate"
          />
        </FormGroup>
      );
    });

    it('has no violations when category is fully selected', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Select options</FormGroup.Label>
          <FormControl.CheckboxGroup
            value={['c1a', 'c1b']}
            onChange={() => {}}
            categories={categoryOptions}
            dataTestId="checkbox-group-categories-checked"
          />
        </FormGroup>
      );
    });

    it('has no violations when category label is clicked', async () => {
      function InteractiveCategoryGroup() {
        const [value, setValue] = useState<string[]>([]);
        return (
          <FormGroup>
            <FormGroup.Label>Select options</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={value}
              onChange={setValue}
              categories={categoryOptions}
              dataTestId="checkbox-group-categories-interactive"
            />
          </FormGroup>
        );
      }

      const { renderResult, checkA11y } = await renderAndCheckA11y(<InteractiveCategoryGroup />);

      const categoryCheckbox = renderResult.getByTestId(
        'checkbox-group-categories-interactive-category-cat1'
      );
      await userEvent.click(categoryCheckbox);
      await checkA11y();
    });
  });
});
