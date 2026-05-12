import { render, screen, fireEvent } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

import { AuthorBioCard } from './AuthorBioCard.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('AuthorBioCard (native)', () => {
  it('renders description (required)', () => {
    render(<AuthorBioCard description="Test description" />, { wrapper });

    expect(screen.getByText('Test description')).toBeOnTheScreen();
  });

  it('renders label, name, and position', () => {
    render(<AuthorBioCard label="Author" name="John Doe" position="Writer" description="Bio" />, {
      wrapper,
    });

    expect(screen.getByText('Author')).toBeOnTheScreen();
    expect(screen.getByText('John Doe')).toBeOnTheScreen();
    expect(screen.getByText('Writer')).toBeOnTheScreen();
  });

  it('renders image with accessibility label', () => {
    render(
      <AuthorBioCard
        description="Test"
        thumbnailIcon="https://example.com/image.jpg"
        thumbnailIconAlt="author image"
      />,
      { wrapper }
    );

    expect(screen.getByLabelText('author image')).toBeOnTheScreen();
  });

  it('uses default image accessibility label when not provided', () => {
    render(<AuthorBioCard description="Test" thumbnailIcon="https://example.com/image.jpg" />, {
      wrapper,
    });

    expect(screen.getByLabelText('Author thumbnail')).toBeOnTheScreen();
  });

  it('does not render image when thumbnailIcon is missing', () => {
    render(<AuthorBioCard description="Test" />, { wrapper });

    expect(screen.queryByLabelText('Author thumbnail')).toBeNull();
  });

  it('renders CTA when valid', () => {
    render(
      <AuthorBioCard description="Test" ctaLink={{ label: 'View', link: 'https://example.com' }} />,
      { wrapper }
    );

    expect(screen.getByText('View')).toBeOnTheScreen();
  });

  it('calls onPress when CTA is pressed', () => {
    const onPress = jest.fn();

    render(<AuthorBioCard description="Test" ctaLink={{ label: 'Click', onPress }} />, {
      wrapper,
    });

    fireEvent.press(screen.getByTestId('author-bio-cta'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders CTA with default label "See More" when label is empty', () => {
    render(<AuthorBioCard description="Test" ctaLink={{ label: '', link: '/profile' }} />, {
      wrapper,
    });

    expect(screen.getByRole('link', { name: 'See More' })).toBeOnTheScreen();
  });

  it('renders with borders enabled', () => {
    render(<AuthorBioCard description="Test" hasTopBorder hasBottomBorder />, { wrapper });

    expect(screen.getByTestId('author-bio-card')).toBeOnTheScreen();
  });
});
