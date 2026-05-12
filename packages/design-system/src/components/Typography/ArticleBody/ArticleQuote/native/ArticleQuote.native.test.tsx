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

  it('uses Star Tribune quote typography family for large size', () => {
    render(<ArticleQuote size="large">Brand typography</ArticleQuote>, {
      wrapper: TestWrapperInDesignSystemProvider({ brand: 'startribune' }),
    });

    expect(screen.getByText('Brand typography')).toHaveStyle({
      fontFamily: 'Georgia',
      fontStyle: 'italic',
    });
  });

  it('uses Varsity quote typography family for large size', () => {
    render(<ArticleQuote size="large">Brand typography</ArticleQuote>, {
      wrapper: TestWrapperInDesignSystemProvider({ brand: 'varsity' }),
    });

    expect(screen.getByText('Brand typography')).toHaveStyle({
      fontFamily: 'Nohemi',
      fontStyle: 'normal',
      letterSpacing: 0.56,
    });
  });
});
