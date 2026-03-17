import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';
import type { CheckboxOption, CheckboxCategory } from './CheckboxGroup';

const flatOptions: CheckboxOption[] = [
  { value: 'a', title: 'Option A' },
  { value: 'b', title: 'Option B' },
  { value: 'c', title: 'Option C' },
];

const categoryOptions: CheckboxCategory[] = [
  {
    parentOption: { value: 'cat1', title: 'Category 1' },
    options: [
      { value: 'c1a', title: 'Option C1A' },
      { value: 'c1b', title: 'Option C1B' },
    ],
  },
];

describe('CheckboxGroup', () => {
  describe('flat mode', () => {
    it('renders all options', () => {
      const { getByText } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={[]}
          onChange={() => {}}
          options={flatOptions}
          dataTestId="checkbox-group"
        />
      );

      expect(getByText('Option A')).toBeInTheDocument();
      expect(getByText('Option B')).toBeInTheDocument();
      expect(getByText('Option C')).toBeInTheDocument();
    });

    it('calls onChange when option is clicked', async () => {
      const onChange = vi.fn();
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={[]}
          onChange={onChange}
          options={flatOptions}
          dataTestId="checkbox-group"
        />
      );

      await userEvent.click(getByTestId('checkbox-group-option-a'));
      expect(onChange).toHaveBeenCalledWith(['a']);
    });

    it('calls onChange to deselect when selected option is clicked', async () => {
      const onChange = vi.fn();
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={['a']}
          onChange={onChange}
          options={flatOptions}
          dataTestId="checkbox-group"
        />
      );

      await userEvent.click(getByTestId('checkbox-group-option-a'));
      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('applies disabled state to all checkboxes', () => {
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={[]}
          onChange={() => {}}
          options={flatOptions}
          disabled
          dataTestId="checkbox-group"
        />
      );

      const optionA = getByTestId('checkbox-group-option-a');
      expect(optionA.querySelector('input')).toBeDisabled();
    });

    it('uses categories when both options and categories are provided', () => {
      const { getByText, queryByText } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={[]}
          onChange={() => {}}
          options={flatOptions}
          categories={categoryOptions}
          dataTestId="checkbox-group"
        />
      );

      expect(getByText('Category 1')).toBeInTheDocument();
      expect(getByText('Option C1A')).toBeInTheDocument();
      expect(getByText('Option C1B')).toBeInTheDocument();
      expect(queryByText('Option A')).not.toBeInTheDocument();
    });
  });

  describe('category mode', () => {
    it('renders category label and child options', () => {
      const { getByText } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={[]}
          onChange={() => {}}
          categories={categoryOptions}
          dataTestId="checkbox-group"
        />
      );

      expect(getByText('Category 1')).toBeInTheDocument();
      expect(getByText('Option C1A')).toBeInTheDocument();
      expect(getByText('Option C1B')).toBeInTheDocument();
    });

    it('category label shows indeterminate when some options selected', () => {
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={['c1a']}
          onChange={() => {}}
          categories={categoryOptions}
          dataTestId="checkbox-group"
        />
      );

      const categoryInput = getByTestId('checkbox-group-category-cat1').querySelector('input');
      expect(categoryInput).toHaveAttribute('aria-checked', 'mixed');
    });

    it('category label shows checked when all options selected', () => {
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={['c1a', 'c1b']}
          onChange={() => {}}
          categories={categoryOptions}
          dataTestId="checkbox-group"
        />
      );

      const categoryInput = getByTestId('checkbox-group-category-cat1').querySelector('input');
      expect(categoryInput).toBeChecked();
    });

    it('category label shows unchecked when no options selected', () => {
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={[]}
          onChange={() => {}}
          categories={categoryOptions}
          dataTestId="checkbox-group"
        />
      );

      const categoryInput = getByTestId('checkbox-group-category-cat1').querySelector('input');
      expect(categoryInput).not.toBeChecked();
      expect(categoryInput).not.toHaveAttribute('aria-checked', 'mixed');
    });

    it('clicking category label when unchecked selects all options in category', async () => {
      const onChange = vi.fn();
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={[]}
          onChange={onChange}
          categories={categoryOptions}
          dataTestId="checkbox-group"
        />
      );

      await userEvent.click(getByTestId('checkbox-group-category-cat1'));
      expect(onChange).toHaveBeenCalledWith(['c1a', 'c1b']);
    });

    it('clicking category label when indeterminate selects all options in category', async () => {
      const onChange = vi.fn();
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={['c1a']}
          onChange={onChange}
          categories={categoryOptions}
          dataTestId="checkbox-group"
        />
      );

      await userEvent.click(getByTestId('checkbox-group-category-cat1'));
      expect(onChange).toHaveBeenCalledWith(['c1a', 'c1b']);
    });

    it('clicking category label when checked deselects all options in category', async () => {
      const onChange = vi.fn();
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={['c1a', 'c1b']}
          onChange={onChange}
          categories={categoryOptions}
          dataTestId="checkbox-group"
        />
      );

      await userEvent.click(getByTestId('checkbox-group-category-cat1'));
      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('clicking category label preserves options from other categories', async () => {
      const otherCategory: CheckboxCategory = {
        parentOption: { value: 'cat2', title: 'Category 2' },
        options: [{ value: 'c2a', title: 'Option C2A' }],
      };
      const onChange = vi.fn();
      const { getByTestId } = renderWithProvider(
        <FormControl.CheckboxGroup
          value={['c2a']}
          onChange={onChange}
          categories={[...categoryOptions, otherCategory]}
          dataTestId="checkbox-group"
        />
      );

      await userEvent.click(getByTestId('checkbox-group-category-cat1'));
      expect(onChange).toHaveBeenCalledWith(['c2a', 'c1a', 'c1b']);
    });
  });
});
