import { render, screen } from '@testing-library/react';
import { ArticleQuote } from './ArticleQuote';
import { ARTICLE_QUOTE_SIZES } from '../ArticleQuote.types';

describe('ArticleQuote', () => {
  it('renders with default props', () => {
    render(<ArticleQuote>Quote content</ArticleQuote>);
    const element = screen.getByTestId('article-quote');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Quote content');
    expect(element.tagName).toBe('BLOCKQUOTE');
    expect(element).toHaveClass('typography-article-quote-large');
  });

  it.each(ARTICLE_QUOTE_SIZES)('applies the correct class for %s size', (size) => {
    render(
      <ArticleQuote size={size} dataTestId={`article-quote-${size}`}>
        Quote - {size}
      </ArticleQuote>
    );
    const element = screen.getByTestId(`article-quote-${size}`);
    expect(element).toHaveClass(`typography-article-quote-${size}`);
  });

  it('merges custom className with typography class', () => {
    render(
      <ArticleQuote size="small" className="custom-class" dataTestId="article-quote">
        Custom class quote
      </ArticleQuote>
    );
    const element = screen.getByTestId('article-quote');
    expect(element).toHaveClass('typography-article-quote-small');
    expect(element).toHaveClass('custom-class');
  });

  it('passes through accessibility props', () => {
    render(
      <ArticleQuote aria-label="Featured quote" dataTestId="article-quote">
        Accessible quote
      </ArticleQuote>
    );
    const element = screen.getByTestId('article-quote');
    expect(element).toHaveAttribute('aria-label', 'Featured quote');
  });
});
