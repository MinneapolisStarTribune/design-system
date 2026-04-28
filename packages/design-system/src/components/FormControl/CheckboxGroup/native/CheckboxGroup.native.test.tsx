import { fireEvent, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { CheckboxGroup } from './CheckboxGroup.native';
import type { CheckboxCategory, CheckboxOption } from '../CheckboxGroup.types';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

const FLAT_OPTIONS: CheckboxOption[] = [
  { value: 'a', title: 'Option A' },
  { value: 'b', title: 'Option B' },
  { value: 'c', title: 'Option C' },
];

const CATEGORY_OPTIONS: CheckboxCategory[] = [
  {
    parentOption: { value: 'cat1', title: 'Category 1' },
    options: [
      { value: 'c1a', title: 'Option C1A' },
      { value: 'c1b', title: 'Option C1B' },
    ],
  },
];

describe('CheckboxGroup (native)', () => {
  it('renders flat options', () => {
    render(
      <CheckboxGroup
        value={[]}
        onChange={() => {}}
        options={FLAT_OPTIONS}
        dataTestId="checkbox-group"
      />,
      { wrapper: ds }
    );

    expect(screen.getByText('Option A', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('Option B', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('Option C', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it('calls onChange with selected value when option is pressed', () => {
    const onChange = jest.fn();
    render(
      <CheckboxGroup
        value={[]}
        onChange={onChange}
        options={FLAT_OPTIONS}
        dataTestId="checkbox-group"
      />,
      { wrapper: ds }
    );

    fireEvent.press(screen.getByTestId('checkbox-group-option-a-control'));
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  it('calls onChange to deselect when selected option is pressed', () => {
    const onChange = jest.fn();
    render(
      <CheckboxGroup
        value={['a']}
        onChange={onChange}
        options={FLAT_OPTIONS}
        dataTestId="checkbox-group"
      />,
      { wrapper: ds }
    );

    fireEvent.press(screen.getByTestId('checkbox-group-option-a-control'));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('category parent toggles all children when unchecked', () => {
    const onChange = jest.fn();
    render(
      <CheckboxGroup
        value={[]}
        onChange={onChange}
        categories={CATEGORY_OPTIONS}
        dataTestId="checkbox-group"
      />,
      { wrapper: ds }
    );

    fireEvent.press(screen.getByTestId('checkbox-group-category-cat1-control'));
    expect(onChange).toHaveBeenCalledWith(['c1a', 'c1b']);
  });

  it('category parent toggles all children off when checked', () => {
    const onChange = jest.fn();
    render(
      <CheckboxGroup
        value={['c1a', 'c1b']}
        onChange={onChange}
        categories={CATEGORY_OPTIONS}
        dataTestId="checkbox-group"
      />,
      { wrapper: ds }
    );

    fireEvent.press(screen.getByTestId('checkbox-group-category-cat1-control'));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
