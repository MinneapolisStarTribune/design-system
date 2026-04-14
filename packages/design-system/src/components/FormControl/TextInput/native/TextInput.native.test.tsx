import { fireEvent, render, screen } from '@testing-library/react-native';
import { View } from 'react-native';
import { FormGroupNative as FormGroup } from '@/components/FormGroup/native/FormGroup.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { TextInput } from './TextInput.native';

const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
const mockTrack = jest.fn();

jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ track: mockTrack }),
}));

function MockIcon() {
  return <View testID="mock-icon" />;
}

describe('TextInput (native)', () => {
  beforeEach(() => {
    mockTrack.mockClear();
  });

  it('renders placeholder and wrapper test id', () => {
    render(
      <TextInput placeholderText="Enter text" testID="native-input" accessibilityLabel="Input" />,
      { wrapper }
    );

    const input = screen.getByTestId('native-input', { includeHiddenElements: true });
    expect(input).toBeOnTheScreen();
    expect(input.props.placeholder).toBe('Enter text');
    expect(
      screen.getByTestId('native-input-wrapper', { includeHiddenElements: true })
    ).toBeOnTheScreen();
  });

  it('calls change, focus, and blur handlers', () => {
    const onChangeText = jest.fn();
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    render(
      <TextInput
        value="hello"
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        testID="native-input"
        accessibilityLabel="Input"
      />,
      { wrapper }
    );

    const input = screen.getByTestId('native-input', { includeHiddenElements: true });

    fireEvent.changeText(input, 'updated');
    fireEvent(input, 'focus', { nativeEvent: {} });
    fireEvent(input, 'blur', { nativeEvent: {} });

    expect(onChangeText).toHaveBeenCalledWith('updated');
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('tracks analytics on blur with value length and custom metadata', () => {
    render(
      <TextInput
        value="hello"
        analytics={{ form_field: 'email' }}
        testID="native-input"
        accessibilityLabel="Input"
      />,
      { wrapper }
    );

    fireEvent(screen.getByTestId('native-input', { includeHiddenElements: true }), 'blur', {
      nativeEvent: {},
    });

    expect(mockTrack).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'text_input_blur',
        component: 'TextInput',
        value_length: 5,
        form_field: 'email',
      })
    );
  });

  it('sets disabled state and prevents editing when disabled', () => {
    render(
      <TextInput
        placeholderText="Disabled"
        isDisabled
        testID="native-input"
        accessibilityLabel="Disabled input"
      />,
      { wrapper }
    );

    const input = screen.getByTestId('native-input', { includeHiddenElements: true });
    const wrapperNode = screen.getByTestId('native-input-wrapper', { includeHiddenElements: true });

    expect(input.props.editable).toBe(false);
    expect(input.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    expect(wrapperNode.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
  });

  it('renders decorative icons at either side', () => {
    const { rerender } = render(
      <TextInput
        icon={<MockIcon />}
        iconPosition="start"
        placeholderText="Search"
        accessibilityLabel="Leading icon"
      />,
      { wrapper }
    );

    expect(screen.getByTestId('mock-icon', { includeHiddenElements: true })).toBeOnTheScreen();

    rerender(
      <TextInput
        icon={<MockIcon />}
        iconPosition="end"
        placeholderText="Search"
        accessibilityLabel="Trailing icon"
      />
    );

    expect(screen.getByTestId('mock-icon', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it('uses FormGroup error state when caption variant is error', () => {
    render(
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <TextInput testID="native-input" placeholderText="you@example.com" />
        <FormGroup.Caption variant="error">Invalid email</FormGroup.Caption>
      </FormGroup>,
      { wrapper }
    );

    expect(
      screen.getByTestId('native-input', { includeHiddenElements: true }).props.accessibilityHint
    ).toBe('Input has error');
  });
});
