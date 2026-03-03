import { vi } from 'vitest';
import { Button } from './Button';
import { renderWithProvider } from '../../test-utils/render';

describe('Button', () => {
  it('renders', () => {
    const { getByTestId } = renderWithProvider(
      <Button label="Button Label" onClick={vi.fn()} data-testid="button" />
    );

    expect(getByTestId('button')).toBeInTheDocument();
  });

  it('displays the label text', () => {
    const { getByText } = renderWithProvider(<Button label="Click me" onClick={vi.fn()} />);

    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('has correct size when passing in a size prop', () => {
    const { getByTestId } = renderWithProvider(
      <Button label="Small" onClick={vi.fn()} size="small" data-testid="button" />
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    // Button uses Mantine's theming system which applies styles via CSS variables
    // Verify the button has the correct size attribute
    expect(component).toHaveAttribute('data-size', 'small');
    expect(component).toHaveClass('mantine-Button-root');
  });

  it('applies custom className', () => {
    const { getByTestId } = renderWithProvider(
      <Button label="Custom" onClick={vi.fn()} className="custom-class" data-testid="button" />
    );

    const component = getByTestId('button');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('custom-class');
  });

  it('renders with an icon', () => {
    const { container } = renderWithProvider(
      <Button label="With Icon" onClick={vi.fn()} icon="camera-filled" />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('is disabled when isDisabled prop is true', () => {
    const { getByTestId } = renderWithProvider(
      <Button label="Disabled" onClick={vi.fn()} isDisabled data-testid="button" />
    );

    const component = getByTestId('button');

    expect(component).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const { getByTestId } = renderWithProvider(
      <Button label="Clickable" onClick={handleClick} data-testid="button" />
    );

    const component = getByTestId('button');
    component.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  describe('analytics', () => {
    it('emits tracking event on click when AnalyticsProvider is present', () => {
      const mockOnTrackingEvent = vi.fn();
      const { getByTestId } = renderWithProvider(
        <Button label="Subscribe" onClick={vi.fn()} data-testid="button" />,
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
          label="Subscribe"
          onClick={vi.fn()}
          analytics={{ cta_type: 'subscribe', module_position: 'hero' }}
          data-testid="button"
        />,
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
        <Button label="Share" onClick={vi.fn()} icon="share" data-testid="button" />,
        { mockOnTrackingEvent }
      );

      getByTestId('button').click();

      expect(mockOnTrackingEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'button_click',
          component: 'Button',
          icon: 'share',
        })
      );
    });
  });
});
