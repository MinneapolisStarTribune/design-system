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
    altText: 'Accessible image 1',
    caption: 'Caption 1',
  },
  {
    src: 'https://picsum.photos/1080/720?2',
    altText: 'Accessible image 2',
    caption: 'Caption 2',
  },
];

describe('ImageGallery Accessibility (native)', () => {
  it('applies accessibility label to container', () => {
    render(<ImageGallery images={images} aria-label="Image gallery" dataTestId="gallery-a11y" />, {
      wrapper: ds,
    });

    expect(screen.getByLabelText('Image gallery')).toBeOnTheScreen();
  });

  it('renders images with correct alt text', () => {
    render(<ImageGallery images={images} />, { wrapper: ds });

    expect(screen.getAllByLabelText('Accessible image 1').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Accessible image 2').length).toBeGreaterThan(0);
  });

  it('renders navigation buttons', () => {
    render(<ImageGallery images={images} />, { wrapper: ds });

    expect(screen.getAllByTestId('button')).toHaveLength(2);
  });

  it('navigation buttons are enabled (loop behavior)', () => {
    render(<ImageGallery images={images} />, { wrapper: ds });

    const [prev, next] = screen.getAllByTestId('button');

    expect(prev.props.accessibilityState?.disabled).toBeFalsy();
    expect(next.props.accessibilityState?.disabled).toBeFalsy();
  });

  it('renders caption text for accessibility', () => {
    render(<ImageGallery images={images} />, { wrapper: ds });

    expect(screen.getByText('Caption 1')).toBeOnTheScreen();
  });

  it('supports rendering without caption/credit', () => {
    render(<ImageGallery images={[{ src: 'x', altText: 'No caption' }]} />, { wrapper: ds });

    expect(screen.getByLabelText('No caption')).toBeOnTheScreen();
  });

  it('returns null when no images provided', () => {
    const { toJSON } = render(<ImageGallery images={[]} />, { wrapper: ds });

    expect(toJSON()).toBeNull();
  });
});
