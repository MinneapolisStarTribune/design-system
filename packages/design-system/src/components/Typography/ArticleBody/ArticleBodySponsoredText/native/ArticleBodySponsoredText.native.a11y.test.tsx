import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ArticleBodySponsoredText } from './ArticleBodySponsoredText.native';

describe('ArticleBodySponsoredText Accessibility (native)', () => {
  it('sets accessibilityRole to "text" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<ArticleBodySponsoredText>Article Body Sponsored Text</ArticleBodySponsoredText>, {
      wrapper,
    });

    expect(screen.getByRole('text')).toBeOnTheScreen();
  });
});
