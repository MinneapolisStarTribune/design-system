import { fireEvent, render, screen } from '@testing-library/react-native';
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

  it('opens option list when pressed', () => {
    render(
      <Select
        id="country"
        options={OPTIONS}
        placeholderText="Select an option"
        dataTestId="native-select"
      />,
      { wrapper }
    );

    fireEvent.press(screen.getByTestId('native-select'));

    expect(screen.getByTestId('native-select-options')).toBeOnTheScreen();
    expect(screen.getByText('United States')).toBeOnTheScreen();
    expect(screen.getByTestId('native-select-icon-up')).toBeOnTheScreen();
  });

  it('shows down icon when closed', () => {
    render(<Select id="country" options={OPTIONS} dataTestId="native-select" />, { wrapper });

    expect(screen.getByTestId('native-select-icon-down')).toBeOnTheScreen();
    expect(screen.queryByTestId('native-select-icon-up')).not.toBeOnTheScreen();
  });

  it('calls onChange when selecting an enabled option', () => {
    const onChange = jest.fn();
    render(
      <Select id="country" options={OPTIONS} dataTestId="native-select" onChange={onChange} />,
      {
        wrapper,
      }
    );

    fireEvent.press(screen.getByTestId('native-select'));
    fireEvent.press(screen.getByTestId('native-select-option-ca'));

    expect(onChange).toHaveBeenCalledWith('ca');
    expect(screen.queryByTestId('native-select-options')).not.toBeOnTheScreen();
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
