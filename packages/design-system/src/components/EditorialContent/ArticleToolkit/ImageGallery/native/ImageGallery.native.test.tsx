import { render, fireEvent, screen } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
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

  it('renders the Buy Reprint CTA in the carousel from a per-image purchaseLink', () => {
    const imagesWithPurchase = [
      {
        ...images[0],
        purchaseLink: { label: 'Buy Reprint', link: 'https://www.startribune.com/photos?image=1' },
      },
      images[1],
    ];

    render(<ImageGallery images={imagesWithPurchase} dataTestId="gallery" />, { wrapper });

    expect(screen.getByTestId('image-gallery-caption-purchase-link')).toBeOnTheScreen();
  });

  it('renders the Buy Reprint CTA in the expanded dialog from a per-image purchaseLink', () => {
    const imagesWithPurchase = [
      {
        ...images[0],
        purchaseLink: { label: 'Buy Reprint', link: 'https://www.startribune.com/photos?image=1' },
      },
      images[1],
    ];

    render(<ImageGallery images={imagesWithPurchase} expandable dataTestId="gallery" />, {
      wrapper,
    });

    expect(screen.queryByTestId('gallery-dialog-caption-purchase-link')).toBeNull();

    fireEvent.press(screen.getByTestId('gallery-expand-button-0'));

    expect(screen.getByTestId('gallery-dialog-caption-purchase-link')).toBeOnTheScreen();
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

  it('goes back to the previous image from the lightbox', () => {
    render(<ImageGallery images={images} expandable dataTestId="gallery" />, { wrapper });

    fireEvent.press(screen.getByTestId('gallery-expand-button-1'));
    expect(screen.getByText('Caption two')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('gallery-dialog-caption-previous'));

    expect(screen.getByText('Caption one')).toBeOnTheScreen();
    expect(screen.getByTestId('gallery-dialog-caption-pagination')).toHaveTextContent('1/2');
  });
});
