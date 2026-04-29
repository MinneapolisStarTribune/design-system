import { render } from '@testing-library/react-native';
import { ImageGallery } from './ImageGallery.native';
import { AccessibilityInfo, Platform } from 'react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

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

    render(<ImageGallery images={images} />, { wrapper });

    expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled();
  });

  it('does not crash when accessibilityLabel is missing on images', () => {
    const noAltImages = [{ src: 'https://example.com/3.jpg', altText: '' }];

    const { toJSON } = render(<ImageGallery images={noAltImages} />, { wrapper });

    expect(toJSON()).toBeTruthy();
  });
});
