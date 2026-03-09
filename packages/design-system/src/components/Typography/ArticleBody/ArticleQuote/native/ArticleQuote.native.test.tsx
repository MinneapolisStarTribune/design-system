import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ArticleQuote } from './ArticleQuote.native';
import { ARTICLE_QUOTE_SIZES } from '../ArticleQuote.types';

const wrapper = TestWrapperInDesignSystemProvider();

describe('ArticleQuote (native)', () => {
  it('renders with default props', () => {
    render(<ArticleQuote>Quote content</ArticleQuote>, { wrapper });
    expect(screen.getByText('Quote content')).toBeOnTheScreen();
  });

  it.each(ARTICLE_QUOTE_SIZES)('renders %s size variant', (size) => {
    render(<ArticleQuote size={size}>Quote - {size}</ArticleQuote>, { wrapper });
    expect(screen.getByText(`Quote - ${size}`)).toBeOnTheScreen();
  });

  it('uses custom dataTestId', () => {
    render(<ArticleQuote dataTestId="custom-quote">Custom test id</ArticleQuote>, { wrapper });
    expect(screen.getByTestId('custom-quote')).toBeOnTheScreen();
  });
});
