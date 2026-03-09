import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ArticleQuote } from './ArticleQuote.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('ArticleQuote (native)', () => {
  it('renders with default props', () => {
    render(<ArticleQuote>Quote content</ArticleQuote>, { wrapper });
    expect(screen.getByText('Quote content')).toBeOnTheScreen();
  });

  it('renders each size variant', () => {
    const sizes = ['small', 'large'] as const;
    sizes.forEach((size) => {
      render(<ArticleQuote size={size}>Quote - {size}</ArticleQuote>, { wrapper });
      expect(screen.getByText(`Quote - ${size}`)).toBeOnTheScreen();
    });
  });

  it('uses custom dataTestId', () => {
    render(<ArticleQuote dataTestId="custom-quote">Custom test id</ArticleQuote>, { wrapper });
    expect(screen.getByTestId('custom-quote')).toBeOnTheScreen();
  });

  it('sets accessibilityRole to "none" by default', () => {
    render(<ArticleQuote dataTestId="article-quote">Accessible quote</ArticleQuote>, { wrapper });
    const element = screen.getByTestId('article-quote');
    expect(element.props.accessibilityRole).toBe('none');
  });
});
