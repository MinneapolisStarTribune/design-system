import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ArticleBodySponsoredHeading } from './ArticleBodySponsoredHeading.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('ArticleBodySponsoredHeading Accessibility (native)', () => {
  it('sets accessibilityRole to "header" by default', () => {
    render(
      <ArticleBodySponsoredHeading importance={1}>
        Article Body Sponsored Heading
      </ArticleBodySponsoredHeading>,
      { wrapper }
    );
    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
