import { fireEvent, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Link } from './Link.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('Link (native)', () => {
  it('renders utility variant with icon support', () => {
    render(
      <Link size="medium" icon={<>{'>'}</>} iconPosition="start">
        Read more
      </Link>,
      { wrapper }
    );

    expect(screen.getByText('Read more')).toBeOnTheScreen();
  });

  it('renders inline variant as a link with underline styling', () => {
    render(
      <Link variant="inline" brand="startribune" aria-label="Inline terms link">
        terms of use
      </Link>,
      { wrapper }
    );

    const link = screen.getByRole('link', { name: 'Inline terms link' });
    expect(link).toBeOnTheScreen();
    expect(link).toHaveStyle({ textDecorationLine: 'underline' });
  });

  it('calls onPress for inline variant when enabled', () => {
    const onPress = jest.fn();

    render(
      <Link variant="inline" brand="startribune" onPress={onPress} aria-label="Inline enabled">
        enabled link
      </Link>,
      { wrapper }
    );

    const link = screen.getByRole('link', { name: 'Inline enabled' });
    fireEvent.press(link);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('keeps inline link rendered and blocks onPress when disabled', () => {
    const onPress = jest.fn();

    render(
      <Link
        variant="inline"
        brand="startribune"
        disabled
        onPress={onPress}
        dataTestId="inline-disabled-link"
      >
        archived story
      </Link>,
      { wrapper }
    );

    const link = screen.getByTestId('inline-disabled-link');
    expect(link).toBeOnTheScreen();
    expect(link.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    expect(link.props.onPress).toBeUndefined();
    expect(link).toHaveStyle({ textDecorationLine: 'none' });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies disabled accessibility state for utility link', () => {
    render(
      <Link variant="utility" size="medium" disabled aria-label="Disabled utility link">
        Read later
      </Link>,
      { wrapper }
    );

    const link = screen.getByRole('link', { name: 'Disabled utility link' });
    expect(link.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
  });
});
