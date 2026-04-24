import { fireEvent, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Link } from './Link.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('Link (native)', () => {
  it('renders inline variant as a link and calls onPress when enabled', () => {
    const onPress = jest.fn();

    render(
      <Link variant="inline" brand="startribune" onPress={onPress} aria-label="Read article terms">
        terms of use
      </Link>,
      { wrapper }
    );

    const link = screen.getByRole('link', { name: 'Read article terms' });
    expect(link).toBeOnTheScreen();

    fireEvent.press(link);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('keeps inline variant rendered and blocks onPress when disabled', () => {
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

    fireEvent.press(link);
    expect(onPress).not.toHaveBeenCalled();
    expect(link.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    expect(link).toHaveStyle({ textDecorationLine: 'none' });
  });

  it('renders utility variant with icon support', () => {
    render(
      <Link size="medium" icon={<>{'>'}</>} iconPosition="start">
        Read more
      </Link>,
      { wrapper }
    );

    expect(screen.getByText('Read more')).toBeOnTheScreen();
  });
});
