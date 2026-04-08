import { fireEvent, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ToastNative } from './Toast.native';

const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

describe('ToastNative', () => {
  it('renders title and description', () => {
    render(
      <ToastNative
        title="Update saved"
        description="Your changes have been saved."
        onClose={jest.fn()}
      />,
      { wrapper }
    );

    expect(screen.getByText('Update saved')).toBeOnTheScreen();
    expect(screen.getByText('Your changes have been saved.')).toBeOnTheScreen();
  });

  it('renders title only when description is omitted', () => {
    render(<ToastNative title="Title only" onClose={jest.fn()} />, { wrapper });

    expect(screen.getByText('Title only')).toBeOnTheScreen();
  });

  it('applies dataTestId to the root', () => {
    render(<ToastNative title="T" onClose={jest.fn()} dataTestId="toast-custom" />, { wrapper });

    expect(screen.getByTestId('toast-custom')).toBeOnTheScreen();
  });

  it('calls onClose when the dismiss control is pressed', () => {
    const onClose = jest.fn();
    render(<ToastNative title="Dismiss me" onClose={onClose} />, { wrapper });

    fireEvent.press(screen.getByRole('button', { name: 'Dismiss notification' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render dismiss control when showCloseButton is false', () => {
    render(<ToastNative title="Static" onClose={jest.fn()} showCloseButton={false} />, {
      wrapper,
    });

    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).toBeNull();
  });

  it('renders without icon slot when showIcon is false', () => {
    render(<ToastNative title="No icon" onClose={jest.fn()} showIcon={false} />, { wrapper });

    expect(screen.getByText('No icon')).toBeOnTheScreen();
  });

  it.each(['info', 'success', 'warning', 'error'] as const)('renders variant %s', (variant) => {
    render(<ToastNative title="Variant title" variant={variant} onClose={jest.fn()} />, {
      wrapper,
    });

    expect(screen.getByText('Variant title')).toBeOnTheScreen();
  });
});
