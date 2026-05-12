import { fireEvent, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Select } from './Select.native';

const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
];

describe('Select Accessibility (native)', () => {
  it('exposes button role and label from placeholder by default', () => {
    render(
      <Select
        id="country"
        options={OPTIONS}
        placeholderText="Select an option"
        dataTestId="native-select"
      />,
      { wrapper }
    );

    const control = screen.getByTestId('native-select', { includeHiddenElements: true });
    expect(control.props.accessibilityRole).toBe('button');
    expect(control.props.accessibilityLabel).toBe('Select an option');
  });

  it('uses provided accessibilityLabel when supplied', () => {
    render(
      <Select
        id="country"
        options={OPTIONS}
        accessibilityLabel="Country selector"
        dataTestId="native-select"
      />,
      { wrapper }
    );

    expect(
      screen.getByRole('button', { name: 'Country selector', includeHiddenElements: true })
    ).toBeOnTheScreen();
  });

  it('marks disabled state in accessibilityState', () => {
    render(<Select id="country" options={OPTIONS} isDisabled dataTestId="native-select" />, {
      wrapper,
    });

    expect(
      screen.getByTestId('native-select', { includeHiddenElements: true }).props.accessibilityState
    ).toEqual(expect.objectContaining({ disabled: true, expanded: false }));
  });

  it('updates expanded accessibilityState when opened', () => {
    render(<Select id="country" options={OPTIONS} dataTestId="native-select" />, { wrapper });

    fireEvent.press(screen.getByTestId('native-select'));

    expect(
      screen.getByTestId('native-select', { includeHiddenElements: true }).props.accessibilityState
    ).toEqual(expect.objectContaining({ expanded: true }));
  });
});
