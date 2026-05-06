import { EyebrowBadge } from './EyebrowBadge';
import styles from './EyebrowBadge.module.scss';
import { renderWithProvider } from '@/test-utils/render';

describe('EyebrowBadge', () => {

  it('renders required label', () => {
    const { getByText } = renderWithProvider(<EyebrowBadge label="Live" />);
    expect(getByText('Live')).toBeInTheDocument();
  });

  it('renders secondary label when provided', () => {
    const { getByText } = renderWithProvider(
      <EyebrowBadge label="Live" secondaryLabel="Updated 12 mins ago" />
    );

    expect(getByText('Updated 12 mins ago')).toBeInTheDocument();
  });

  it('shows dot by default for live variant', () => {
    const { container } = renderWithProvider(<EyebrowBadge label="Live" variant="live" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('does not show dot for breaking variant', () => {
    const { container } = renderWithProvider(<EyebrowBadge label="Breaking" variant="breaking" />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('does not show dot for breaking variant even when showDot is true', () => {
    const { container } = renderWithProvider(
      <EyebrowBadge label="Breaking" variant="breaking" showDot />
    );
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('does not render secondary label for sponsored variant', () => {
    const { queryByText } = renderWithProvider(
      <EyebrowBadge label="Sponsored" secondaryLabel="Updated 12 mins ago" variant="sponsored" />
    );
    expect(queryByText('Updated 12 mins ago')).not.toBeInTheDocument();
  });

  it('uses Utility/Label medium semibold caps typography for large size', () => {
    const { getByText } = renderWithProvider(<EyebrowBadge label="Live" size="large" />);
    expect(getByText('Live')).toHaveClass('typography-utility-label-semibold-medium-caps');
  });

  it('uses Utility/Label small semibold caps typography for small size', () => {
    const { getByText } = renderWithProvider(<EyebrowBadge label="Live" size="small" />);
    expect(getByText('Live')).toHaveClass('typography-utility-label-semibold-small-caps');
  });

  it('applies showcase dark-surface class when color scheme is dark', () => {
    const { container } = renderWithProvider(
      <EyebrowBadge label="Showcase" variant="showcase" secondaryLabel="Optional label" showDot={false} />,
      { colorScheme: 'dark' }
    );
    expect(container.firstChild).toHaveClass(styles.showcaseWhenDark);
  });

  it('does not apply showcase dark-surface class when color scheme is light', () => {
    const { container } = renderWithProvider(
      <EyebrowBadge label="Showcase" variant="showcase" secondaryLabel="Optional label" showDot={false} />,
      { colorScheme: 'light' }
    );
    expect(container.firstChild).not.toHaveClass(styles.showcaseWhenDark);
  });
});
