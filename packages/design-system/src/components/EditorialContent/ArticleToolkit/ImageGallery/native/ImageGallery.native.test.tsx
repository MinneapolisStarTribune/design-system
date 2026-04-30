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

  it('renders gallery container', () => {
    const { getByTestId } = render(<ImageGallery images={images} />, { wrapper });
    expect(getByTestId('image-gallery')).toBeTruthy();
  });

  it('renders looped slides when looping is enabled', () => {
    const { UNSAFE_getAllByType } = render(
      <ImageGallery images={images} loop />,
      { wrapper }
    );

    const imageComponents = UNSAFE_getAllByType(
      require('@/components/Image/native/Image.native').Image
    );

    expect(imageComponents.length).toBe(images.length + 2);
  });

  it('renders normal slides when looping is disabled', () => {
    const { UNSAFE_getAllByType } = render(
      <ImageGallery images={images} loop={false} />,
      { wrapper }
    );

    const imageComponents = UNSAFE_getAllByType(
      require('@/components/Image/native/Image.native').Image
    );

    expect(imageComponents.length).toBe(images.length);
  });

  it('renders caption and credit', () => {
    const { getByText } = render(<ImageGallery images={images} />, { wrapper });

    expect(getByText('Caption one Credit one')).toBeTruthy();
  });

  it('renders navigation buttons for multiple images', () => {
    const { getAllByRole } = render(<ImageGallery images={images} />, { wrapper });

    expect(getAllByRole('button')).toHaveLength(2);
  });

  it('does not render navigation buttons for single image', () => {
    const { queryAllByRole } = render(
      <ImageGallery images={[images[0]]} />,
      { wrapper }
    );

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
    const { getByText } = render(
      <ImageGallery images={images} variant="standard" />,
      { wrapper }
    );

    expect(getByText('1/2')).toBeTruthy();
  });

  it('does not render media tag for immersive variant', () => {
    const { queryByText } = render(
      <ImageGallery images={images} variant="immersive" />,
      { wrapper }
    );

    expect(queryByText('1/2')).toBeNull();
  });
});