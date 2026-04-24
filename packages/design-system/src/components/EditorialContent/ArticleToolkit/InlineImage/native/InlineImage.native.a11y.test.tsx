import { fireEvent, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { InlineImage } from './InlineImage.native';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const { View } = require('react-native');
  const MockModal = ({ visible, children }: { visible?: boolean; children?: unknown }) =>
    visible ? <View>{children}</View> : null;
  return MockModal;
});

describe('InlineImage Accessibility (native)', () => {
  const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
  const image = {
    src: 'https://picsum.photos/id/1018/1200/800',
    altText: 'Alternative text for the image',
  };

  it('exposes image semantics with accessible name', () => {
    render(<InlineImage image={image} />, { wrapper });

    const imageNode = screen.getByTestId('inline-image-image');
    expect(imageNode).toBeOnTheScreen();
    expect(imageNode.props.accessibilityRole).toBe('image');
    expect(imageNode.props.accessibilityLabel).toBe(image.altText);
  });

  it('exposes purchase link semantics when purchaseLink is provided', () => {
    render(<InlineImage image={image} caption="Caption" purchaseLink="https://example.com" />, {
      wrapper,
    });

    expect(screen.getByRole('link', { name: 'Buy Reprint' })).toBeOnTheScreen();
  });

  it('exposes expand and close controls when expandable', () => {
    render(<InlineImage image={image} expandable caption="Caption text" credit="Photo credit" />, {
      wrapper,
    });

    fireEvent.press(screen.getByRole('button', { name: 'Expand image' }));
    expect(screen.getByRole('button', { name: 'Close expanded image' })).toBeOnTheScreen();
    expect(screen.getByText('Photo credit')).toBeOnTheScreen();
  });
});
