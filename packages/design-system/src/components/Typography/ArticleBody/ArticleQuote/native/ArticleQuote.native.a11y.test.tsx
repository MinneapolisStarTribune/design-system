import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ArticleQuote } from './ArticleQuote.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('ArticleQuote Accessibility (native)', () => {
  it('sets accessibilityRole to "none" by default', () => {
    render(
      <ArticleQuote dataTestId="article-quote">
        Highlight key statements or examples within an article.
      </ArticleQuote>,
      { wrapper }
    );
    const element = screen.getByTestId('article-quote');
    expect(element.props.accessibilityRole).toBe('none');
  });
});
