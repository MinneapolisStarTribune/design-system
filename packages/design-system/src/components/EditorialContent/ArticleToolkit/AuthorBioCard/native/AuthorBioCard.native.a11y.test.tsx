import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

import { AuthorBioCard } from './AuthorBioCard.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('AuthorBioCard Accessibility (native)', () => {
  it('sets accessibilityLabel on root when label provided', () => {
    render(<AuthorBioCard label="Author" description="Test" />, { wrapper });

    expect(screen.getByLabelText('Author')).toBeOnTheScreen();
  });

  it('CTA has accessibility role link', () => {
    render(
      <AuthorBioCard
        description="Test"
        ctaLink={{ label: 'View profile', link: 'https://example.com' }}
      />,
      { wrapper }
    );

    expect(screen.getByRole('link')).toBeOnTheScreen();
  });

  it('image is accessible via label', () => {
    render(
      <AuthorBioCard
        description="Test"
        thumbnailIcon="https://example.com/image.jpg"
        thumbnailIconAlt="Author image"
      />,
      { wrapper }
    );

    expect(screen.getByLabelText('Author image')).toBeOnTheScreen();
  });
});
