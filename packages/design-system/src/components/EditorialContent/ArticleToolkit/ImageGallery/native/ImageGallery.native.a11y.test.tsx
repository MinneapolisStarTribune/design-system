import { render, fireEvent, screen } from '@testing-library/react-native';
import { ImageGallery } from './ImageGallery.native';
import { AccessibilityInfo, Platform, ScrollView } from 'react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const _React = require('react');
  const { View } = require('react-native');
  const MockModal = ({ visible, children }: { visible?: boolean; children?: unknown }) =>
    visible ? _React.createElement(View, null, children) : null;
  return { __esModule: true, default: MockModal };
});

jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(jest.fn());

const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

const images = [
  {
    src: 'https://example.com/1.jpg',
    altText: 'Accessible image one',
    width: 800,
    height: 600,
  },
  {
    src: 'https://example.com/2.jpg',
    altText: 'Accessible image two',
    width: 800,
    height: 600,
  },
];

describe('ImageGallery Accessibility (native)', () => {
  it('applies accessibilityLabel to gallery container', () => {
    const { getByLabelText } = render(<ImageGallery images={images} aria-label="Image gallery" />, {
      wrapper,
    });

    expect(getByLabelText('Image gallery')).toBeOnTheScreen();
  });

  it('images expose proper accessibility labels', () => {
    const { getAllByRole } = render(<ImageGallery images={images} />, { wrapper });

    const labels = getAllByRole('image').map((img) => img.props.accessibilityLabel);

    expect(labels).toContain('Accessible image one');
    expect(labels).toContain('Accessible image two');
  });

  it('navigation buttons use role button', () => {
    const { getAllByRole } = render(<ImageGallery images={images} />, {
      wrapper,
    });

    const buttons = getAllByRole('button');

    expect(buttons.length).toBeGreaterThan(0);
  });

  it('announces slide changes on native platforms', () => {
    if (Platform.OS === 'web') return;

    const { UNSAFE_getByType } = render(<ImageGallery images={images} />, { wrapper });

    const scrollView = UNSAFE_getByType(ScrollView);
    fireEvent(scrollView, 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: 400, y: 0 } },
    });

    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      expect.stringMatching(/Image \d+ of \d+/)
    );
  });

  it('does not crash when accessibilityLabel is missing on images', () => {
    const noAltImages = [{ src: 'https://example.com/3.jpg', altText: '' }];

    const { toJSON } = render(<ImageGallery images={noAltImages} />, { wrapper });

    expect(toJSON()).toBeTruthy();
  });

  it('exposes expand and close controls when expandable', () => {
    render(
      <ImageGallery
        images={[
          {
            src: 'https://example.com/1.jpg',
            altText: 'Accessible image one',
            caption: 'Caption text',
            credit: 'Photo credit',
            width: 800,
            height: 600,
          },
        ]}
        expandable
        dataTestId="gallery-a11y"
      />,
      { wrapper }
    );

    fireEvent.press(screen.getByRole('button', { name: 'Expand image 1 of 1' }));
    expect(screen.getByRole('button', { name: 'Close expanded image' })).toBeOnTheScreen();
    expect(screen.getByText('Photo credit')).toBeOnTheScreen();
  });
});
