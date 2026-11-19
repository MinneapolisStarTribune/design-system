import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Linking, ScrollView } from 'react-native';
import { ImageGallery } from './ImageGallery.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const _React = require('react');
  const { View } = require('react-native');
  const MockModal = ({ visible, children }: { visible?: boolean; children?: unknown }) =>
    visible ? _React.createElement(View, null, children) : null;
  return { __esModule: true, default: MockModal };
});

const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

const images = [
  {
    src: 'https://example.com/1.jpg',
    altText: 'Image one',
    caption: 'Caption one',
    credit: 'Credit one',
    width: 800,
    height: 600,
  },
  {
    src: 'https://example.com/2.jpg',
    altText: 'Image two',
    caption: 'Caption two',
    credit: 'Credit two',
    width: 800,
    height: 600,
  },
];

describe('ImageGallery (native)', () => {
  it('renders null when images array is empty', () => {
    const { toJSON } = render(<ImageGallery images={[]} />, { wrapper });
    expect(toJSON()).toBeNull();
  });

  it('renders gallery container', () => {
    const { getByTestId } = render(<ImageGallery images={images} />, { wrapper });
    expect(getByTestId('image-gallery')).toBeTruthy();
  });

  it('renders looped slides when looping is enabled', () => {
    const { UNSAFE_getAllByType } = render(<ImageGallery images={images} loop />, { wrapper });

    const imageComponents = UNSAFE_getAllByType(
      require('@/components/Image/native/Image.native').Image
    );

    expect(imageComponents.length).toBe(images.length + 2);
  });

  it('renders normal slides when looping is disabled', () => {
    const { UNSAFE_getAllByType } = render(<ImageGallery images={images} loop={false} />, {
      wrapper,
    });

    const imageComponents = UNSAFE_getAllByType(
      require('@/components/Image/native/Image.native').Image
    );

    expect(imageComponents.length).toBe(images.length);
  });

  it('renders caption and credit', () => {
    const { getByText } = render(<ImageGallery images={images} />, { wrapper });

    expect(getByText('Caption one (Credit one)')).toBeTruthy();
  });

  it('renders navigation buttons for multiple images', () => {
    const { getAllByRole } = render(<ImageGallery images={images} />, { wrapper });

    expect(getAllByRole('button')).toHaveLength(2);
  });

  it('does not render navigation buttons for single image', () => {
    const { queryAllByRole } = render(<ImageGallery images={[images[0]]} />, { wrapper });

    expect(queryAllByRole('button')).toHaveLength(0);
  });

  it('handles next button press', () => {
    const { getAllByRole } = render(<ImageGallery images={images} />, { wrapper });

    const [, next] = getAllByRole('button');
    fireEvent.press(next);

    expect(next).toBeTruthy();
  });

  it('handles prev button press', () => {
    const { getAllByRole } = render(<ImageGallery images={images} />, { wrapper });

    const [prev] = getAllByRole('button');
    fireEvent.press(prev);

    expect(prev).toBeTruthy();
  });

  it('handles momentum scroll event', () => {
    const { UNSAFE_getByType } = render(<ImageGallery images={images} />, {
      wrapper,
    });

    const scrollView = UNSAFE_getByType(ScrollView);

    fireEvent(scrollView, 'momentumScrollEnd', {
      nativeEvent: {
        contentOffset: { x: 400, y: 0 },
      },
    });

    expect(scrollView).toBeTruthy();
  });

  it('renders media tag for standard variant', () => {
    const { getByText } = render(<ImageGallery images={images} variant="standard" />, { wrapper });

    expect(getByText('1/2')).toBeTruthy();
  });

  it('does not render media tag for immersive variant', () => {
    const { queryByText } = render(<ImageGallery images={images} variant="immersive" />, {
      wrapper,
    });

    expect(queryByText('1/2')).toBeNull();
  });

  it('does not render expand controls by default', () => {
    render(<ImageGallery images={images} dataTestId="gallery" />, { wrapper });

    expect(screen.queryByTestId('gallery-expand-button-0')).toBeNull();
  });

  it('renders expand controls per slide when expandable', () => {
    render(<ImageGallery images={images} expandable dataTestId="gallery" />, { wrapper });

    expect(screen.getByTestId('gallery-expand-button-0')).toBeOnTheScreen();
    expect(screen.getByTestId('gallery-expand-button-1')).toBeOnTheScreen();
  });

  it('opens and closes expanded dialog for the pressed slide when expandable', () => {
    render(<ImageGallery images={images} expandable dataTestId="gallery" />, { wrapper });

    expect(screen.queryByTestId('gallery-dialog')).toBeNull();

    fireEvent.press(screen.getByTestId('gallery-expand-button-1'));

    expect(screen.getByTestId('gallery-dialog')).toBeOnTheScreen();
    expect(screen.getByText('Caption two')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('gallery-dialog-close-button'));

    expect(screen.queryByTestId('gallery-dialog')).toBeNull();
  });

  it('renders the Buy Reprint CTA in both carousel and dialog from the gallery-level purchaseLink', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

    render(
      <ImageGallery
        images={images}
        purchaseLink={{ label: 'Buy Reprint', link: 'https://www.startribune.com/photos' }}
        expandable
        dataTestId="gallery"
      />,
      { wrapper }
    );

    expect(screen.getByTestId('image-gallery-caption-purchase-link')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('image-gallery-caption-purchase-link'));
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('https://www.startribune.com/photos');
    });

    fireEvent.press(screen.getByTestId('gallery-expand-button-0'));
    fireEvent.press(screen.getByTestId('gallery-dialog-caption-purchase-link'));

    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenLastCalledWith('https://www.startribune.com/photos');
    });
  });

  it('renders default Buy Reprint CTA when gallery-level purchaseLink.label is missing', () => {
    render(
      <ImageGallery
        images={images}
        purchaseLink={{ link: 'https://www.startribune.com/photos' }}
        dataTestId="gallery"
      />,
      { wrapper }
    );

    expect(screen.getByTestId('image-gallery-caption-purchase-link')).toBeOnTheScreen();
    expect(screen.getByText('Buy Reprint')).toBeOnTheScreen();
  });

  it('prefers the image-level purchaseLink over the gallery-level purchaseLink in both places', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

    const imagesWithPurchase = [
      {
        ...images[0],
        purchaseLink: { label: 'Buy Reprint', link: 'https://www.startribune.com/photos?image=1' },
      },
      images[1],
    ];

    render(
      <ImageGallery
        images={imagesWithPurchase}
        purchaseLink={{ label: 'Buy Reprint', link: 'https://www.startribune.com/photos' }}
        expandable
        dataTestId="gallery"
      />,
      { wrapper }
    );

    fireEvent.press(screen.getByTestId('image-gallery-caption-purchase-link'));
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('https://www.startribune.com/photos?image=1');
    });

    fireEvent.press(screen.getByTestId('gallery-expand-button-0'));
    fireEvent.press(screen.getByTestId('gallery-dialog-caption-purchase-link'));

    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenLastCalledWith(
        'https://www.startribune.com/photos?image=1'
      );
    });
  });

  it('does not render a Buy Reprint CTA in the expanded dialog when none is configured', () => {
    render(<ImageGallery images={images} expandable dataTestId="gallery" />, { wrapper });

    fireEvent.press(screen.getByTestId('gallery-expand-button-0'));

    expect(screen.queryByTestId('gallery-dialog-caption-purchase-link')).toBeNull();
  });

  it('renders the counter and prev/next controls in the lightbox', () => {
    render(<ImageGallery images={images} expandable dataTestId="gallery" />, { wrapper });

    fireEvent.press(screen.getByTestId('gallery-expand-button-0'));

    expect(screen.getByTestId('gallery-dialog-caption-pagination')).toHaveTextContent('1/2');
    expect(screen.getByTestId('gallery-dialog-caption-previous')).toBeOnTheScreen();
    expect(screen.getByTestId('gallery-dialog-caption-next')).toBeOnTheScreen();
  });

  it('advances to the next image from the lightbox', () => {
    render(<ImageGallery images={images} expandable dataTestId="gallery" />, { wrapper });

    fireEvent.press(screen.getByTestId('gallery-expand-button-0'));
    expect(screen.getByText('Caption one')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('gallery-dialog-caption-next'));

    expect(screen.getByText('Caption two')).toBeOnTheScreen();
    expect(screen.getByTestId('gallery-dialog-caption-pagination')).toHaveTextContent('2/2');
  });

  it('fires onIndexChange with the 1-based logical index after a momentum scroll', () => {
    const onIndexChange = jest.fn();
    const { UNSAFE_getByType } = render(
      <ImageGallery images={images} onIndexChange={onIndexChange} />,
      { wrapper }
    );
    const scrollView = UNSAFE_getByType(ScrollView);

    fireEvent(scrollView, 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: 400, y: 0 } },
    });

    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it('moves to a new initialIndex when the prop changes', () => {
    const scrollTo = jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(jest.fn());
    const { rerender } = render(<ImageGallery images={images} initialIndex={0} />, { wrapper });
    expect(screen.getByText('1/2')).toBeTruthy();
    scrollTo.mockClear();

    rerender(<ImageGallery images={images} initialIndex={1} />);

    expect(screen.getByText('2/2')).toBeTruthy();
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ animated: false }));
    scrollTo.mockRestore();
  });

  it('does not undo a swipe by the reader when re-rendered with the same initialIndex', () => {
    const { rerender, UNSAFE_getByType } = render(
      <ImageGallery images={images} initialIndex={0} />,
      {
        wrapper,
      }
    );
    fireEvent(UNSAFE_getByType(ScrollView), 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: 400, y: 0 } },
    });
    expect(screen.getByText('2/2')).toBeTruthy();

    rerender(<ImageGallery images={images} initialIndex={0} />);

    expect(screen.getByText('2/2')).toBeTruthy();
  });

  it('stays where it is when initialIndex becomes undefined', () => {
    const { rerender } = render(<ImageGallery images={images} initialIndex={1} />, { wrapper });
    expect(screen.getByText('2/2')).toBeTruthy();

    rerender(<ImageGallery images={images} />);

    expect(screen.getByText('2/2')).toBeTruthy();
  });

  it('initializes the active slide from initialIndex', () => {
    render(<ImageGallery images={images} initialIndex={1} />, { wrapper });

    expect(screen.getByText('2/2')).toBeTruthy();
  });

  it('scrolls to initialIndex when images load into an empty gallery at the same width', () => {
    const scrollTo = jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(jest.fn());
    const { rerender } = render(<ImageGallery images={[]} initialIndex={1} />, { wrapper });
    scrollTo.mockClear();

    rerender(<ImageGallery images={images} initialIndex={1} />);

    expect(screen.getByText('2/2')).toBeTruthy();
    const lastCall = scrollTo.mock.calls[scrollTo.mock.calls.length - 1][0] as {
      x: number;
      animated: boolean;
    };
    expect(lastCall.animated).toBe(false);
    expect(lastCall.x).toBeGreaterThan(0);
    scrollTo.mockRestore();
  });

  it('keeps initialIndex when images load into an empty looping gallery', () => {
    const threeImages = [1, 2, 3].map((n) => ({
      src: `https://example.com/${n}.jpg`,
      altText: `Image ${n}`,
      width: 800,
      height: 600,
    }));
    const { rerender } = render(<ImageGallery images={[]} variant="immersive" initialIndex={1} />, {
      wrapper,
    });

    rerender(<ImageGallery images={threeImages} variant="immersive" initialIndex={1} />);

    // The immersive variant has no "N/total" tag, so the active image shows in the footer controls.
    expect(screen.getByLabelText('Previous image (1 of 3)')).toBeTruthy();
    expect(screen.getByLabelText('Next image (3 of 3)')).toBeTruthy();
  });

  it('clamps an out-of-range initialIndex', () => {
    const threeImages = [1, 2, 3].map((n) => ({
      src: `https://example.com/${n}.jpg`,
      altText: `Image ${n}`,
      width: 800,
      height: 600,
    }));
    render(<ImageGallery images={threeImages} initialIndex={5} />, { wrapper });

    expect(screen.getByText('3/3')).toBeTruthy();
  });

  it('clamps an out-of-range initialIndex when the prop changes', () => {
    const threeImages = [1, 2, 3].map((n) => ({
      src: `https://example.com/${n}.jpg`,
      altText: `Image ${n}`,
      width: 800,
      height: 600,
    }));
    const { rerender } = render(<ImageGallery images={threeImages} initialIndex={0} />, {
      wrapper,
    });

    rerender(<ImageGallery images={threeImages} initialIndex={5} />);

    expect(screen.getByText('3/3')).toBeTruthy();
  });

  it('keeps the current image when a looping gallery drops to a single image', () => {
    const threeImages = [1, 2, 3].map((n) => ({
      src: `https://example.com/${n}.jpg`,
      altText: `Image ${n}`,
      caption: `Caption ${n}`,
      width: 800,
      height: 600,
    }));
    const { rerender } = render(
      <ImageGallery images={threeImages} variant="immersive" initialIndex={0} />,
      { wrapper }
    );

    rerender(<ImageGallery images={[threeImages[0]]} variant="immersive" initialIndex={0} />);

    expect(screen.getByText('Caption 1')).toBeTruthy();
  });

  it('repositions the carousel in standard mode when the container width changes', () => {
    const { UNSAFE_getByType } = render(<ImageGallery images={images} />, { wrapper });

    fireEvent(UNSAFE_getByType(ScrollView), 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: 400, y: 0 } },
    });
    expect(screen.getByText('2/2')).toBeTruthy();

    fireEvent(screen.getByTestId('image-gallery'), 'layout', {
      nativeEvent: { layout: { width: 812, height: 375 } },
    });

    expect(screen.getByText('2/2')).toBeTruthy();
  });

  it('goes back to the previous image from the lightbox', () => {
    render(<ImageGallery images={images} expandable dataTestId="gallery" />, { wrapper });

    fireEvent.press(screen.getByTestId('gallery-expand-button-1'));
    expect(screen.getByText('Caption two')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('gallery-dialog-caption-previous'));

    expect(screen.getByText('Caption one')).toBeOnTheScreen();
    expect(screen.getByTestId('gallery-dialog-caption-pagination')).toHaveTextContent('1/2');
  });
});
