import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ImageGallery } from './ImageGallery.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

jest.mock('react-native/Libraries/Components/ScrollView/ScrollView', () => {
  const React = require('react');
  const { View } = require('react-native');

  return React.forwardRef((props: React.ComponentProps<typeof View>, ref: React.Ref<unknown>) => {
    React.useImperativeHandle(ref, () => ({
      scrollTo: jest.fn(),
    }));

    return <View {...props}>{props.children}</View>;
  });
});

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

const images = [
  {
    src: 'https://picsum.photos/1080/720?1',
    altText: 'Image 1',
    caption: 'Caption 1',
    credit: '(Credit 1)',
  },
  {
    src: 'https://picsum.photos/1080/720?2',
    altText: 'Image 2',
    caption: 'Caption 2',
    credit: '(Credit 2)',
  },
];

describe('ImageGallery (native)', () => {
  it('renders gallery container', () => {
    render(<ImageGallery images={images} dataTestId="gallery" />, { wrapper: ds });

    expect(screen.getByTestId('gallery')).toBeOnTheScreen();
  });

  it('renders first image caption and credit', () => {
    render(<ImageGallery images={images} />, { wrapper: ds });

    expect(screen.getByText(/Caption 1/)).toBeOnTheScreen();
  });

  it('renders images with accessibility labels', () => {
    render(<ImageGallery images={images} />, { wrapper: ds });

    expect(screen.getAllByLabelText('Image 1').length).toBeGreaterThan(0);
  });

  it('renders navigation controls when multiple images', () => {
    render(<ImageGallery images={images} />, { wrapper: ds });

    expect(screen.getAllByTestId('button')).toHaveLength(2);
  });

  it('does not render controls for single image', () => {
    render(<ImageGallery images={[images[0]]} />, { wrapper: ds });

    expect(screen.queryAllByTestId('button')).toHaveLength(0);
  });

  it('renders standard variant correctly (shows counter)', () => {
    render(<ImageGallery images={images} variant="standard" />, { wrapper: ds });

    expect(screen.getByText('1/2')).toBeOnTheScreen();
  });

  it('renders immersive variant correctly (hides counter)', () => {
    render(<ImageGallery images={images} variant="immersive" />, { wrapper: ds });

    expect(screen.queryByText('1/2')).toBeNull();
  });

  it('renders all images (looped structure)', () => {
    render(<ImageGallery images={images} variant="immersive" />, { wrapper: ds });

    // looped = 4 (last + original + first)
    expect(screen.getAllByLabelText('Image 1').length).toBeGreaterThan(1);
  });

  it('returns null when images array is empty', () => {
    const { toJSON } = render(<ImageGallery images={[]} />, { wrapper: ds });

    expect(toJSON()).toBeNull();
  });
});
