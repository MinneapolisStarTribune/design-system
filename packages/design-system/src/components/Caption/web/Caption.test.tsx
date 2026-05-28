import { fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProvider } from '@/test-utils/render';
import { Caption } from './Caption';

describe('Caption', () => {
  it('renders nothing when no content is provided', () => {
    const { queryByTestId } = renderWithProvider(<Caption />);

    expect(queryByTestId('caption')).not.toBeInTheDocument();
  });

  it('renders inline caption with credit in parentheses', () => {
    renderWithProvider(
      <Caption caption="A scenic mountain view." credit="Star Tribune staff" variant="inline" />
    );

    expect(screen.getByTestId('caption-caption')).toHaveTextContent(
      'A scenic mountain view. (Star Tribune staff)'
    );
  });

  it('renders Buy Reprint only when purchaseLink.link is configured', () => {
    renderWithProvider(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
      />
    );

    expect(screen.getByTestId('caption-purchase-link')).toHaveAttribute(
      'href',
      'https://www.startribune.com/photos'
    );
  });

  it('does not render Buy Reprint when purchaseLink is omitted', () => {
    renderWithProvider(<Caption caption="A scenic mountain view." />);

    expect(screen.queryByTestId('caption-purchase-link')).not.toBeInTheDocument();
  });

  it('renders lightbox credit on a separate row with camera icon', () => {
    renderWithProvider(
      <Caption
        caption="A scenic mountain view."
        credit="Star Tribune staff"
        variant="lightbox"
        currentIndex={1}
        totalItems={5}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(screen.getByTestId('caption-credit')).toHaveTextContent('Star Tribune staff');
    expect(screen.getByTestId('caption-caption')).toHaveTextContent('A scenic mountain view.');
    expect(screen.getByTestId('caption-caption')).not.toHaveTextContent('(');
  });

  it('renders gallery pagination and navigation in lightbox variant', () => {
    renderWithProvider(
      <Caption
        caption="A scenic mountain view."
        variant="lightbox"
        currentIndex={2}
        totalItems={5}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(screen.getByTestId('caption-pagination')).toHaveTextContent('2/5');
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('renders gallery navigation (without pagination) in inline variant', () => {
    renderWithProvider(
      <Caption
        caption="A scenic mountain view."
        variant="inline"
        currentIndex={2}
        totalItems={5}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(screen.queryByTestId('caption-pagination')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('keeps edge navigation enabled when loopNavigation is true', () => {
    renderWithProvider(
      <Caption
        caption="A scenic mountain view."
        variant="inline"
        currentIndex={1}
        totalItems={5}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        loopNavigation
      />
    );

    expect(screen.getAllByRole('button')[0]).not.toBeDisabled();
  });

  it('emits analytics when Buy Reprint is clicked', () => {
    const mockOnTrackingEvent = vi.fn();

    renderWithProvider(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
        analytics={{ module_name: 'article_body' }}
      />,
      { mockOnTrackingEvent }
    );

    fireEvent.click(screen.getByTestId('caption-purchase-link'));

    expect(mockOnTrackingEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'link_click',
        component: 'Caption',
        label: 'Buy Reprint',
        cta_type: 'buy_reprint',
        href: 'https://www.startribune.com/photos',
        variant: 'inline',
        module_name: 'article_body',
      })
    );
  });

  it('calls onPurchaseLinkClick after analytics tracking', () => {
    const onPurchaseLinkClick = vi.fn();

    renderWithProvider(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          link: 'https://www.startribune.com/photos',
        }}
        onPurchaseLinkClick={onPurchaseLinkClick}
      />
    );

    fireEvent.click(screen.getByTestId('caption-purchase-link'));

    expect(onPurchaseLinkClick).toHaveBeenCalledTimes(1);
  });
});
