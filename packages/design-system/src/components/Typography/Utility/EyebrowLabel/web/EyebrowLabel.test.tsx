import { EyebrowLabel } from './EyebrowLabel';
import eyebrowStyles from './EyebrowLabel.module.scss';
import { renderWithProvider } from '@/test-utils/render';

describe('EyebrowLabel', () => {
  it('renders with defaults', () => {
    const { getByTestId } = renderWithProvider(
      <EyebrowLabel data-testid="eyebrow">Label</EyebrowLabel>
    );

    expect(getByTestId('eyebrow')).toBeInTheDocument();
    expect(getByTestId('eyebrow')).toHaveTextContent('Label');
  });

  it('renders live dot for live tone', () => {
    const { getByText } = renderWithProvider(<EyebrowLabel color="live">Live</EyebrowLabel>);

    expect(getByText('•')).toBeInTheDocument();
  });

  it('does not render live dot for non-live tones', () => {
    const { queryByText } = renderWithProvider(<EyebrowLabel color="neutral">Label</EyebrowLabel>);

    expect(queryByText('•')).not.toBeInTheDocument();
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

    expect(container.querySelector('svg')).not.toBeInTheDocument();
    expect(getByText('•')).toBeInTheDocument();
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
    const { container, getByText } = renderWithProvider(
      <EyebrowLabel color="live" isSubscriberOnly logo brand="startribune">
        Live
      </EyebrowLabel>
    );

    expect(
      container.querySelector(`.${eyebrowStyles.subscriberIcon}`)?.querySelector('svg')
    ).toBeInTheDocument();
    expect(getByText('•')).toBeInTheDocument();
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
});
