import React from 'react';
import { EyebrowLabel } from './EyebrowLabel';
import eyebrowStyles from './EyebrowLabel.module.scss';
import { renderWithProvider } from '@/test-utils/render';
import { CameraIcon } from '@/icons';

describe('EyebrowLabel', () => {
  it('renders with defaults', () => {
    const { getByTestId } = renderWithProvider(
      <EyebrowLabel data-testid="eyebrow">Label</EyebrowLabel>
    );

    expect(getByTestId('eyebrow')).toBeInTheDocument();
    expect(getByTestId('eyebrow')).toHaveTextContent('Label');
  });

  it('renders live dot for live tone', () => {
    const { container } = renderWithProvider(<EyebrowLabel color="live">Live</EyebrowLabel>);

    expect(container.querySelector(`.${eyebrowStyles.liveDot}`)).toBeInTheDocument();
  });

  it('does not render live dot for non-live tones', () => {
    const { container } = renderWithProvider(<EyebrowLabel color="neutral">Label</EyebrowLabel>);

    expect(container.querySelector(`.${eyebrowStyles.liveDot}`)).not.toBeInTheDocument();
  });

  it('renders logo when enabled and brand is startribune', () => {
    const { container } = renderWithProvider(
      <EyebrowLabel logo brand="startribune">
        Label
      </EyebrowLabel>
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render brand logo when color is live', () => {
    const { container, getByText } = renderWithProvider(
      <EyebrowLabel logo brand="startribune" color="live">
        Live
      </EyebrowLabel>
    );

    expect(container.querySelector(`.${eyebrowStyles.logo}`)).not.toBeInTheDocument();
    expect(getByText('Live')).toBeInTheDocument();
    expect(container.querySelector(`.${eyebrowStyles.liveDot}`)).toBeInTheDocument();
  });

  it('renders subscriber key icon when isSubscriberOnly is true', () => {
    const { container } = renderWithProvider(
      <EyebrowLabel isSubscriberOnly>Subscriber only</EyebrowLabel>
    );

    const wrap = container.querySelector(`.${eyebrowStyles.subscriberIcon}`);
    expect(wrap).toBeInTheDocument();
    expect(wrap?.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render brand logo when isSubscriberOnly is true', () => {
    const { container } = renderWithProvider(
      <EyebrowLabel logo brand="startribune" isSubscriberOnly>
        Subscriber only
      </EyebrowLabel>
    );

    expect(container.querySelector('.logo')).not.toBeInTheDocument();
    expect(
      container.querySelector(`.${eyebrowStyles.subscriberIcon}`)?.querySelector('svg')
    ).toBeInTheDocument();
  });

  it('shows subscriber key with live dot when both apply', () => {
    const { container } = renderWithProvider(
      <EyebrowLabel color="live" isSubscriberOnly logo brand="startribune">
        Live
      </EyebrowLabel>
    );

    expect(
      container.querySelector(`.${eyebrowStyles.subscriberIcon}`)?.querySelector('svg')
    ).toBeInTheDocument();
    expect(container.querySelector(`.${eyebrowStyles.liveDot}`)).toBeInTheDocument();
    expect(container.querySelector('.logo')).not.toBeInTheDocument();
  });

  it('logo matches eyebrow text color when logoColor is omitted', () => {
    const { getByTestId } = renderWithProvider(
      <EyebrowLabel
        data-testid="eyebrow"
        logo
        brand="startribune"
        color="brand"
        background="on-light"
      >
        Label
      </EyebrowLabel>
    );

    const root = getByTestId('eyebrow');
    const svg = root.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(window.getComputedStyle(svg as SVGSVGElement).color).toBe(
      window.getComputedStyle(root).color
    );
  });

  it('applies logoColor token when provided', () => {
    const { container } = renderWithProvider(
      <EyebrowLabel logo logoColor="brand-01" brand="startribune">
        Label
      </EyebrowLabel>
    );

    expect(container.querySelector('svg')).toHaveStyle({
      color: 'var(--color-icon-brand-01)',
    });
  });

  it('renders custom icon when provided', () => {
    const { container } = renderWithProvider(
      <EyebrowLabel customIcon={<CameraIcon data-testid="custom-icon" />}>Label</EyebrowLabel>
    );

    expect(container.querySelector('[data-testid="custom-icon"]')).toBeInTheDocument();
  });

  it('does not render custom icon when color is live', () => {
    const { queryByTestId } = renderWithProvider(
      <EyebrowLabel color="live" customIcon={<CameraIcon data-testid="custom-icon" />}>
        Live
      </EyebrowLabel>
    );

    expect(queryByTestId('custom-icon')).not.toBeInTheDocument();
  });

  it('does not render custom icon when isSubscriberOnly is true', () => {
    const { queryByTestId, container } = renderWithProvider(
      <EyebrowLabel isSubscriberOnly customIcon={<CameraIcon data-testid="custom-icon" />}>
        Subscriber only
      </EyebrowLabel>
    );

    expect(queryByTestId('custom-icon')).not.toBeInTheDocument();
    expect(
      container.querySelector(`.${eyebrowStyles.subscriberIcon}`)?.querySelector('svg')
    ).toBeInTheDocument();
  });

  it('renders custom icon instead of brand logo when both are provided', () => {
    const { container, getByTestId } = renderWithProvider(
      <EyebrowLabel logo brand="startribune" customIcon={<CameraIcon data-testid="custom-icon" />}>
        Label
      </EyebrowLabel>
    );

    expect(getByTestId('custom-icon')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('renders label prop when provided', () => {
    const { getByText } = renderWithProvider(
      <EyebrowLabel label="Breaking">Ignored Child</EyebrowLabel>
    );

    expect(getByText('Breaking')).toBeInTheDocument();
  });

  it('renders as a label element when requested', () => {
    const { getByTestId } = renderWithProvider(
      <EyebrowLabel as="label" htmlFor="target-input" data-testid="eyebrow">
        Section
      </EyebrowLabel>
    );

    expect(getByTestId('eyebrow').tagName).toBe('LABEL');
    expect(getByTestId('eyebrow')).toHaveAttribute('for', 'target-input');
  });

  it('applies the expected utility-label typography class', () => {
    const { getByText } = renderWithProvider(<EyebrowLabel size="large">Label</EyebrowLabel>);

    expect(getByText('Label')).toHaveClass('typography-utility-label-semibold-large-caps');
  });

  describe('polymorphic as', () => {
    it('renders as anchor with href as root element', () => {
      const { getByRole } = renderWithProvider(
        <EyebrowLabel as="a" href="/section" color="live">
          Live
        </EyebrowLabel>
      );

      const link = getByRole('link', { name: 'Live' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/section');
      expect(link).toHaveClass(eyebrowStyles.clickable);
      expect(link).toHaveClass('ds-eyebrow-link');
    });

    it('forwards props to a custom link component', () => {
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
        <EyebrowLabel as={RouterLink} href="/election" label="Election" prefetch={false} />
      );

      const el = getByRole('link', { name: 'Election' });
      expect(el).toHaveAttribute('href', '/election');
      expect(el).toHaveAttribute('data-test-prefetch', 'false');
      expect(el).toHaveClass(eyebrowStyles.clickable);
    });

    it('does not apply clickable styles on default span', () => {
      const { getByTestId } = renderWithProvider(
        <EyebrowLabel data-testid="eyebrow">Label</EyebrowLabel>
      );

      expect(getByTestId('eyebrow')).not.toHaveClass(eyebrowStyles.clickable);
    });
  });
});
