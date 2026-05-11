import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { RadioGroup } from './RadioGroup.native';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

const OPTIONS = [
  { value: 'a', title: 'Option A', description: 'First option' },
  { value: 'b', title: 'Option B' },
];

describe('RadioGroup Accessibility (native)', () => {
  it('exposes radiogroup role with accessibility label', () => {
    render(
      <RadioGroup
        name="payment"
        value="a"
        options={OPTIONS}
        onChange={() => {}}
        dataTestId="rg-a11y"
      />,
      { wrapper: ds }
    );

    const group = screen.getByTestId('rg-a11y');

    expect(group.props.accessibilityRole).toBe('radiogroup');
    expect(group.props.accessibilityLabel).toBe('payment');
  });

  it('renders radios with role "radio" and correct label', () => {
    render(
      <RadioGroup name="test" value="a" options={OPTIONS} onChange={() => {}} dataTestId="rg" />,
      { wrapper: ds }
    );

    const radioA = screen.getByRole('radio', { name: 'Option A' });
    const radioB = screen.getByRole('radio', { name: 'Option B' });

    expect(radioA).toBeOnTheScreen();
    expect(radioB).toBeOnTheScreen();
  });

  it('sets accessibilityState.checked correctly', () => {
    render(
      <RadioGroup name="test" value="a" options={OPTIONS} onChange={() => {}} dataTestId="rg" />,
      { wrapper: ds }
    );

    const radioA = screen.getByTestId('rg-option-a');
    const radioB = screen.getByTestId('rg-option-b');

    expect(radioA.props.accessibilityState?.checked).toBe(true);
    expect(radioB.props.accessibilityState?.checked).toBe(false);
  });

  it('sets accessibilityState.disabled when disabled', () => {
    render(
      <RadioGroup
        name="test"
        value="a"
        options={OPTIONS}
        disabled
        onChange={() => {}}
        dataTestId="rg-dis"
      />,
      { wrapper: ds }
    );

    const radioA = screen.getByTestId('rg-dis-option-a');
    const radioB = screen.getByTestId('rg-dis-option-b');

    expect(radioA.props.accessibilityState?.disabled).toBe(true);
    expect(radioB.props.accessibilityState?.disabled).toBe(true);
  });

  it('provides accessibilityHint when error is present', () => {
    render(
      <RadioGroup
        name="test"
        value=""
        options={OPTIONS}
        error
        onChange={() => {}}
        dataTestId="rg-err"
      />,
      { wrapper: ds }
    );

    const group = screen.getByTestId('rg-err');

    expect(group.props.accessibilityHint).toBe('Error: one or more options may require attention');
  });
});
