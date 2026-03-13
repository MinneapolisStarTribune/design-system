import { vi } from 'vitest';
import { Button } from './Button';
import { renderWithProvider } from '../../../test-utils/render';
import CameraFilledIcon from '@/icons/camera-filled.svg?react';
import ShareIcon from '@/icons/share.svg?react';

describe('Button', () => {
  it('renders', () => {
    const { getByTestId } = renderWithProvider(
      <Button onClick={vi.fn()} data-testid="button">
        Button Label
      </Button>
    );

    expect(getByTestId('button')).toBeInTheDocument();
  });

  it('displays the label text', () => {
    const { getByText } = renderWithProvider(<Button onClick={vi.fn()}>Click me</Button>);

    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('has correct size when passing in a size prop', () => {
    const { getByTestId } = renderWithProvider(
      <Button onClick={vi.fn()} size="small" data-testid="button">
        Small
      </Button>
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();

    // Button now uses CSS modules and design tokens for sizing.
    // CSS Modules generate hashed class names like `_button_xxx _small_xxx`.
    // Verify that at least one of the classes corresponds to the `small` size.
    const classNames = component.className.split(' ');
    expect(classNames.some((c) => c.includes('small'))).toBe(true);
  });

  it('applies custom className', () => {
    const { getByTestId } = renderWithProvider(
      <Button onClick={vi.fn()} className="custom-class" data-testid="button">
        Custom
      </Button>
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('custom-class');
  });

  it('renders with an icon', () => {
    const { container } = renderWithProvider(
      <Button onClick={vi.fn()} icon={<CameraFilledIcon />}>
        With Icon
      </Button>
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('is disabled when isDisabled prop is true', () => {
    const { getByTestId } = renderWithProvider(
      <Button onClick={vi.fn()} isDisabled data-testid="button">
        Disabled
      </Button>
    );

    const component = getByTestId('button');

    expect(component).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const { getByTestId } = renderWithProvider(
      <Button onClick={handleClick} data-testid="button">
        Clickable
      </Button>
    );

    const component = getByTestId('button');
    component.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  describe('analytics', () => {
    it('emits tracking event on click when AnalyticsProvider is present', () => {
      const mockOnTrackingEvent = vi.fn();
      const { getByTestId } = renderWithProvider(
        <Button onClick={vi.fn()} data-testid="button">
          Subscribe
        </Button>,
        { mockOnTrackingEvent }
      );

      getByTestId('button').click();

      expect(mockOnTrackingEvent).toHaveBeenCalledTimes(1);
      expect(mockOnTrackingEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'button_click',
          component: 'Button',
          label: 'Subscribe',
          variant: 'filled',
          color: 'neutral',
        })
      );
    });

    it('merges analytics prop into tracking event', () => {
      const mockOnTrackingEvent = vi.fn();
      const { getByTestId } = renderWithProvider(
        <Button
          onClick={vi.fn()}
          analytics={{ cta_type: 'subscribe', module_position: 'hero' }}
          data-testid="button"
        >
          Subscribe
        </Button>,
        { mockOnTrackingEvent }
      );

      getByTestId('button').click();

      expect(mockOnTrackingEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'button_click',
          component: 'Button',
          cta_type: 'subscribe',
          module_position: 'hero',
        })
      );
    });

    it('includes icon in tracking event when present', () => {
      const mockOnTrackingEvent = vi.fn();
      const { getByTestId } = renderWithProvider(
        <Button onClick={vi.fn()} icon={<ShareIcon />} data-testid="button">
          Share
        </Button>,
        { mockOnTrackingEvent }
      );

      getByTestId('button').click();

      expect(mockOnTrackingEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'button_click',
          component: 'Button',
          label: 'Share',
        })
      );
    });
  });
});
