import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { CheckboxGroup } from './CheckboxGroup.native';
import type { CheckboxCategory, CheckboxOption } from '../CheckboxGroup.types';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

const FLAT_OPTIONS: CheckboxOption[] = [
  { value: 'a', title: 'Option A' },
  { value: 'b', title: 'Option B' },
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

describe('CheckboxGroup Accessibility (native)', () => {
  it('exposes checkbox roles for flat options', () => {
    render(
      <CheckboxGroup
        value={[]}
        onChange={() => {}}
        options={FLAT_OPTIONS}
        dataTestId="checkbox-group"
      />,
      { wrapper: ds }
    );

    expect(screen.getByRole('checkbox', { name: 'Option A' })).toBeOnTheScreen();
    expect(screen.getByRole('checkbox', { name: 'Option B' })).toBeOnTheScreen();
  });

  it('category parent uses mixed checked state when partially selected', () => {
    render(
      <CheckboxGroup
        value={['c1a']}
        onChange={() => {}}
        categories={CATEGORY_OPTIONS}
        dataTestId="checkbox-group"
      />,
      { wrapper: ds }
    );

    const parent = screen.getByTestId('checkbox-group-category-cat1-control');
    expect(parent.props.accessibilityState?.checked).toBe('mixed');
  });

  it('propagates disabled state to all controls', () => {
    render(
      <CheckboxGroup
        value={[]}
        onChange={() => {}}
        options={FLAT_OPTIONS}
        disabled
        dataTestId="checkbox-group"
      />,
      { wrapper: ds }
    );

    const control = screen.getByTestId('checkbox-group-option-a-control');
    expect(control.props.accessibilityState?.disabled).toBe(true);
  });
});
