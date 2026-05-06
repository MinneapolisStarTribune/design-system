import { EyebrowBadge } from './EyebrowBadge';
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
});
