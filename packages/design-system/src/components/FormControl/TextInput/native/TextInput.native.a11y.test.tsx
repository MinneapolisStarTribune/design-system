import { render, screen } from '@testing-library/react-native';
import { FormGroupNative as FormGroup } from '@/components/FormGroup/native/FormGroup.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { TextInput } from './TextInput.native';

describe('TextInput Accessibility (native)', () => {
  const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

  it('renders a standalone labeled input', () => {
    render(
      <TextInput
        placeholderText="Enter text"
        accessibilityLabel="Username"
        dataTestId="text-input"
      />,
      { wrapper }
    );

    expect(screen.getByTestId('text-input', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(
      screen.getByTestId('text-input', { includeHiddenElements: true }).props.accessibilityLabel
    ).toBe('Username');
  });

  it('marks disabled inputs as inaccessible for editing', () => {
    render(
      <TextInput
        placeholderText="Disabled"
        isDisabled
        accessibilityLabel="Disabled input"
        dataTestId="text-input"
      />,
      { wrapper }
    );

    expect(
      screen.getByTestId('text-input', { includeHiddenElements: true }).props.accessibilityState
    ).toEqual(expect.objectContaining({ disabled: true }));
  });

  it('preserves standalone accessibility hints when there is no error', () => {
    render(
      <TextInput
        placeholderText="Enter text"
        accessibilityLabel="Hinted input"
        accessibilityHint="Enter your text here"
        dataTestId="text-input"
      />,
      { wrapper }
    );

    expect(
      screen.getByTestId('text-input', { includeHiddenElements: true }).props.accessibilityHint
    ).toBe('Enter your text here');
  });

  it('uses the error accessibility hint inside FormGroup error state', () => {
    render(
      <FormGroup>
        <FormGroup.Label>Password</FormGroup.Label>
        <TextInput
          placeholderText="Enter password"
          dataTestId="text-input"
          accessibilityLabel="Password"
          accessibilityHint="Custom hint"
        />
        <FormGroup.Caption variant="error">Password is required</FormGroup.Caption>
      </FormGroup>,
      { wrapper }
    );

    expect(
      screen.getByTestId('text-input', { includeHiddenElements: true }).props.accessibilityHint
    ).toBe('Input has error');
    expect(screen.getByText('Password is required')).toBeOnTheScreen();
  });

  it('renders correctly with label, description, and informational caption', () => {
    render(
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <FormGroup.Description>We will never share your email</FormGroup.Description>
        <TextInput
          placeholderText="you@example.com"
          accessibilityLabel="Email"
          dataTestId="text-input"
        />
        <FormGroup.Caption variant="info">Enter a valid email address</FormGroup.Caption>
      </FormGroup>,
      { wrapper }
    );

    expect(screen.getByText('Email')).toBeOnTheScreen();
    expect(screen.getByText('We will never share your email')).toBeOnTheScreen();
    expect(screen.getByText('Enter a valid email address')).toBeOnTheScreen();
    expect(screen.getByTestId('utility-label')).toBeOnTheScreen();
    expect(
      screen.getByTestId('text-input', { includeHiddenElements: true }).props.placeholder
    ).toBe('you@example.com');
  });
});
