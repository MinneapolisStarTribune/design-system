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

  it('renders all sizes with accessible text content', () => {
    const sizes = ['small', 'large'] as const;
    sizes.forEach((size) => {
      render(
        <ArticleQuote size={size}>{size} quote — visual emphasis for key moments.</ArticleQuote>,
        { wrapper }
      );
      expect(
        screen.getByText(`${size} quote — visual emphasis for key moments.`)
      ).toBeOnTheScreen();
    });
  });

  it('forwards aria-label to the underlying element', () => {
    render(
      <ArticleQuote dataTestId="article-quote" aria-label="Featured pull quote">
        Custom accessible article quote
      </ArticleQuote>,
      { wrapper }
    );
    const element = screen.getByTestId('article-quote');
    expect(element.props['aria-label']).toBe('Featured pull quote');
  });
});
