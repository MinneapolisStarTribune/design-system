import { vi } from 'vitest';
import { Toast } from './Toast';
import { renderWithProvider } from '../../test-utils/render';

describe('Toast', () => {
  it('renders', () => {
    const { getByTestId } = renderWithProvider(
      <Toast title="Toast title" onClose={vi.fn()} dataTestId="toast" />
    );

    expect(getByTestId('toast')).toBeInTheDocument();
  });

  it('displays the title text', () => {
    const { getByText } = renderWithProvider(<Toast title="Update saved" onClose={vi.fn()} />);

    expect(getByText('Update saved')).toBeInTheDocument();
  });

  it('displays description when provided', () => {
    const { getByText } = renderWithProvider(
      <Toast title="Title" description="Your changes have been saved." onClose={vi.fn()} />
    );

    expect(getByText('Your changes have been saved.')).toBeInTheDocument();
  });

  it('renders with title only when description is omitted', () => {
    const { getByText } = renderWithProvider(<Toast title="Title only" onClose={vi.fn()} />);

    expect(getByText('Title only')).toBeInTheDocument();
  });

  it('has role="status" for non-error variants', () => {
    const { getByRole } = renderWithProvider(
      <Toast title="Info" variant="info" onClose={vi.fn()} />
    );

    expect(getByRole('status')).toBeInTheDocument();
  });

  it('has role="alert" for error variant', () => {
    const { getByRole } = renderWithProvider(
      <Toast title="Error" variant="error" onClose={vi.fn()} />
    );

    expect(getByRole('alert')).toBeInTheDocument();
  });

  it('renders icon when showIcon is true', () => {
    const { container } = renderWithProvider(
      <Toast title="With icon" showIcon onClose={vi.fn()} />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render variant icon when showIcon is false', () => {
    const { container } = renderWithProvider(
      <Toast title="No icon" showIcon={false} onClose={vi.fn()} />
    );

    // Close button still has an icon; only one SVG (close) when showIcon is false
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(1);
  });

  it('applies dataTestId to the toast container', () => {
    const { getByTestId } = renderWithProvider(
      <Toast title="Test" onClose={vi.fn()} dataTestId="toast-custom" />
    );

    expect(getByTestId('toast-custom')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    const { getByRole } = renderWithProvider(<Toast title="Dismiss me" onClose={handleClose} />);

    const closeButton = getByRole('button', { name: 'Dismiss notification' });
    closeButton.click();

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
