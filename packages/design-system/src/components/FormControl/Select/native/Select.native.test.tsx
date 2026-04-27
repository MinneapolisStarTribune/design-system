import { render, screen } from '@testing-library/react-native';
import { FormGroupNative as FormGroup } from '@/components/FormGroup/native/FormGroup.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Select } from './Select.native';

const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
];

describe('Select (native)', () => {
  it('renders with placeholder text when no value is selected', () => {
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
    expect(control).toBeOnTheScreen();
    expect(screen.getByText('Select an option')).toBeOnTheScreen();
  });

  it('renders selected option label when value matches an option', () => {
    render(<Select id="country" options={OPTIONS} value="ca" dataTestId="native-select" />, {
      wrapper,
    });

    expect(screen.getByText('Canada')).toBeOnTheScreen();
  });

  it('marks control as disabled when isDisabled is true', () => {
    render(<Select id="country" options={OPTIONS} isDisabled dataTestId="native-select" />, {
      wrapper,
    });

    const control = screen.getByTestId('native-select', { includeHiddenElements: true });
    expect(control.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true, expanded: false })
    );
  });

  it('renders with FormGroup context and keeps configured id', () => {
    render(
      <FormGroup>
        <FormGroup.Label>Country</FormGroup.Label>
        <Select id="country-select" options={OPTIONS} dataTestId="native-select" />
      </FormGroup>,
      { wrapper }
    );

    const control = screen.getByTestId('native-select', { includeHiddenElements: true });
    expect(control.props.nativeID).toBe('country-select');
    expect(screen.getByText('Country')).toBeOnTheScreen();
  });
});
