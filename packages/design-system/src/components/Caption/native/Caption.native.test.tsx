import { jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Caption } from './Caption.native';

const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
const mockTrack = jest.fn();

jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ track: mockTrack }),
}));

describe('Caption (native)', () => {
  beforeEach(() => {
    mockTrack.mockClear();
    jest.restoreAllMocks();
  });

  it('renders nothing when no content is provided', () => {
    render(<Caption />, { wrapper });

    expect(screen.queryByTestId('caption')).toBeNull();
  });

  it('renders inline caption with credit in parentheses', () => {
    render(
      <Caption caption="A scenic mountain view." credit="Star Tribune staff" variant="inline" />,
      { wrapper }
    );

    expect(screen.getByTestId('caption-caption')).toBeOnTheScreen();
    expect(screen.getByText('A scenic mountain view. (Star Tribune staff)')).toBeOnTheScreen();
  });

  it('does not render Buy Reprint when purchaseLink.label is missing', () => {
    render(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          link: 'https://www.startribune.com/photos',
        }}
      />,
      { wrapper }
    );

    expect(screen.queryByTestId('caption-purchase-link')).toBeNull();
  });

  it('does not render Buy Reprint when purchaseLink.label is empty', () => {
    render(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          label: '',
          link: 'https://www.startribune.com/photos',
        }}
      />,
      { wrapper }
    );

    expect(screen.queryByTestId('caption-purchase-link')).toBeNull();
  });

  it('does not render Buy Reprint when purchaseLink.link is missing', () => {
    render(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          label: 'Buy Reprint',
        }}
      />,
      { wrapper }
    );

    expect(screen.queryByTestId('caption-purchase-link')).toBeNull();
  });

  it('does not render Buy Reprint when purchaseLink.link is empty', () => {
    render(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          label: 'Buy Reprint',
          link: '',
        }}
      />,
      { wrapper }
    );

    expect(screen.queryByTestId('caption-purchase-link')).toBeNull();
  });

  it('renders Buy Reprint only when purchaseLink.label and link are configured', () => {
    render(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
      />,
      { wrapper }
    );

    expect(screen.getByTestId('caption-purchase-link')).toBeOnTheScreen();
    expect(screen.getByText('Buy Reprint')).toBeOnTheScreen();
  });

  it('does not render Buy Reprint when purchaseLink is omitted', () => {
    render(<Caption caption="A scenic mountain view." />, { wrapper });

    expect(screen.queryByTestId('caption-purchase-link')).toBeNull();
  });

  it('renders lightbox credit on a separate row with camera icon', () => {
    render(
      <Caption
        caption="A scenic mountain view."
        credit="Star Tribune staff"
        variant="lightbox"
        currentIndex={1}
        totalItems={5}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
      />,
      { wrapper }
    );

    expect(screen.getByTestId('caption-credit')).toBeOnTheScreen();
    expect(screen.getByText('Star Tribune staff')).toBeOnTheScreen();
    expect(screen.getByText('A scenic mountain view.')).toBeOnTheScreen();
    expect(screen.queryByText('(Star Tribune staff)')).toBeNull();
  });

  it('renders gallery pagination and navigation in lightbox variant', () => {
    render(
      <Caption
        caption="A scenic mountain view."
        variant="lightbox"
        currentIndex={2}
        totalItems={5}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
      />,
      { wrapper }
    );

    expect(screen.getByTestId('caption-pagination')).toBeOnTheScreen();
    expect(screen.getByText('2/5')).toBeOnTheScreen();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('emits analytics when Buy Reprint is pressed', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValueOnce(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(true);

    render(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
        analytics={{ module_name: 'article_body' }}
      />,
      { wrapper }
    );

    fireEvent.press(screen.getByTestId('caption-purchase-link'));

    expect(mockTrack).toHaveBeenCalledWith(
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
    const onPurchaseLinkClick = jest.fn();

    render(
      <Caption
        caption="A scenic mountain view."
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
        onPurchaseLinkClick={onPurchaseLinkClick}
      />,
      { wrapper }
    );

    fireEvent.press(screen.getByTestId('caption-purchase-link'));

    expect(onPurchaseLinkClick).toHaveBeenCalledTimes(1);
  });
});
