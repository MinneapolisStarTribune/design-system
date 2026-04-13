import { render, screen, fireEvent } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

import { AuthorBioCardNative } from './AuthorBioCard.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('AuthorBioCardNative (native)', () => {
  it('renders description (required)', () => {
    render(<AuthorBioCardNative description="Test description" />, { wrapper });

    expect(screen.getByText('Test description')).toBeOnTheScreen();
  });

  it('renders label, name, and position', () => {
    render(
      <AuthorBioCardNative label="Author" name="John Doe" position="Writer" description="Bio" />,
      { wrapper }
    );

    expect(screen.getByText('Author')).toBeOnTheScreen();
    expect(screen.getByText('John Doe')).toBeOnTheScreen();
    expect(screen.getByText('Writer')).toBeOnTheScreen();
  });

  it('renders image with accessibility label', () => {
    render(
      <AuthorBioCardNative
        description="Test"
        thumbnailIcon="https://example.com/image.jpg"
        thumbnailIconAlt="author image"
      />,
      { wrapper }
    );

    expect(screen.getByLabelText('author image')).toBeOnTheScreen();
  });

  it('uses default image accessibility label when not provided', () => {
    render(
      <AuthorBioCardNative description="Test" thumbnailIcon="https://example.com/image.jpg" />,
      { wrapper }
    );

    expect(screen.getByLabelText('Author thumbnail')).toBeOnTheScreen();
  });

  it('does not render image when thumbnailIcon is missing', () => {
    render(<AuthorBioCardNative description="Test" />, { wrapper });

    expect(screen.queryByLabelText('Author thumbnail')).toBeNull();
  });

  it('renders CTA when valid', () => {
    render(
      <AuthorBioCardNative
        description="Test"
        ctaLink={{ label: 'View', link: 'https://example.com' }}
      />,
      { wrapper }
    );

    expect(screen.getByText('View')).toBeOnTheScreen();
  });

  it('calls onPress when CTA is pressed', () => {
    const onPress = jest.fn();

    render(<AuthorBioCardNative description="Test" ctaLink={{ label: 'Click', onPress }} />, {
      wrapper,
    });

    fireEvent.press(screen.getByTestId('author-bio-cta'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not render CTA when label is missing', () => {
    render(
      <AuthorBioCardNative
        description="Test"
        ctaLink={{ label: '', link: 'https://example.com' }}
      />,
      { wrapper }
    );

    expect(screen.queryByTestId('author-bio-cta')).toBeNull();
  });

  it('renders with borders enabled', () => {
    render(<AuthorBioCardNative description="Test" hasTopBorder hasBottomBorder />, { wrapper });

    expect(screen.getByTestId('author-bio-card')).toBeOnTheScreen();
  });
});
