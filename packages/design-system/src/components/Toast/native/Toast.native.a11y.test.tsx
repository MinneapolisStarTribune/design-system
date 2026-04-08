import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ToastNative } from './Toast.native';

const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

describe('ToastNative Accessibility (native)', () => {
  it('exposes title text to assistive tech', () => {
    render(<ToastNative title="Notification title" onClose={jest.fn()} />, { wrapper });

    expect(screen.getByText('Notification title')).toBeOnTheScreen();
  });

  it('exposes description when provided', () => {
    render(
      <ToastNative
        title="Title"
        description="Secondary detail for screen readers."
        onClose={jest.fn()}
      />,
      { wrapper }
    );

    expect(screen.getByText('Secondary detail for screen readers.')).toBeOnTheScreen();
  });

  it('uses alert role and assertive live region for the error variant', () => {
    render(<ToastNative title="Something went wrong" variant="error" onClose={jest.fn()} />, {
      wrapper,
    });

    const root = screen.getByTestId('toast-native');
    expect(root.props.accessibilityRole).toBe('alert');
    expect(root.props.accessibilityLiveRegion).toBe('assertive');
  });

  it('uses polite live region for non-error variants', () => {
    render(<ToastNative title="FYI" variant="info" onClose={jest.fn()} />, { wrapper });

    const root = screen.getByTestId('toast-native');
    expect(root.props.accessibilityLiveRegion).toBe('polite');
    expect(root.props.accessibilityRole).toBeUndefined();
  });

  it('exposes the dismiss control with button role and an accessible name', () => {
    render(<ToastNative title="T" onClose={jest.fn()} />, { wrapper });

    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeOnTheScreen();
  });

  it('omits the dismiss button from the tree when showCloseButton is false', () => {
    render(<ToastNative title="Banner" onClose={jest.fn()} showCloseButton={false} />, {
      wrapper,
    });

    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).toBeNull();
  });
});
