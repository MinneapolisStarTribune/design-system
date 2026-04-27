import { fireEvent, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { InlineLink } from './InlineLink.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('InlineLink (native)', () => {
  it('renders as a link and calls onPress when enabled', () => {
    const onPress = jest.fn();

    render(
      <InlineLink brand="startribune" onPress={onPress} aria-label="Read article terms">
        terms of use
      </InlineLink>,
      { wrapper }
    );

    const link = screen.getByRole('link', { name: 'Read article terms' });
    expect(link).toBeOnTheScreen();

    fireEvent.press(link);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('keeps rendered and blocks onPress when disabled', () => {
    const onPress = jest.fn();

    render(
      <InlineLink brand="startribune" disabled onPress={onPress} dataTestId="inline-disabled-link">
        archived story
      </InlineLink>,
      { wrapper }
    );

    const link = screen.getByTestId('inline-disabled-link');
    expect(link).toBeOnTheScreen();

    expect(link.props.onPress).toBeUndefined();
    expect(onPress).not.toHaveBeenCalled();
    expect(link.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    expect(link).toHaveStyle({ textDecorationLine: 'none' });
  });

  it('supports both brand values', () => {
    const { rerender } = render(
      <InlineLink brand="startribune" aria-label="Brand startribune">
        first
      </InlineLink>,
      { wrapper }
    );

    expect(screen.getByRole('link', { name: 'Brand startribune' })).toBeOnTheScreen();

    rerender(
      <InlineLink brand="varsity" aria-label="Brand varsity">
        second
      </InlineLink>
    );

    expect(screen.getByRole('link', { name: 'Brand varsity' })).toBeOnTheScreen();
  });

  it('forwards testID and accessibility label to the underlying link', () => {
    render(
      <InlineLink brand="startribune" dataTestId="inline-link-forwarded" aria-label="Forwarded label">
        forwarded
      </InlineLink>,
      { wrapper }
    );

    expect(screen.getByTestId('inline-link-forwarded')).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Forwarded label' })).toBeOnTheScreen();
  });
});