import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Checkbox } from './Checkbox.native';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

describe('Checkbox Accessibility (native)', () => {
  it('exposes role checkbox with accessibility label from title', () => {
    render(
      <Checkbox title="Accept terms" checked={false} onChange={() => {}} dataTestId="cb-a11y" />,
      { wrapper: ds }
    );

    const control = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(control).toBeOnTheScreen();
  });

  it('sets accessibilityState.checked to "mixed" when indeterminate', () => {
    render(
      <Checkbox
        title="Select all"
        checked={false}
        indeterminate
        onChange={() => {}}
        dataTestId="cb-mixed"
      />,
      { wrapper: ds }
    );

    const control = screen.getByTestId('cb-mixed-control');
    expect(control.props.accessibilityState?.checked).toBe('mixed');
  });

  it('sets accessibilityState.disabled when disabled', () => {
    render(
      <Checkbox title="Opt" checked={false} disabled onChange={() => {}} dataTestId="cb-dis" />,
      { wrapper: ds }
    );

    const control = screen.getByTestId('cb-dis-control');
    expect(control.props.accessibilityState?.disabled).toBe(true);
  });

  it('sets aria-invalid when error', () => {
    render(<Checkbox title="Opt" checked={false} error onChange={() => {}} dataTestId="cb-err" />, {
      wrapper: ds,
    });

    const control = screen.getByTestId('cb-err-control');
    expect(control.props['aria-invalid']).toBe(true);
  });
});
