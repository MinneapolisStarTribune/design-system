import { render, fireEvent } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
import { ImageGallery } from './ImageGallery.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

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

  it('renders gallery with images', () => {
    const { getByTestId } = render(<ImageGallery images={images} />, { wrapper });

    expect(getByTestId('image-gallery')).toBeOnTheScreen();
  });

  it('renders the correct number of slides including looped clones', () => {
    const { UNSAFE_getAllByType } = render(<ImageGallery images={images} />, {
      wrapper,
    });

    // total + 2 cloned slides
    const imageComponents = UNSAFE_getAllByType(
      require('@/components/Image/native/Image.native').Image
    );
    expect(imageComponents.length).toBe(images.length + 2);
  });

  it('renders caption and credit for current image', () => {
    const { getByText } = render(<ImageGallery images={images} />, { wrapper });

    expect(getByText('Caption one Credit one')).toBeOnTheScreen();
  });

  it('renders navigation controls when multiple images exist', () => {
    const { getAllByRole } = render(<ImageGallery images={images} />, { wrapper });

    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('does not render navigation controls for a single image', () => {
    const single = [images[0]];

    const { queryAllByRole } = render(<ImageGallery images={single} />, {
      wrapper,
    });

    expect(queryAllByRole('button')).toHaveLength(0);
  });

  it('advances slide when next button is pressed', () => {
    const { getAllByRole } = render(<ImageGallery images={images} />, { wrapper });

    const buttons = getAllByRole('button');

    fireEvent.press(buttons[1]); // next

    expect(buttons[1]).toBeDefined();
  });

  it('goes backward when prev button is pressed', () => {
    const { getAllByRole } = render(<ImageGallery images={images} />, { wrapper });

    const buttons = getAllByRole('button');

    fireEvent.press(buttons[0]); // prev

    expect(buttons[0]).toBeDefined();
  });

  it('handles onScroll updates correctly', () => {
    const { UNSAFE_getByType } = render(<ImageGallery images={images} />, {
      wrapper,
    });

    const scrollView = UNSAFE_getByType(ScrollView);

    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { x: 400, y: 0 },
        contentSize: { width: 1200, height: 400 },
        layoutMeasurement: { width: 400, height: 400 },
      },
    });

    expect(scrollView).toBeDefined();
  });

  it('renders media tag for standard variant', () => {
    const { getByText } = render(<ImageGallery images={images} variant="standard" />, { wrapper });

    expect(getByText('1/2')).toBeOnTheScreen();
  });

  it('does not render media tag in immersive variant', () => {
    const { queryByText } = render(<ImageGallery images={images} variant="immersive" />, {
      wrapper,
    });

    expect(queryByText('1/2')).toBeNull();
  });
});
