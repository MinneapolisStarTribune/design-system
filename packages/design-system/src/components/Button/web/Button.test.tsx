import React from 'react';
import { vi } from 'vitest';
import { Button } from './Button';
import buttonStyles from './Button.module.scss';
import { renderWithProvider } from '../../../test-utils/render';
import { CameraFilledIcon, Share01Icon } from '@/icons';

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

  it('surface="dark" applies dark-surface neutral token scope on the button', () => {
    const { getByTestId } = renderWithProvider(
      <Button surface="dark" onClick={vi.fn()} data-testid="button">
        X
      </Button>
    );
    expect(getByTestId('button')).toHaveClass(buttonStyles.surfaceDark);
  });

  it('surface="dark" with brand applies dark surface class; Strib palette when html brand is startribune', () => {
    const { getByTestId } = renderWithProvider(
      <Button surface="dark" color="brand" onClick={vi.fn()} data-testid="button">
        X
      </Button>
    );
    const el = getByTestId('button');
    expect(el).toHaveClass(buttonStyles.surfaceDark);
    expect(el).toHaveClass(buttonStyles.brand);
    expect(document.documentElement.getAttribute('data-ds-brand')).toBe('startribune');
  });

  it('default surface does not apply dark-surface classes', () => {
    const { getByTestId } = renderWithProvider(
      <Button onClick={vi.fn()} data-testid="button">
        X
      </Button>
    );
    expect(getByTestId('button')).not.toHaveClass(buttonStyles.surfaceDark);
  });

  it('surface="dark" with provider brand varsity sets html data-ds-brand for CSS palette', () => {
    const { getByTestId } = renderWithProvider(
      <Button surface="dark" color="brand" onClick={vi.fn()} data-testid="button">
        X
      </Button>,
      { brand: 'varsity' }
    );
    const el = getByTestId('button');
    expect(el).toHaveClass(buttonStyles.surfaceDark);
    expect(document.documentElement.getAttribute('data-ds-brand')).toBe('varsity');
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

  it('defaults native button type to "button"', () => {
    const { getByRole } = renderWithProvider(<Button onClick={vi.fn()}>Go</Button>);
    expect(getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('forwards type="submit" to the button element', () => {
    const { getByRole } = renderWithProvider(
      <Button type="submit" onClick={vi.fn()}>
        Submit
      </Button>
    );
    expect(getByRole('button')).toHaveAttribute('type', 'submit');
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
        <Button onClick={vi.fn()} icon={<Share01Icon />} data-testid="button">
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

  describe('polymorphic as', () => {
    it('renders as <a> when as="a" and forwards href', () => {
      const { getByRole } = renderWithProvider(
        <Button as="a" href="/subscribe" variant="filled" color="brand">
          Subscribe
        </Button>
      );
      const link = getByRole('link', { name: 'Subscribe' });
      expect(link).toHaveAttribute('href', '/subscribe');
      expect(link.tagName).toBe('A');
    });

    it('does not set type on anchor root', () => {
      const { getByRole } = renderWithProvider(
        <Button as="a" href="/x" variant="outlined">
          Go
        </Button>
      );
      expect(getByRole('link')).not.toHaveAttribute('type');
    });

    it('uses aria-disabled (not disabled attr) when isDisabled on anchor', () => {
      const { getByRole } = renderWithProvider(
        <Button as="a" href="/x" isDisabled>
          Go
        </Button>
      );
      const link = getByRole('link');
      expect(link).not.toHaveAttribute('disabled');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');
    });

    it('does not invoke onClick when disabled anchor is clicked', () => {
      const handleClick = vi.fn();
      const { getByRole } = renderWithProvider(
        <Button as="a" href="/x" isDisabled onClick={handleClick}>
          Go
        </Button>
      );
      getByRole('link').click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('accepts a custom component as (e.g. router Link) and forwards props', () => {
      const RouterLink = React.forwardRef<
        HTMLAnchorElement,
        { href: string; children?: React.ReactNode; prefetch?: boolean }
      >(({ href, children, prefetch, ...rest }, ref) => (
        <a ref={ref} href={href} data-test-prefetch={String(prefetch)} {...rest}>
          {children}
        </a>
      ));
      RouterLink.displayName = 'RouterLink';

      const { getByRole } = renderWithProvider(
        <Button as={RouterLink} href="/page" prefetch={false} variant="outlined" color="neutral">
          Next
        </Button>
      );

      const el = getByRole('link', { name: 'Next' });
      expect(el).toHaveAttribute('href', '/page');
      expect(el).toHaveAttribute('data-test-prefetch', 'false');
    });
  });
});
